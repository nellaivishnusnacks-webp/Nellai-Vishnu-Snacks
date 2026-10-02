import { useCallback, useEffect, useState } from 'react'

const normalizePath = (value) => {
  const path = value.split('?')[0].replace(/\/+$/, '')
  return path || '/'
}

export function useRouter() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname))

  useEffect(() => {
    const onPopState = () => setPath(normalizePath(window.location.pathname))
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigate = useCallback((nextPath, { replace = false } = {}) => {
    const next = normalizePath(nextPath)
    if (next === normalizePath(window.location.pathname)) return
    if (replace) window.history.replaceState({}, '', next)
    else window.history.pushState({}, '', next)
    setPath(next)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  return { path, navigate }
}

export { normalizePath }
