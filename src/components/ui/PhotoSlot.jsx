/**
 * Shared image treatment for the opening, product cards and map area.
 * Real client photography can replace the opening asset in Hero.jsx by changing
 * the single `src` path.
 */
export default function PhotoSlot({
  src,
  alt = '',
  tamilSize = 'text-3xl',
  showLabel = false,
  loading = 'lazy',
}) {
  if (src) {
    return (
      <div className="photo-slot photo-slot-image product-media">
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          className="block w-full h-full object-cover"
        />
      </div>
    )
  }
  return (
    <div className="photo-slot product-media" role="img" aria-label="Product photograph">
      <span lang="ta" className={`font-tamil-display font-semibold text-maroon leading-tight ${tamilSize}`}>
        பலகாரம்
      </span>
      {showLabel && <span className="font-body text-xs text-ink/70 mt-2">Traditional savouries</span>}
    </div>
  )
}
