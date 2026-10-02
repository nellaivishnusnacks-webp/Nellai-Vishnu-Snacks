import { supabase, supabaseConfig } from './supabase'

export class CatalogueConfigError extends Error {
  constructor() {
    super('The public catalogue connection is not configured.')
    this.name = 'CatalogueConfigError'
  }
}

const publicImageUrl = (imagePath) => {
  if (!imagePath || !supabase) return undefined
  return supabase.storage.from('product-images').getPublicUrl(imagePath).data.publicUrl
}

const mapCategory = (row) => ({
  id: row.id,
  name: row.name,
  nameEnglish: row.name_english,
  description: row.name_english,
  slug: row.slug,
})

const mapProduct = (row) => ({
  id: row.id,
  name: row.name,
  category: row.categories?.name || '',
  categoryEnglish: row.categories?.name_english || '',
  categorySlug: row.categories?.slug || '',
  weight: row.pack_size,
  price: Number(row.price),
  image: publicImageUrl(row.image_path),
  description: row.description,
  available: row.available,
  showOnHome: row.show_on_home,
  hideOnHome: !row.show_on_home,
  slug: row.slug,
})

export async function getCatalogue() {
  if (!supabaseConfig.configured || !supabase) throw new CatalogueConfigError()

  const [categoriesResult, productsResult] = await Promise.all([
    supabase
      .from('categories')
      .select('id, name, name_english, slug, sort_order')
      .order('sort_order', { ascending: true }),
    supabase
      .from('products')
      .select('id, category_id, name, slug, price, pack_size, image_path, description, available, show_on_home, sort_order, categories!inner(id, name, name_english, slug)')
      .eq('available', true)
      .order('sort_order', { ascending: true }),
  ])

  if (categoriesResult.error || productsResult.error) {
    throw new Error('The catalogue is temporarily unavailable.')
  }

  return {
    categories: (categoriesResult.data || []).map(mapCategory),
    products: (productsResult.data || []).map(mapProduct),
  }
}
