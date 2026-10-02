import { useRef } from 'react'
import { buildWhatsAppLink, generalOrderMessage } from '../../utils/whatsapp'
import { useScrollProgress } from '../../hooks/useScrollProgress'

export default function Hero() {
  const ref = useRef(null)
  useScrollProgress(ref, '--opening-progress', 'section')

  return (
    <section ref={ref} className="opening-experience" aria-labelledby="opening-title">
      <div className="opening-stage">
        <div className="opening-paper opening-paper-back" aria-hidden="true" />
        <div className="opening-print-rule opening-print-rule-top" aria-hidden="true" />

        <div className="opening-copy">
          <p className="opening-kicker hero-stagger hero-stagger-1">Traditional snacks · Nellai</p>
          <h1 id="opening-title" className="opening-title hero-stagger hero-stagger-2">
            <span className="opening-title-small">Nellai</span>
            <span className="opening-title-main">Vishnu Snacks</span>
          </h1>
          <p className="opening-subtitle hero-stagger hero-stagger-3">Tradition, made to share.</p>
        </div>

        <div className="opening-product-wrap">
          <div className="opening-product-card hero-stagger hero-stagger-0">
            <div className="opening-product-photo">
              <img
                src="/images/nellai-vishnu-brand-board.png"
                alt="Nellai Vishnu Snacks signboard with temple illustration and traditional snacks"
                loading="eager"
                decoding="async"
                className="opening-brand-art"
              />
            </div>
          </div>
        </div>

        <div className="opening-footer">
          <span className="opening-scroll-line" aria-hidden="true" />
          <span>Scroll to enter the shop</span>
        </div>
      </div>

      <div className="opening-continue bg-paper">
        <div className="max-w-content mx-auto px-5 md:px-8 py-14 md:py-20 grid md:grid-cols-[.8fr_1.2fr] gap-6 md:gap-14 items-end">
          <p className="tag text-maroon">From our shelf to your table</p>
          <div>
            <h2 className="font-display text-3xl md:text-5xl text-ink max-w-2xl">A printed catalogue for the things worth sharing.</h2>
            <p className="font-body text-ink/75 mt-4 max-w-xl leading-relaxed">
              Browse the counter, choose your favourites, and send your list straight to the shop on WhatsApp.
            </p>
            <div className="flex flex-col min-[480px]:flex-row gap-3 mt-7">
              <a href="#products" className="inline-flex items-center justify-center min-h-[48px] bg-leaf-dark text-paper font-body font-bold px-6 hover:bg-leaf">
                See the counter <span className="cta-arrow" aria-hidden="true">→</span>
              </a>
              <a
                href={buildWhatsAppLink(generalOrderMessage())}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center min-h-[48px] border-2 border-maroon text-maroon font-body font-bold px-6 hover:bg-maroon hover:text-paper"
              >
                Order on WhatsApp <span className="cta-arrow" aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
