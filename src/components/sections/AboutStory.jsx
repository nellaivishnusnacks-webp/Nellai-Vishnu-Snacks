import { useReveal } from '../../hooks/useReveal'

// The shop's real story is not available yet. Nothing about its history is
// invented; the section stays neutral until the owner supplies the wording.
export default function AboutStory() {
  const { ref, inView } = useReveal()
  return (
    <section id="story" className="bg-paper">
      <div ref={ref} className="max-w-content mx-auto px-5 md:px-8 py-14 md:py-24 grid md:grid-cols-[.75fr_1.25fr] gap-8 md:gap-10">
        <div className={`story-heading reveal-mask ${inView ? 'is-visible' : ''}`}>
          <p className="tag text-maroon">About the shop</p>
          <h2 className="font-display text-3xl md:text-4xl text-ink mt-3">Behind the counter.</h2>
        </div>
        <div
          className={`story-paper reveal-mask ${inView ? 'is-visible' : ''}`}
          style={{ transitionDelay: inView ? '160ms' : '0ms' }}
        >
          <div className="ruled bg-surface border border-ink/30 border-l-2 border-l-maroon/50 px-5 md:px-8 pt-8 pb-8 min-h-[256px]">
            <p className="font-editorial text-lg md:text-xl text-ink/85 leading-8">
              A little space for the words behind the counter, shared in the shop’s own voice.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
