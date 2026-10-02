import { useEffect, useRef } from 'react'
import { buildWhatsAppLink, orderMessage } from '../../utils/whatsapp'
import TornEdge from './TornEdge'

// Keeps the tray clear of the iPhone home indicator / rounded corners.
const SAFE_BOTTOM = 'max(1rem, env(safe-area-inset-bottom))'

export default function OrderTray({ items, open, onOpen, onClose, onChangeQuantity, onRemove, onClear }) {
  const pillRef = useRef(null)
  const closeRef = useRef(null)
  const wasOpen = useRef(false)
  const hasItems = items.length > 0

  // Focus management: into the slip when it opens, back to the pill when it closes.
  useEffect(() => {
    if (open && hasItems) closeRef.current?.focus()
    else if (wasOpen.current && hasItems) pillRef.current?.focus()
    wasOpen.current = open && hasItems
  }, [open, hasItems])

  // Escape closes the slip.
  useEffect(() => {
    if (!open || !hasItems) return undefined
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, hasItems, onClose])

  if (!hasItems) return null

  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0)
  const allPriced = items.every(({ product }) => typeof product.price === 'number')
  const total = allPriced ? items.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0) : null

  if (!open) {
    return (
      <button
        ref={pillRef}
        type="button"
        onClick={onOpen}
        aria-label={`Open order slip, ${totalUnits} ${totalUnits === 1 ? 'item' : 'items'}`}
        style={{ bottom: SAFE_BOTTOM }}
        className="fixed left-4 right-4 md:left-auto md:right-6 md:w-[340px] z-40 min-h-[52px] bg-ink text-paper border-2 border-mustard md:paper-shadow flex items-center justify-between px-5 hover:bg-ink/90"
      >
        <span className="font-body font-bold text-sm">
          Order slip · {totalUnits} {totalUnits === 1 ? 'item' : 'items'}
        </span>
        <span className="font-body text-sm font-bold text-mustard-light">Review</span>
      </button>
    )
  }

  return (
    <>
      {/* Mobile scrim: makes the slip a proper bottom sheet and tapping outside closes it. */}
      <div aria-hidden="true" onClick={onClose} className="tray-scrim md:hidden fixed inset-0 z-40 bg-ink/45 is-open" />
      <aside
        role="dialog"
        aria-label="Your order slip"
        className="tray-panel is-open fixed bottom-0 left-0 right-0 md:bottom-6 md:left-auto md:right-6 md:w-[400px] z-40 bg-surface text-ink border-t-2 md:border-2 border-ink max-h-[85dvh] md:max-h-[80vh] flex flex-col md:paper-shadow"
      >
        <TornEdge color="#7A2419" />
        <div className="bg-maroon text-paper pl-5 pr-2 py-2.5 flex items-center justify-between gap-4" data-surface="dark">
          <div>
            <p className="font-body text-sm font-bold text-mustard-light">Counter order slip</p>
            <h2 className="font-display text-xl mt-0.5">Review your order</h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close order slip"
            className="w-11 h-11 flex items-center justify-center text-paper/90 hover:text-paper text-3xl leading-none shrink-0"
          >
            ×
          </button>
        </div>

        <div className="px-5 py-4 flex-1 overflow-y-auto overscroll-contain">
          <ul className="divide-y divide-dashed divide-ink/30">
            {items.map(({ product, quantity }) => {
              const hasPrice = typeof product.price === 'number'
              const subtotal = hasPrice ? product.price * quantity : null
              return (
                <li key={product.id} className="py-3 first:pt-0 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-body font-semibold text-sm break-words">{product.name}</p>
                    <p className="font-body text-xs text-ink/70 mt-0.5">
                      {product.weight || 'Weight to be confirmed'}
                      {hasPrice && <span className="text-rust font-semibold"> · ₹{product.price} each</span>}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <button
                        type="button"
                        aria-label={`Decrease ${product.name}`}
                        onClick={() => onChangeQuantity(product.id, quantity - 1)}
                        className="w-11 h-11 border border-ink/40 hover:border-maroon text-lg leading-none"
                      >
                        −
                      </button>
                      <span className="font-body text-sm font-semibold min-w-[2rem] text-center" aria-live="polite">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Increase ${product.name}`}
                        onClick={() => onChangeQuantity(product.id, quantity + 1)}
                        className="w-11 h-11 border border-ink/40 hover:border-maroon text-lg leading-none"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        aria-label={`Remove ${product.name} from order`}
                        onClick={() => onRemove(product.id)}
                        className="min-h-[44px] px-3 font-body text-sm text-ink/70 hover:text-maroon underline underline-offset-4"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  {hasPrice && <p className="font-body font-bold text-sm text-rust shrink-0">₹{subtotal}</p>}
                </li>
              )
            })}
          </ul>
        </div>

        <div className="border-t-2 border-dashed border-ink/30 px-5 pt-4" style={{ paddingBottom: SAFE_BOTTOM }}>
          {total !== null ? (
            <div className="flex items-center justify-between mb-3">
              <span className="font-body font-bold text-sm text-ink/70">Total</span>
              <span className="font-display text-2xl text-rust">₹{total}</span>
            </div>
          ) : (
            <p className="font-body text-xs text-ink/70 mb-3">
              Total to be confirmed on WhatsApp — not every price is listed yet.
            </p>
          )}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClear}
              className="min-h-[44px] pr-2 font-body text-sm text-ink/70 hover:text-maroon underline underline-offset-4"
            >
              Clear slip
            </button>
            <a
              href={buildWhatsAppLink(orderMessage(items))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-h-[48px] bg-mustard text-ink font-body font-bold text-sm px-5 hover:bg-mustard-light"
            >
              Order on WhatsApp <span className="cta-arrow" aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </aside>
    </>
  )
}
