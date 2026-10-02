/**
 * A hand-torn paper edge used between sections instead of a plain hairline.
 * `flip` mirrors it vertically so it can cap either the top or bottom of a block.
 * `color` should match the section background it's introducing.
 *
 * Pass 4: the old edge was a regular saw-tooth (pinking shears). This one is
 * generated once from a seeded random walk, with uneven spacing and the odd
 * deeper tear, so it reads as torn rather than zig-zagged. Deterministic, so
 * the shape never changes between renders or builds.
 */
const buildPath = (seed) => {
  let s = seed
  const rand = () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
  let x = 0
  let d = 'M0,12'
  while (x < 1200) {
    x = Math.min(1200, x + 6 + rand() * 22)
    const y = 3 + rand() * 14 + (rand() > 0.9 ? 4 : 0)
    d += ` L${x.toFixed(1)},${y.toFixed(1)}`
  }
  return `${d} L1200,24 L0,24 Z`
}

const PATHS = { top: buildPath(20240607), bottom: buildPath(1998) }

export default function TornEdge({ color = '#F1E3C6', flip = false }) {
  return (
    <div
      aria-hidden="true"
      className="w-full overflow-hidden leading-none"
      style={{ transform: flip ? 'scaleY(-1)' : undefined }}
    >
      <svg viewBox="0 0 1200 24" preserveAspectRatio="none" className="block w-full h-5 md:h-6">
        <path d={flip ? PATHS.bottom : PATHS.top} fill={color} />
      </svg>
    </div>
  )
}
