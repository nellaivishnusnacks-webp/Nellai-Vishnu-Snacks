import PhotoSlot from './PhotoSlot'

/**
 * Catalogue-style card: photo, category, name, then a ruled spec list
 * (weight / price / availability) and the ordering action. Nothing is shown
 * that the shop hasn't supplied — no price means "Ask on WhatsApp", and the
 * availability row only appears once `product.available` is defined.
 */
export default function ProductCard({ product, quantity = 0, onAdd, onChangeQuantity }) {
  const hasPrice = typeof product.price === 'number'
  const hasAvailability = typeof product.available === 'boolean'
  const unavailable = product.available === false

  return (
    <article className="group product-card motion-surface relative h-full bg-surface border border-ink/30 flex flex-col paper-shadow">
      <div className="product-frame aspect-[4/3] overflow-hidden border-b border-ink/30">
        {/* Real photography drops in via product.image — keep it warm-toned and
            naturally cropped, no heavy vintage filter. */}
        <PhotoSlot src={product.image} alt={product.name} />
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <p className="font-tamil text-sm font-bold text-leaf-dark leading-snug">{product.category}</p>
        <p className="font-body text-xs text-ink/65 mt-1">{product.categoryEnglish}</p>
        <h3 className="font-tamil-display text-xl text-maroon leading-tight mt-1.5" lang="ta">{product.name}</h3>

        <dl className="mt-3 font-body text-sm">
          <div className="flex items-baseline gap-3 py-2 border-t border-dashed border-ink/30">
            <dt className="text-ink/70">Weight</dt>
            <dd className="ml-auto font-semibold text-ink">{product.weight || 'To be confirmed'}</dd>
          </div>
          <div className="flex items-baseline gap-3 py-2 border-t border-dashed border-ink/30">
            <dt className="text-ink/70">Price</dt>
            <dd className={`ml-auto font-semibold ${hasPrice ? 'text-rust' : 'text-ink/75'}`}>
              {hasPrice ? `₹${product.price}` : 'Ask on WhatsApp'}
            </dd>
          </div>
          {hasAvailability && (
            <div className="flex items-baseline gap-3 py-2 border-t border-dashed border-ink/30">
              <dt className="text-ink/70">Availability</dt>
              <dd className={`ml-auto font-semibold ${unavailable ? 'text-rust' : 'text-leaf-dark'}`}>
                {unavailable ? 'Not available now' : 'Available'}
              </dd>
            </div>
          )}
        </dl>

        <div className="mt-auto pt-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={unavailable}
              onClick={() => onAdd(product)}
              className="product-order-action flex-1 min-h-[44px] bg-maroon text-paper font-body font-bold text-sm px-3 hover:bg-maroon-dark disabled:bg-ink/30 disabled:text-paper"
            >
              {unavailable ? 'Not available' : quantity ? 'Add one more' : 'Add to order'}
            </button>
            {quantity > 0 && (
              <div className="flex items-center border-2 border-maroon text-maroon">
                <button
                  type="button"
                  aria-label={`Decrease ${product.name}`}
                  onClick={() => onChangeQuantity(product.id, quantity - 1)}
                  className="w-11 h-11 text-lg leading-none"
                >
                  −
                </button>
                <span className="font-body font-bold text-sm min-w-[1.5rem] text-center" aria-live="polite">
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label={`Increase ${product.name}`}
                  onClick={() => onChangeQuantity(product.id, quantity + 1)}
                  className="w-11 h-11 text-lg leading-none"
                >
                  +
                </button>
              </div>
            )}
          </div>
          {quantity > 0 && <p className="font-body text-xs text-leaf-dark mt-2.5">{quantity} in your order slip</p>}
        </div>
      </div>
    </article>
  )
}
