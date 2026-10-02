import { useEffect, useState } from 'react'
import { buildWhatsAppLink, generalOrderMessage } from '../../utils/whatsapp'

const LINKS = [
  ['Home', '/'],
  ['Products', '/products'],
  ['Categories', '/categories'],
  ['About', '/about'],
  ['Contact', '/contact'],
]

function OrderCta({ itemCount, onOpenSummary, onClick, className, tabIndex }) {
  if (itemCount > 0) {
    return (
      <button type="button" onClick={onOpenSummary} className={className} tabIndex={tabIndex}>
        View order slip <span className="text-mustard-light">({itemCount})</span>
      </button>
    )
  }
  return (
    <a
      href={buildWhatsAppLink(generalOrderMessage())}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={className}
      tabIndex={tabIndex}
    >
      Order on WhatsApp
    </a>
  )
}

export default function Navbar({ itemCount = 0, onOpenSummary, currentPath = '/', onNavigate }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="sticky top-0 z-50 bg-paper border-b-2 border-ink/25">
      <div className="max-w-content mx-auto px-5 md:px-8 h-[68px] md:h-[72px] flex items-center justify-between">
        <a href="/" onClick={(event) => { event.preventDefault(); onNavigate?.('/'); }} aria-label="Nellai Vishnu Snacks home" className="flex items-center shrink-0">
          <img
            src="/images/nellai-vishnu-logo.png"
            alt=""
            width="192"
            height="192"
            decoding="async"
            className="block w-11 h-11 md:w-12 md:h-12 rounded-full"
          />
        </a>
        <nav className="hidden md:flex items-center gap-7" aria-label="Primary navigation">
          {LINKS.map(([label, href]) => (
            <a key={href} href={href} onClick={(event) => { event.preventDefault(); onNavigate?.(href); }} aria-current={currentPath === href ? 'page' : undefined} className={`nav-link font-body text-sm font-bold text-ink/80 py-2 hover:text-maroon hover:underline underline-offset-4 decoration-2 ${currentPath === href ? 'nav-link-active text-maroon' : ''}`}>
              {label}
            </a>
          ))}
          <OrderCta
            itemCount={itemCount}
            onOpenSummary={onOpenSummary}
            className="inline-flex items-center min-h-[44px] bg-maroon text-paper font-body font-bold text-sm px-4 hover:bg-maroon-dark"
          />
        </nav>
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden w-11 h-11 border-2 border-ink/30 flex flex-col items-center justify-center gap-1.5"
        >
          <span className={`block h-0.5 w-6 bg-ink transition-transform duration-200 ${open ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block h-0.5 w-6 bg-ink transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-6 bg-ink transition-transform duration-200 ${open ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </div>
      {open && (
        <button
          type="button"
          aria-label="Close menu backdrop"
          onClick={() => setOpen(false)}
          className="md:hidden fixed inset-0 top-[68px] bg-ink/20 cursor-default"
        />
      )}
      <nav
        id="mobile-nav"
        aria-label="Mobile navigation"
        aria-hidden={!open}
        className={`mobile-nav-panel md:hidden absolute top-full left-0 right-0 z-10 bg-paper border-b-2 border-ink/25 px-5 pt-1 pb-5 max-h-[calc(100dvh-68px)] overflow-y-auto ${open ? 'is-open' : ''}`}
        style={{ clipPath: open ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)', pointerEvents: open ? 'auto' : 'none' }}
      >
        {LINKS.map(([label, href], index) => (
          <a
            key={href}
            href={href}
            onClick={(event) => { event.preventDefault(); setOpen(false); onNavigate?.(href); }}
            aria-current={currentPath === href ? 'page' : undefined}
            className={`mobile-nav-link block min-h-[52px] py-3.5 border-b border-dashed border-ink/25 font-display text-lg text-ink ${currentPath === href ? 'text-maroon' : ''}`}
            style={{ '--nav-index': index }}
            tabIndex={open ? 0 : -1}
          >
            {label}
          </a>
        ))}
        <OrderCta
          itemCount={itemCount}
          onOpenSummary={() => {
            setOpen(false)
            onOpenSummary?.()
          }}
          onClick={() => setOpen(false)}
          tabIndex={open ? 0 : -1}
          className="mobile-nav-link flex items-center justify-center min-h-[48px] mt-4 bg-maroon text-paper font-body font-bold w-full"
        />
      </nav>
    </header>
  )
}
