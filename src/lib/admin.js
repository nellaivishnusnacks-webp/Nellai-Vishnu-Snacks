import { supabase } from './supabase'

export const ADMIN_USER_ID = '7d9bbfcb-1f60-4415-9a04-221ce008aae7'
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024
export const MAX_COMPRESSED_IMAGE_BYTES = 250 * 1024
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

function requireClient() {
  if (!supabase) throw new Error('Supabase is not configured.')
  return supabase
}

export async function getAdminSession() {
  const client = requireClient()
  const { data, error } = await client.auth.getSession()
  if (error) throw error
  if (data.session && data.session.user.id !== ADMIN_USER_ID) {
    await client.auth.signOut()
    return null
  }
  return data.session
}

export function subscribeToAuth(callback) {
  if (!supabase) return { unsubscribe: () => {} }
  return supabase.auth.onAuthStateChange((_event, session) => callback(session?.user?.id === ADMIN_USER_ID ? session : null)).data.subscription
}

export async function signInAdmin(email, password) {
  const client = requireClient()
  const { data, error } = await client.auth.signInWithPassword({ email, password })
  if (error) throw new Error('The email or password is incorrect.')
  if (data.user?.id !== ADMIN_USER_ID) {
    await client.auth.signOut()
    throw new Error('This account is not authorised for the admin dashboard.')
  }
  return data.session
}

export async function signOutAdmin() {
  const client = requireClient()
  const { error } = await client.auth.signOut()
  if (error) throw error
}

export async function deleteProduct(product) {
  const client = requireClient()
  if (!product?.id) throw new Error('The product could not be identified.')
  const { data, error } = await client.from('products').delete().eq('id', product.id).select('id').maybeSingle()
  if (error) {
    console.error('Admin product delete failed', { code: error.code, message: error.message, details: error.details, hint: error.hint })
    throw new Error('The product could not be deleted. Check your permissions and try again.')
  }
  if (!data) throw new Error('The product was not deleted. Check the owner permissions and try again.')

  if (product.image_path) {
    const { error: imageError } = await client.storage.from('product-images').remove([product.image_path])
    if (imageError) throw new Error('The product was deleted, but its image could not be cleaned up. Remove that image from Storage before reusing its path.')
  }
}

export async function getAdminCatalogue() {
  const client = requireClient()
  const [categoriesResult, productsResult] = await Promise.all([
    client.from('categories').select('id, name, name_english, slug, sort_order').order('sort_order', { ascending: true }),
    client.from('products').select('id, category_id, name, slug, price, pack_size, image_path, description, available, show_on_home, sort_order, categories!inner(id, name, name_english, slug)').order('sort_order', { ascending: true }),
  ])
  if (categoriesResult.error || productsResult.error) throw new Error('Unable to load the catalogue right now.')
  return { categories: categoriesResult.data || [], products: productsResult.data || [] }
}

export function validateImage(file) {
  if (!file) return null
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) throw new Error('Choose a JPG, PNG, WebP, or GIF image.')
  if (file.size > MAX_IMAGE_BYTES) throw new Error('Images must be 5 MB or smaller.')
  return file
}

export function getProductImageUrl(imagePath) {
  if (!imagePath) return undefined
  const client = requireClient()
  return client.storage.from('product-images').getPublicUrl(imagePath).data.publicUrl
}

const formatOutputType = () => 'WebP'

function canvasBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('The image could not be compressed in this browser.')), type, quality))
}

async function decodeImage(file) {
  if (typeof createImageBitmap === 'function') return createImageBitmap(file)
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => { URL.revokeObjectURL(url); resolve(image) }
    image.onerror = () => { URL.revokeObjectURL(url); reject(new Error('The selected image could not be read.')) }
    image.src = url
  })
}

