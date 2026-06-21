import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      const res = await login(form)
      toast.success('Welcome back!')
      if (res.roles?.includes('ROLE_ADMIN')) {
        navigate('/admin/products')
      } else {
        navigate(location.state?.from?.pathname || '/')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally { setBusy(false) }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <div className="bg-white border rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Sign in</h1>
        <form onSubmit={submit} className="space-y-3">
          <input type="email" required placeholder="Email" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full px-3 py-2 border rounded" />
          <input type="password" required placeholder="Password" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="w-full px-3 py-2 border rounded" />
          <button disabled={busy} className="w-full bg-brand text-white py-2 rounded hover:bg-brand-dark disabled:opacity-50">
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="text-sm text-center mt-4 text-slate-500">
          New here? <Link to="/signup" className="text-brand font-medium">Create an account</Link>
        </p>
      </div>
    </div>
  )
}
