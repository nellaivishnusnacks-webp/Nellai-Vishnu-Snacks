import { useState } from 'react'
import { signInAdmin } from '../lib/admin'

export default function AdminLoginPage({ onSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(event) {
    event.preventDefault()
    setError('')
    if (!email.trim() || !password) { setError('Enter your email and password.'); return }
    setBusy(true)
    try { await signInAdmin(email.trim(), password); onSuccess() }
    catch (err) { setError(err.message || 'Unable to sign in.') }
    finally { setBusy(false) }
  }

  return (
    <main className="min-h-screen bg-paper px-5 py-10 md:px-8">
      <div className="mx-auto max-w-md">
        <a href="/" className="font-body text-sm font-bold text-maroon underline underline-offset-4">← Back to customer site</a>
        <section className="mt-12 border-2 border-ink bg-surface p-6 paper-shadow md:p-8">
          <p className="tag text-maroon">Owner access</p>
          <h1 className="mt-4 font-display text-3xl text-maroon">Admin login</h1>
          <p className="mt-3 font-body text-ink/70">Sign in to manage the published catalogue.</p>
          <form onSubmit={submit} className="mt-8 space-y-5">
            <label className="block font-body font-bold">Email<input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full border-2 border-ink/30 bg-paper px-3 py-3 font-body font-normal outline-none focus:border-maroon" /></label>
            <label className="block font-body font-bold">Password<input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full border-2 border-ink/30 bg-paper px-3 py-3 font-body font-normal outline-none focus:border-maroon" /></label>
            {error && <p role="alert" className="border-l-2 border-maroon bg-paper px-3 py-2 font-body text-sm text-maroon">{error}</p>}
            <button disabled={busy} className="min-h-[48px] w-full bg-maroon px-5 font-body font-bold text-paper hover:bg-maroon-dark disabled:opacity-60">{busy ? 'Signing in…' : 'Sign in'}</button>
          </form>
        </section>
      </div>
    </main>
  )
}
