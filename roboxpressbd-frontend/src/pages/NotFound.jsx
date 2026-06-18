import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <h1 className="text-6xl font-extrabold text-brand">404</h1>
      <p className="mt-4 text-slate-500">The page you are looking for doesn't exist.</p>
      <Link to="/" className="mt-6 inline-block bg-brand text-white px-5 py-2 rounded">Go Home</Link>
    </div>
  )
}
