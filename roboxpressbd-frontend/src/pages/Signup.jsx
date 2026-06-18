import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '' })
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      await signup(form)
      toast.success('Account created!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed')
    } finally { setBusy(false) }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <div className="bg-white border rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Create account</h1>
        <form onSubmit={submit} className="space-y-3">
          <input required placeholder="Full name" value={form.fullName}
            onChange={e => setForm({ ...form, fullName: e.target.value })}
            className="w-full px-3 py-2 border rounded" />
          <input type="email" required placeholder="Email" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full px-3 py-2 border rounded" />
          <input placeholder="Phone (optional)" value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            className="w-full px-3 py-2 border rounded" />
          <input type="password" required minLength={6} placeholder="Password (min 6 chars)" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="w-full px-3 py-2 border rounded" />
          <button disabled={busy} className="w-full bg-brand text-white py-2 rounded hover:bg-brand-dark disabled:opacity-50">
            {busy ? 'Creating…' : 'Create account'}
          </button>
        </form>
        <p className="text-sm text-center mt-4 text-slate-500">
          Already have an account? <Link to="/login" className="text-brand font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
