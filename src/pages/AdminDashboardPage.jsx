import { useEffect, useState } from 'react'
import { deleteProduct, getAdminCatalogue, getProductImageUrl, signOutAdmin } from '../lib/admin'

const statusText = (value) => value ? 'Published' : 'Hidden'

export default function AdminDashboardPage({ onNavigate }) {
  const [state, setState] = useState({ loading: true, error: '', categories: [], products: [] })
  const [loggingOut, setLoggingOut] = useState(false)
  const [deletingId, setDeletingId] = useState('')

  async function load() {
    setState((current) => ({ ...current, loading: true, error: '' }))
    try {
      const data = await getAdminCatalogue()
      setState({ ...data, loading: false, error: '' })
    } catch (error) {
      setState({ loading: false, error: error.message || 'Unable to load the dashboard.', categories: [], products: [] })
    }
  }

  useEffect(() => { load() }, [])

  async function logout() {
    setLoggingOut(true)
    try {
      await signOutAdmin()
      onNavigate('/admin/login', { replace: true })
    } catch {
      setLoggingOut(false)
    }
  }

  async function remove(product) {
    const confirmed = window.confirm(`Permanently delete “${product.name}”? This cannot be undone.`)
    if (!confirmed) return
    setDeletingId(product.id)
    setState((current) => ({ ...current, error: '' }))
    try {
      await deleteProduct(product)
      await load()
    } catch (error) {
      await load()
      setState((current) => ({ ...current, error: error.message || 'Unable to delete the product.' }))
    } finally {
      setDeletingId('')
    }
  }

  const available = state.products.filter((product) => product.available).length
  const featured = state.products.filter((product) => product.available && product.show_on_home).length

  return (
    <main className="admin-shell min-h-screen bg-paper px-4 py-6 md:px-8">
      <div className="mx-auto max-w-content">
        <header className="flex flex-col gap-4 border-b-2 border-ink pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="tag text-maroon">Owner dashboard</p><h1 className="mt-2 font-display text-3xl text-maroon">Catalogue control</h1></div>
          <div className="flex gap-3"><a href="/" className="min-h-[44px] border-2 border-ink px-4 py-2 font-body font-bold text-ink">View site</a><button onClick={logout} disabled={loggingOut} className="min-h-[44px] bg-maroon px-4 py-2 font-body font-bold text-paper">{loggingOut ? 'Signing out…' : 'Log out'}</button></div>
        </header>
        {state.error && <div role="alert" className="mt-6 border-l-2 border-maroon bg-surface px-4 py-3 font-body text-maroon">{state.error}<button onClick={load} className="ml-3 underline">Try again</button></div>}
        <section aria-label="Catalogue summary" className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[['Total products', state.products.length], ['Available', available], ['Home featured', featured], ['Categories', state.categories.length]].map(([label, value]) => <div key={label} className="border border-ink/30 bg-surface p-4 paper-shadow"><p className="font-body text-sm text-ink/65">{label}</p><p className="mt-2 font-display text-3xl text-maroon">{state.loading ? '…' : value}</p></div>)}
        </section>
        <section className="mt-9 border-2 border-ink bg-surface">
          <div className="flex flex-col gap-3 border-b border-ink/25 p-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-display text-2xl text-maroon">Products</h2><p className="font-body text-sm text-ink/65">Manage the published catalogue records.</p></div><button onClick={() => onNavigate('/admin/products/new')} className="min-h-[44px] bg-maroon px-4 py-2 font-body font-bold text-paper">Add product</button></div>
          {state.loading ? <p className="p-5 font-body">Loading products…</p> : state.products.length === 0 ? <p className="p-5 font-body text-ink/70">No products are available in the database. Add the first product to begin rebuilding the catalogue.</p> : <div className="divide-y divide-ink/15">{state.products.map((product) => <article key={product.id} className="grid gap-3 p-4 md:grid-cols-[1fr_auto_auto_auto_auto_auto_auto] md:items-center"><div className="flex items-center gap-3">{product.image_path ? <img src={getProductImageUrl(product.image_path)} alt="" className="h-12 w-12 rounded-sm object-cover" /> : <div className="h-12 w-12 border border-dashed border-ink/30" aria-hidden="true" />}<div><h3 className="font-tamil-display text-xl text-maroon">{product.name}</h3><p className="font-body text-sm text-ink/65">{product.categories?.name_english || 'Uncategorised'} · {product.pack_size} · ₹{product.price}</p></div></div><span className={`font-body text-sm font-bold ${product.available ? 'text-leaf-dark' : 'text-maroon'}`}>{product.available ? 'Available' : 'Hidden'}</span><span className="font-body text-sm">Home: {statusText(product.show_on_home)}</span><span className="font-body text-sm">Image: {product.image_path ? 'Yes' : 'Pending'}</span><button onClick={() => onNavigate(`/admin/products/${product.id}/edit`)} className="min-h-[44px] border-2 border-maroon px-4 font-body font-bold text-maroon">Edit</button><button onClick={() => remove(product)} disabled={deletingId === product.id} className="min-h-[44px] border-2 border-maroon px-4 font-body font-bold text-maroon disabled:opacity-60" aria-label={`Permanently delete ${product.name}`}>{deletingId === product.id ? 'Deleting…' : 'Delete'}</button></article>)}</div>}
        </section>
      </div>
    </main>
  )
}
