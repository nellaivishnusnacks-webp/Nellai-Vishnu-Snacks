import { buildWhatsAppLink, generalOrderMessage } from '../../utils/whatsapp'
import { useReveal } from '../../hooks/useReveal'

// Only the owner-supplied phone, WhatsApp number and email are shown as facts.
// Address, hours and map are unknown, so no map or location is presented.
export default function LocationContact() {
  const { ref, inView } = useReveal()
  return (
    <section id="visit" className="bg-paper" aria-labelledby="contact-heading">
      <div
        ref={ref}
        className={`max-w-content mx-auto px-5 md:px-8 py-14 md:py-24 grid md:grid-cols-[1.1fr_.9fr] gap-10 md:gap-14 items-start reveal ${inView ? 'is-visible' : ''}`}
      >
        <div>
          <p className="tag text-maroon">Contact</p>
          <h1 id="contact-heading" className="font-display text-3xl md:text-4xl text-ink mt-3">Talk to the shop</h1>
          <dl className="mt-8 font-body border-t-2 border-ink">
            <div className="py-4 border-b border-dashed border-ink/35">
              <dt className="text-sm font-bold text-ink/70">Phone / WhatsApp</dt>
              <dd className="mt-1">
                <a href="tel:+919940419171" className="inline-flex items-center min-h-[44px] text-lg font-bold text-maroon underline underline-offset-4">
                  +91 99404 19171
                </a>
              </dd>
            </div>
            <div className="py-4 border-b border-dashed border-ink/35">
              <dt className="text-sm font-bold text-ink/70">Email</dt>
              <dd className="mt-1">
                <a href="mailto:nellaivishnusnacks@gmail.com" className="inline-flex min-h-[44px] items-center font-bold text-maroon underline underline-offset-4 break-all">
                  nellaivishnusnacks@gmail.com
                </a>
              </dd>
            </div>
            <div className="py-4 border-b border-dashed border-ink/35">
              <dt className="text-sm font-bold text-ink/70">Address and opening hours</dt>
              <dd className="text-ink/85 mt-1">Please contact the shop for address and opening hours.</dd>
            </div>
          </dl>
        </div>

        <aside className="bg-maroon text-paper border-2 border-ink paper-shadow p-6 md:p-8" data-surface="dark">
          <p className="font-display text-2xl leading-tight text-mustard-light">Order on WhatsApp</p>
          <p className="font-body text-paper/90 mt-3 leading-relaxed">
            Send your list to the shop and ask them to confirm availability and the total.
          </p>
          <a
            href={buildWhatsAppLink(generalOrderMessage())}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center min-h-[48px] w-full sm:w-auto bg-mustard text-ink font-body font-bold px-6 hover:bg-mustard-light"
          >
            Message on WhatsApp <span className="cta-arrow" aria-hidden="true">↗</span>
          </a>
        </aside>
      </div>
    </section>
  )
}
