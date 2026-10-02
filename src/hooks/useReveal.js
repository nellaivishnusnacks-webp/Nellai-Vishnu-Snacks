import { useEffect, useRef, useState } from 'react'

/**
 * Reveals an element with a fade-up when it scrolls into view.
 * Fires once, then disconnects — cheap on low-power mobile devices.
 */
// A small threshold is important on narrow screens: a long catalogue section
// can be taller than the viewport, so waiting for 15% of the whole section to
// intersect would leave its content hidden indefinitely.
export function useReveal(threshold = 0.01) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, inView }
}
