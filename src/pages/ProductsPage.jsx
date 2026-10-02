import FeaturedProducts from '../components/sections/FeaturedProducts'
import Categories from '../components/sections/Categories'

export default function ProductsPage({ cart, onAdd, onChangeQuantity, onNavigate, products, categories, loading, error, retry }) {
  const categorySlug = window.location.pathname.startsWith('/products/category/')
    ? decodeURIComponent(window.location.pathname.split('/').pop())
    : ''
  const selectedCategory = categories.find((category) => category.slug === categorySlug)
  const visibleProducts = categorySlug ? products.filter((product) => product.categorySlug === categorySlug) : products

  return (
    <>
      <FeaturedProducts products={visibleProducts} cart={cart} onAdd={onAdd} onChangeQuantity={onChangeQuantity} loading={loading} error={error} onRetry={retry} />
      {selectedCategory && <div className="mx-auto max-w-content px-5 pb-8 md:px-8"><p className="tag text-leaf-dark">Filtered shelf</p><h1 className="mt-2 font-display text-3xl text-maroon">{selectedCategory.name}</h1><button type="button" onClick={() => onNavigate('/products')} className="mt-3 font-body text-sm font-bold text-maroon underline underline-offset-4">View all products</button></div>}
      <Categories categories={categories} loading={loading} error={error} onRetry={retry} onNavigate={onNavigate} />
    </>
  )
}
