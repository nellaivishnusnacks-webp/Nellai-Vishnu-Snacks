import { useReveal } from '../../hooks/useReveal'
import CatalogueState from '../ui/CatalogueState'

// Laid out like the contents page of a printed catalogue: one ruled table,
// hairlines between cells (the 1px grid gap shows the ink-tinted background),
// no floating cards, no radius, no shadow.
export default function Categories({ categories = [], loading, error, onRetry, onNavigate }) {
  const { ref, inView } = useReveal()
  return (
    <section className="bg-paper-dark/50">
      <div ref={ref} className="max-w-content mx-auto px-5 md:px-8 py-14 md:py-24">
        <div className="flex items-end justify-between gap-5">
          <div>
            <p className="tag text-leaf-dark">Shelf guide</p>
            <h2 className="font-display text-3xl md:text-4xl text-ink mt-3">What's on the shelf</h2>
          </div>
          <span aria-hidden="true" className="hidden sm:block font-script text-maroon text-xl -rotate-3">pick your packet</span>
        </div>
        <div className="mt-8 md:mt-10">
          <CatalogueState kind="categories" loading={loading} error={error} hasData={categories.length > 0} onRetry={onRetry} />
        </div>
        {!loading && !error && categories.length > 0 && <div className={`catalogue-grid grid sm:grid-cols-2 md:grid-cols-3 gap-px bg-ink/30 border-y-2 border-ink mt-8 md:mt-10 section-rule ${inView ? 'is-visible' : ''}`}>
          {categories.map((cat, i) => (
            <a
              key={cat.id}
              href={`/products/category/${cat.slug}`}
              onClick={(event) => { event.preventDefault(); onNavigate?.(`/products/category/${cat.slug}`) }}
              className={`reveal-stagger-item bg-paper p-5 md:p-6 min-h-32 md:min-h-44 flex flex-col justify-end ${inView ? 'is-visible' : ''}`}
              style={{ '--stagger-delay': `${i * 60}ms` }}
            >
              <h3 className="font-display text-lg text-maroon leading-snug">{cat.name}</h3>
              <p className="font-body text-sm text-ink/75 leading-relaxed mt-2">{cat.description}</p>
            </a>
          ))}
        </div>}
      </div>
    </section>
  )
}
