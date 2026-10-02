import { useEffect, useMemo, useState } from 'react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import OrderTray from './components/ui/OrderTray'
import { useRouter } from './hooks/useRouter'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import CategoriesPage from './pages/CategoriesPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import PolicyPage from './pages/PolicyPage'
import NotFoundPage from './pages/NotFoundPage'
import { useCatalogue } from './hooks/useCatalogue'
import AdminArea from './pages/AdminArea'
import './admin.css'

const PAGE_TITLES = {
  '/': 'Nellai Vishnu Snacks',
  '/products': 'Catalogue | Nellai Vishnu Snacks',
  '/categories': 'Categories | Nellai Vishnu Snacks',
  '/about': 'About | Nellai Vishnu Snacks',
  '/contact': 'Contact | Nellai Vishnu Snacks',
  '/privacy': 'Privacy Policy | Nellai Vishnu Snacks',
  '/terms': 'Terms & Conditions | Nellai Vishnu Snacks',
  '/refunds': 'Refund Policy | Nellai Vishnu Snacks',
  '/admin/login': 'Admin Login | Nellai Vishnu Snacks',
  '/admin': 'Admin Dashboard | Nellai Vishnu Snacks',
  '/404': 'Page not found | Nellai Vishnu Snacks',
}

export default function App() {
  const [cart, setCart] = useState({})
  const [summaryOpen, setSummaryOpen] = useState(false)
  const { path, navigate } = useRouter()
  const adminRoute = path === '/admin' || path === '/admin/login' || path.startsWith('/admin/products/')
  const categoryProductsRoute = path.startsWith('/products/category/')
  const catalogueEnabled = !adminRoute && (path === '/' || path === '/products' || categoryProductsRoute || path === '/categories')
  const catalogue = useCatalogue(catalogueEnabled)

  useEffect(() => {
    const categoryRoute = path.startsWith('/products/category/')
    document.title = categoryRoute ? 'Category Catalogue | Nellai Vishnu Snacks' : (PAGE_TITLES[path] || PAGE_TITLES['/404'])
  }, [path])

  if (adminRoute) return <AdminArea path={path} navigate={navigate} />

  const items = useMemo(() => Object.values(cart), [cart])
  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items])

  const addToOrder = (product) =>
    setCart((current) => ({
      ...current,
      [product.id]: { product, quantity: (current[product.id]?.quantity || 0) + 1 },
    }))

  const changeQuantity = (id, quantity) =>
    setCart((current) => {
      if (quantity <= 0) {
        const next = { ...current }
        delete next[id]
        return next
      }
      return { ...current, [id]: { ...current[id], quantity } }
    })

  const removeItem = (id) => changeQuantity(id, 0)
  const clearOrder = () => setCart({})

  const page = {
    '/': <HomePage cart={cart} onAdd={addToOrder} onChangeQuantity={changeQuantity} onNavigate={navigate} {...catalogue} />,
    '/products': <ProductsPage cart={cart} onAdd={addToOrder} onChangeQuantity={changeQuantity} onNavigate={navigate} {...catalogue} />,
    '/categories': <CategoriesPage {...catalogue} onNavigate={navigate} />,
    '/about': <AboutPage />,
    '/contact': <ContactPage />,
    '/privacy': <PolicyPage type="privacy" />,
    '/terms': <PolicyPage type="terms" />,
    '/refunds': <PolicyPage type="refund" />,
  }[path] || (categoryProductsRoute ? <ProductsPage cart={cart} onAdd={addToOrder} onChangeQuantity={changeQuantity} onNavigate={navigate} {...catalogue} /> : <NotFoundPage onNavigate={navigate} />)

  return (
    // overflow-x-clip (not -hidden): hidden would turn this wrapper into a
    // scroll container and silently break the sticky header.
    <div id="top" className="min-h-screen flex flex-col overflow-x-clip">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navbar itemCount={itemCount} onOpenSummary={() => setSummaryOpen(true)} currentPath={path} onNavigate={navigate} />
      <main id="main" tabIndex={-1} key={path} className="page-transition flex-1 outline-none">{page}</main>
      <Footer onNavigate={navigate} />
      {/* While the order tray is showing, this ink-coloured spacer lets the footer
          scroll clear of it instead of hiding behind it. */}
      {itemCount > 0 && (
        <div aria-hidden="true" className="bg-ink" style={{ height: 'calc(4.5rem + env(safe-area-inset-bottom))' }} />
      )}
      <OrderTray
        items={items}
        open={summaryOpen}
        onOpen={() => setSummaryOpen(true)}
        onClose={() => setSummaryOpen(false)}
        onChangeQuantity={changeQuantity}
        onRemove={removeItem}
        onClear={clearOrder}
      />
    </div>
  )
}
