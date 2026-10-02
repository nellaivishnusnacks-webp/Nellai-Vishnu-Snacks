export default function NotFoundPage({ onNavigate }) {
  return (
    <section className="bg-paper" aria-labelledby="not-found-heading">
      <div className="max-w-content mx-auto px-5 md:px-8 py-20 md:py-32 min-h-[55vh] flex items-center">
        <div className="max-w-2xl">
          <p className="tag text-maroon">404 · Page not found</p>
          <h1 id="not-found-heading" className="font-display text-4xl md:text-6xl text-ink mt-4">That page is not on the shelf.</h1>
          <p className="font-editorial text-lg text-ink/80 leading-relaxed mt-5 max-w-xl">The link may be out of date or the page may have moved. Return to the Nellai Vishnu Snacks home page to continue browsing.</p>
          <a href="/" onClick={(event) => { event.preventDefault(); onNavigate?.('/') }} className="mt-8 inline-flex items-center justify-center min-h-[48px] bg-maroon text-paper font-body font-bold px-6 hover:bg-maroon-dark">Back to Home <span className="cta-arrow" aria-hidden="true">→</span></a>
        </div>
      </div>
    </section>
  )
}