export async function compressImage(file, onProgress = () => {}) {
  validateImage(file)
  onProgress({ phase: 'compressing', originalBytes: file.size, finalBytes: null, format: null })
  const image = await decodeImage(file)
  const sourceWidth = image.width
  const sourceHeight = image.height
  if (!sourceWidth || !sourceHeight) throw new Error('The selected image has no usable dimensions.')

  const maxDimension = 1600
  const initialScale = Math.min(1, maxDimension / Math.max(sourceWidth, sourceHeight))
  const canvas = document.createElement('canvas')
  const probe = document.createElement('canvas')
  if (!probe.toDataURL('image/webp').startsWith('data:image/webp')) throw new Error('This browser cannot create WebP images. Use a modern browser to upload product photography.')
  const types = ['image/webp']

  for (const scale of [initialScale, initialScale * 0.85, initialScale * 0.7, initialScale * 0.55, initialScale * 0.4, initialScale * 0.3]) {
    canvas.width = Math.max(1, Math.floor(sourceWidth * scale))
    canvas.height = Math.max(1, Math.floor(sourceHeight * scale))
    const context = canvas.getContext('2d', { alpha: true })
    if (!context) throw new Error('This browser cannot prepare the image for upload.')
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    for (const type of types) {
      for (const quality of [0.82, 0.72, 0.62, 0.52, 0.42, 0.32]) {
        const blob = await canvasBlob(canvas, type, quality)
        if (blob.size <= MAX_COMPRESSED_IMAGE_BYTES) {
          const result = { blob, originalBytes: file.size, finalBytes: blob.size, format: formatOutputType(type), width: canvas.width, height: canvas.height }
          onProgress({ ...result, phase: 'compressed' })
          return result
        }
      }
    }
  }
  throw new Error('This image could not be compressed below 250 KB. Choose a simpler or smaller image.')
}

const safeFileName = (name) => name.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-|-$/g, '') || 'product-image'

export async function uploadProductImage(compressedImage, originalName, productId, onProgress = () => {}) {
  const client = requireClient()
  const extension = 'webp'
  const baseName = safeFileName(originalName).replace(/\.[^.]+$/, '') || 'product-image'
  const path = `${productId}/${crypto.randomUUID()}-${baseName}.${extension}`
  onProgress({ ...compressedImage, phase: 'uploading' })
  const { error } = await client.storage.from('product-images').upload(path, compressedImage.blob, { upsert: false, contentType: compressedImage.blob.type })
  if (error) throw new Error('The image could not be uploaded. Please try again.')
  return path
}

export async function saveProduct(product, imageFile, onImageProgress = () => {}) {
  const client = requireClient()
  const compressedImage = imageFile ? await compressImage(imageFile, onImageProgress) : null
  const payload = {
    category_id: product.category_id,
    name: product.name.trim(),
    slug: product.slug || `product-${crypto.randomUUID().slice(0, 8)}`,
    price: Number(product.price),
    pack_size: product.pack_size.trim(),
    image_path: product.image_path || null,
    description: product.description?.trim() || null,
    available: Boolean(product.available),
    show_on_home: Boolean(product.show_on_home),
    sort_order: Number(product.sort_order),
  }
  const result = product.id
    ? await client.from('products').update(payload).eq('id', product.id).select('id').single()
    : await client.from('products').insert(payload).select('id').single()
  if (result.error) {
    console.error('Admin product save failed', { code: result.error.code, message: result.error.message, details: result.error.details, hint: result.error.hint })
    throw new Error('The product could not be saved. Check the fields and try again.')
  }
  const id = result.data.id
  if (compressedImage) {
    const imagePath = await uploadProductImage(compressedImage, imageFile.name, id, onImageProgress)
    const imageUpdate = await client.from('products').update({ image_path: imagePath }).eq('id', id)
    if (imageUpdate.error) {
      await client.storage.from('product-images').remove([imagePath])
      throw new Error('The product was saved, but its image could not be linked. Please try again.')
    }
    if (product.id && product.image_path && product.image_path !== imagePath) {
      const { error: oldImageError } = await client.storage.from('product-images').remove([product.image_path])
      if (oldImageError) throw new Error('The product was saved with the new image, but the previous image could not be cleaned up.')
    }
  }
  return id
}
