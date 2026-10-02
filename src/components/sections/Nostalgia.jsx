import { useRef } from 'react'
import { useReveal } from '../../hooks/useReveal'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import TornEdge from '../ui/TornEdge'

// Generic counter-shop imagery only — nothing here describes this shop's own
// counter, history or practices.
const DETAILS = ['Paper packets', 'The weighing scale', 'Rows of tins', 'Glass jars']

export default function Nostalgia() {
  const { ref, inView } = useReveal()
  const scrollRef = useRef(null)
  useScrollProgress(scrollRef)
  return (
    <section ref={scrollRef} className="nostalgia-section nostalgia-90s relative bg-paper-dark/50 text-ink">
      <TornEdge color="#E6D3A8" />
      <div ref={ref} className={`nostalgia-paper max-w-content mx-auto px-5 md:px-8 py-14 md:py-24 reveal ${inView ? 'is-visible' : ''}`}>
        <div className="grid md:grid-cols-[.8fr_1.2fr] gap-8 md:gap-12 items-start">
          <div className="nostalgia-heading">
            <p className="tag text-maroon">90s theme</p>
            <h2 className="font-display text-3xl md:text-4xl text-maroon mt-3">A 90s theme, remembered.</h2>
          </div>
          <div className="nostalgia-copy">
            <p className="font-editorial text-base md:text-lg text-ink/80 leading-relaxed max-w-xl">
              Paper packets rustling, a scale settling, rows of tins along the shelf. Counter shops have a look and a
              rhythm many of us remember. This site borrows that warmth and keeps ordering easy on a phone.
            </p>
            <ul className="nostalgia-details mt-8 grid grid-cols-2 gap-x-6 gap-y-3 max-w-md">
              {DETAILS.map((detail, index) => (
                <li key={detail} className={`reveal-stagger-item flex items-center gap-3 border-t border-ink/25 pt-3 font-body text-sm text-ink/80 ${inView ? 'is-visible' : ''}`} style={{ '--stagger-delay': `${index * 70}ms` }}>
                  <span aria-hidden="true" className="w-2 h-2 bg-maroon shrink-0" />
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <TornEdge color="#E6D3A8" flip />
    </section>
  )
}
