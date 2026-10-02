import { useEffect, useRef } from 'react'

/**
 * Exposes a section's viewport-passage progress without doing work on every
 * scroll event. The value is written to a CSS custom property so transforms
 * stay in CSS and can choreograph several layers together.
 */
export function useScrollProgress(ref, property = '--scroll-progress', mode = 'viewport') {
  const frame = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node || typeof window === 'undefined') return undefined

    const update = () => {
      frame.current = null
      const rect = node.getBoundingClientRect()
      const viewport = window.innerHeight || 1
      const distance = Math.max(mode === 'section' ? rect.height - viewport : viewport + rect.height, 1)
      const rawProgress = mode === 'section' ? -rect.top / distance : (viewport - rect.top) / distance
      const progress = Math.min(1, Math.max(0, rawProgress))
      node.style.setProperty(property, progress.toFixed(4))
    }

    const onScroll = () => {
      if (frame.current === null) frame.current = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame.current !== null) window.cancelAnimationFrame(frame.current)
    }
  }, [mode, property, ref])
}
