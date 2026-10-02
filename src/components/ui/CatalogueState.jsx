export default function CatalogueState({ kind = 'products', loading, error, hasData, onRetry }) {
  if (loading) {
    return <p className="font-body text-ink/70 border-l-2 border-maroon/50 pl-3 py-1" role="status">Loading the catalogue…</p>
  }

  if (error) {
    const message = error.name === 'CatalogueConfigError'
      ? 'The catalogue connection is not configured yet. Add the required public Supabase environment variables before launch.'
      : 'The catalogue is temporarily unavailable. Please try again.'
    return (
      <div className="border-l-2 border-maroon/70 pl-4 py-1 max-w-xl" role="alert">
        <p className="font-body text-ink/80">{message}</p>
        <button type="button" onClick={onRetry} className="mt-3 min-h-[44px] border-2 border-maroon px-4 font-body font-bold text-sm text-maroon hover:bg-maroon hover:text-paper">Try again</button>
      </div>
    )
  }

  if (!hasData) {
    return <p className="font-body text-ink/70 border-l-2 border-ink/40 pl-3 py-1">No {kind} are available right now.</p>
  }

  return null
}
