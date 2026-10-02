import { buildWhatsAppLink, generalOrderMessage } from '../../utils/whatsapp'

const LINKS = [
  ['Products', '/products'],
  ['Our story', '/about'],
  ['Contact', '/contact'],
]

const POLICY_LINKS = [
  ['Privacy', '/privacy'],
  ['Terms', '/terms'],
  ['Refunds', '/refunds'],
]

export default function Footer({ onNavigate }) {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-ink text-paper" data-surface="dark">
      <div className="max-w-content mx-auto px-5 md:px-8 py-12 grid gap-10 md:grid-cols-[1.3fr_.7fr_1fr]">
        <div>
          <p className="font-display text-xl text-mustard-light">Nellai Vishnu Snacks</p>
          <p className="font-body text-sm text-paper/75 mt-3 leading-relaxed max-w-xs">
            Browse the menu and send your order to the shop on WhatsApp.
          </p>
        </div>
        <div>
          <p className="font-body text-sm font-bold text-paper/70 mb-2">Explore</p>
          <nav aria-label="Footer navigation" className="flex flex-col">
            {LINKS.map(([label, href]) => (
              <a key={href} href={href} onClick={(event) => { event.preventDefault(); onNavigate?.(href) }} className="font-body text-sm text-paper/85 hover:text-mustard-light py-2.5">
                {label}
              </a>
            ))}
          </nav>
        </div>
        <div>
          <p className="font-body text-sm font-bold text-paper/70 mb-2">Talk to the shop</p>
          <div className="flex flex-col items-start gap-1">
            <a href="tel:+919940419171" className="font-body text-sm text-paper/85 hover:text-mustard-light underline underline-offset-4">+91 99404 19171</a>
            <a href="mailto:nellaivishnusnacks@gmail.com" className="font-body text-sm text-paper/85 hover:text-mustard-light underline underline-offset-4 break-all">nellaivishnusnacks@gmail.com</a>
          </div>
          <a
            href={buildWhatsAppLink(generalOrderMessage())}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center min-h-[44px] font-body text-sm font-bold text-mustard-light hover:text-mustard underline underline-offset-4"
          >
            Message on WhatsApp
          </a>
        </div>
      </div>
      <div className="border-t border-paper/15">
        <div className="max-w-content mx-auto px-5 md:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="font-body text-xs text-paper/70">© {year} Nellai Vishnu Snacks</p>
          <nav aria-label="Policy navigation" className="flex flex-wrap gap-x-4 gap-y-2">
            {POLICY_LINKS.map(([label, href]) => (
              <a key={href} href={href} onClick={(event) => { event.preventDefault(); onNavigate?.(href) }} className="font-body text-xs text-paper/70 hover:text-mustard-light underline underline-offset-4">{label}</a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
