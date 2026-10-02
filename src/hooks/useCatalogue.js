import { useCallback, useEffect, useState } from 'react'
import { getCatalogue } from '../lib/catalogue'

const INITIAL_STATE = {
  categories: [],
  products: [],
  loading: true,
  error: null,
}

export function useCatalogue(enabled = true) {
  const [state, setState] = useState({ ...INITIAL_STATE, loading: enabled })

  const load = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: null }))
    try {
      const data = await getCatalogue()
      setState({ ...data, loading: false, error: null })
    } catch (error) {
      setState({ categories: [], products: [], loading: false, error })
    }
  }, [])

  useEffect(() => {
    if (enabled) load()
    else setState({ categories: [], products: [], loading: false, error: null })
  }, [enabled, load])

  return { ...state, retry: load }
}
