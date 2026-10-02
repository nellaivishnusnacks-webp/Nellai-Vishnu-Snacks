import { useEffect, useState } from 'react'
import { getAdminSession, subscribeToAuth } from '../lib/admin'
import AdminLoginPage from './AdminLoginPage'
import AdminDashboardPage from './AdminDashboardPage'
import AdminProductFormPage from './AdminProductFormPage'

export default function AdminArea({ path, navigate }) {
  const [session, setSession] = useState(null)
  const [checking, setChecking] = useState(true)
  useEffect(() => { let active = true; getAdminSession().then((current) => { if (active) { setSession(current); setChecking(false) } }).catch(() => { if (active) setChecking(false) }); const subscription = subscribeToAuth(setSession); return () => { active = false; subscription.unsubscribe() } }, [])
  if (checking) return <main className="min-h-screen bg-paper p-6 font-body">Checking admin access…</main>
  if (!session && path !== '/admin/login') return <AdminLoginPage onSuccess={() => navigate('/admin', { replace: true })} />
  if (session && path === '/admin/login') { navigate('/admin', { replace: true }); return null }
  if (!session) return <AdminLoginPage onSuccess={() => navigate('/admin', { replace: true })} />
  if (path === '/admin') return <AdminDashboardPage onNavigate={navigate} />
  if (path === '/admin/products/new') return <AdminProductFormPage onNavigate={navigate} />
  const match = path.match(/^\/admin\/products\/([^/]+)\/edit$/)
  if (match) return <AdminProductFormPage productId={match[1]} onNavigate={navigate} />
  return <AdminDashboardPage onNavigate={navigate} />
}
