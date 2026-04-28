'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogIn } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="bg-[var(--surface-card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-8 shadow-xl">
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
          <LogIn className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-white text-2xl font-bold tracking-tight">CaseLedger</h1>
        <p className="text-[var(--muted)] text-sm mt-1">Gestión legal profesional</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-[var(--radius-md)] text-red-500 text-sm">
            {error === 'Invalid login credentials' ? 'Correo o contraseña incorrectos' : error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--foreground)]" htmlFor="email">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black/50 border border-[var(--border)] rounded-[var(--radius-md)] px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
            placeholder="abogado@ejemplo.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--foreground)]" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black/50 border border-[var(--border)] rounded-[var(--radius-md)] px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black font-medium py-3 rounded-[var(--radius-md)] hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  )
}
