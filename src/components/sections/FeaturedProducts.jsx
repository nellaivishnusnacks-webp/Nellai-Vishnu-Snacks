import { useReveal } from '../../hooks/useReveal'
import ProductCard from '../ui/ProductCard'
import CatalogueState from '../ui/CatalogueState'

// `home` shows a short selection; the Products page shows the whole catalogue
// as one continuous grid. Items flagged `hideOnHome` never appear on Home.
export default function FeaturedProducts({ products = [], cart, onAdd, onChangeQuantity, loading, error, onRetry, home = false, limit = 2 }) {
  const { ref, inView } = useReveal()
  const visibleProducts = home
    ? products.filter((product) => product.available && product.showOnHome).slice(0, limit)
    : products.filter((product) => product.available)

  return (
    <section id="products" className="bg-paper" aria-labelledby="products-heading">
      <div ref={ref} className="max-w-content mx-auto px-5 md:px-8 py-14 md:py-24">
        <div className={`max-w-xl reveal ${inView ? 'is-visible' : ''}`}>
          <p className="tag text-maroon">The online counter</p>
          <h2 id="products-heading" className="font-display text-3xl md:text-4xl text-ink mt-3">Choose what goes in the packet.</h2>
          <p className="font-body text-ink/75 mt-4 leading-relaxed">
            Browse the catalogue, choose your favourites, and send your list straight to the shop on WhatsApp.
          </p>
          {!loading && !error && <p className="font-body text-xs text-ink/60 mt-3 border-l-2 border-maroon/50 pl-3">Product photography pending owner supply.</p>}
        </div>
        <div className="mt-9 md:mt-10">
          <CatalogueState loading={loading} error={error} hasData={visibleProducts.length > 0} onRetry={onRetry} />
          {!loading && !error && visibleProducts.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {visibleProducts.map((product, i) => (
                <div
                  key={product.id}
                  className={`reveal-stagger-item ${inView ? 'is-visible' : ''}`}
                  style={{ '--stagger-delay': `${i * 80}ms` }}
                >
                  <ProductCard
                    product={product}
                    quantity={cart[product.id]?.quantity || 0}
                    onAdd={onAdd}
                    onChangeQuantity={onChangeQuantity}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
