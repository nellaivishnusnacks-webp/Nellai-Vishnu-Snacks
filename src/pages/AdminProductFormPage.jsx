import { useEffect, useMemo, useState } from 'react'
import { getAdminCatalogue, getProductImageUrl, saveProduct, validateImage } from '../lib/admin'

const emptyProduct = { name: '', category_id: '', price: '', pack_size: '', description: '', available: true, show_on_home: false, sort_order: 0, slug: '', image_path: '' }
const formatBytes = (bytes) => bytes == null ? '—' : `${(bytes / 1024).toFixed(bytes < 1024 * 1024 ? 0 : 1)} KB`

export default function AdminProductFormPage({ productId, onNavigate }) {
  const [form, setForm] = useState(emptyProduct)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(Boolean(productId))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imageInfo, setImageInfo] = useState(null)

  useEffect(() => { (async () => { try { const data = await getAdminCatalogue(); setCategories(data.categories); if (productId) { const existing = data.products.find((item) => item.id === productId); if (!existing) throw new Error('Product not found.'); setForm({ ...existing, category_id: existing.category_id, price: String(existing.price), description: existing.description || '', image_path: existing.image_path || '' }) } else setForm((current) => ({ ...current, category_id: data.categories[0]?.id || '' })) } catch (err) { setError(err.message || 'Unable to load the product.') } finally { setLoading(false) } })() }, [productId])

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const imageLabel = useMemo(() => imageFile ? `${imageFile.name} selected` : form.image_path ? 'Existing image saved' : 'No image selected', [imageFile, form.image_path])
  const imageUrl = form.image_path ? getProductImageUrl(form.image_path) : undefined

  function chooseImage(event) {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      validateImage(file)
      setImageFile(file)
      setImageInfo({ phase: 'ready', originalBytes: file.size, finalBytes: null, format: null })
      setError('')
    } catch (err) {
      setImageFile(null)
      setImageInfo(null)
      setError(err.message)
    }
  }

  async function submit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')
    const price = Number(form.price)
    const sortOrder = Number(form.sort_order)
    if (!form.name.trim() || !form.category_id || !form.pack_size.trim() || form.price === '' || !Number.isFinite(price) || price < 0 || !Number.isInteger(sortOrder) || sortOrder < 0) {
      setError('Enter a name, category, non-negative price, pack size, and whole-number sort order.')
      return
    }
    setSaving(true)
    try {
      await saveProduct({ ...form, price, sort_order: sortOrder }, imageFile, setImageInfo)
      setSuccess(imageFile ? 'Product and compressed image saved successfully.' : 'Product saved successfully.')
      setTimeout(() => onNavigate('/admin'), 650)
    } catch (err) {
      setError(err.message || 'Unable to save the product.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <main className="min-h-screen bg-paper p-6 font-body">Loading product…</main>
  return <main className="min-h-screen bg-paper px-4 py-6 md:px-8"><div className="mx-auto max-w-3xl"><header className="flex items-center justify-between border-b-2 border-ink pb-5"><div><p className="tag text-maroon">Catalogue editor</p><h1 className="mt-2 font-display text-3xl text-maroon">{productId ? 'Edit product' : 'Add product'}</h1></div><button onClick={() => onNavigate('/admin')} className="font-body font-bold text-maroon underline underline-offset-4">Cancel</button></header><form onSubmit={submit} className="mt-7 space-y-5 border-2 border-ink bg-surface p-5 paper-shadow md:p-8"><label className="block font-body font-bold">Tamil product name<input required value={form.name} onChange={(e) => set('name', e.target.value)} className="admin-input" /></label><div className="grid gap-5 sm:grid-cols-2"><label className="block font-body font-bold">Category<select required value={form.category_id} onChange={(e) => set('category_id', e.target.value)} className="admin-input">{categories.map((category) => <option key={category.id} value={category.id}>{category.name} · {category.name_english}</option>)}</select></label><label className="block font-body font-bold">Price (₹)<input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => set('price', e.target.value)} className="admin-input" /></label></div><div className="grid gap-5 sm:grid-cols-2"><label className="block font-body font-bold">Pack size<input required value={form.pack_size} onChange={(e) => set('pack_size', e.target.value)} placeholder="250g" className="admin-input" /></label><label className="block font-body font-bold">Sort order<input required type="number" min="0" step="1" value={form.sort_order} onChange={(e) => set('sort_order', e.target.value)} className="admin-input" /></label></div><label className="block font-body font-bold">Description <span className="font-normal text-ink/60">(optional)</span><textarea rows="4" value={form.description} onChange={(e) => set('description', e.target.value)} className="admin-input" /></label><div className="grid gap-3 sm:grid-cols-2"><label className="flex min-h-[48px] items-center gap-3 border border-ink/25 px-3 font-body font-bold"><input type="checkbox" checked={form.available} onChange={(e) => set('available', e.target.checked)} className="h-5 w-5 accent-maroon" />Available to customers</label><label className="flex min-h-[48px] items-center gap-3 border border-ink/25 px-3 font-body font-bold"><input type="checkbox" checked={form.show_on_home} onChange={(e) => set('show_on_home', e.target.checked)} className="h-5 w-5 accent-maroon" />Show on Home</label></div><label className="block font-body font-bold">Product image<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={chooseImage} className="mt-2 block w-full font-body text-sm" /><span className="mt-2 block text-sm font-normal text-ink/65">{imageLabel}. Original max 5 MB; output is compressed to 250 KB or less.</span></label>{imageUrl && <div className="flex items-center gap-4 border border-ink/20 bg-paper p-3"><img src={imageUrl} alt="Current product" className="h-20 w-20 object-cover" /><span className="font-body text-sm text-ink/70">Current product image</span></div>}{imageInfo && <div role="status" className="border-l-2 border-leaf-dark bg-paper px-3 py-2 font-body text-sm text-ink/75"><span className="font-bold text-leaf-dark">{imageInfo.phase === 'compressing' ? 'Compressing image…' : imageInfo.phase === 'uploading' ? 'Uploading compressed image…' : imageInfo.phase === 'compressed' ? 'Image compressed and ready to upload.' : 'Image ready.'}</span><span className="mt-1 block">Original: {formatBytes(imageInfo.originalBytes)} · Final: {formatBytes(imageInfo.finalBytes)}{imageInfo.format ? ` · ${imageInfo.format}` : ''}</span></div>}{error && <p role="alert" className="border-l-2 border-maroon bg-paper px-3 py-2 font-body text-sm text-maroon">{error}</p>}{success && <p role="status" className="border-l-2 border-leaf-dark bg-paper px-3 py-2 font-body text-sm text-leaf-dark">{success}</p>}<div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end"><button type="button" onClick={() => onNavigate('/admin')} className="min-h-[48px] border-2 border-ink px-5 font-body font-bold">Cancel</button><button disabled={saving} className="min-h-[48px] bg-maroon px-5 font-body font-bold text-paper disabled:opacity-60">{saving ? (imageInfo?.phase === 'compressing' ? 'Compressing…' : imageInfo?.phase === 'uploading' ? 'Uploading…' : 'Saving…') : 'Save product'}</button></div></form></div></main>
}
