'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PayLeafMarkIcon } from '@/components/ui/icons'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f1923 0%, #1a2535 50%, #0f1923 100%)' }}>

      {/* Geometric shapes */}
      <div className="absolute left-0 bottom-0 opacity-30">
        <svg width="300" height="300" viewBox="0 0 300 300">
          <polygon points="0,300 150,0 300,300" fill="#1e3a5f" />
          <polygon points="0,300 100,100 0,100" fill="#2a4a7f" />
        </svg>
      </div>
      <div className="absolute right-0 top-0 opacity-30">
        <svg width="200" height="400" viewBox="0 0 200 400">
          <polygon points="200,0 200,200 50,400 200,400" fill="#b45309" />
          <polygon points="200,0 200,150 100,0" fill="#d97706" />
        </svg>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-4 rounded-2xl p-8"
        style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <PayLeafMarkIcon className="h-9 w-9 text-emerald-500" />
          <span className="text-white font-bold text-xl">PayLeaf</span>
        </div>

        <h1 className="text-white text-2xl font-semibold mb-8">
          Payroll for everyone
        </h1>

        <div className="flex flex-col gap-5">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-gray-400 text-sm">Password</label>
              <Link href="/forgot-password" className="text-green-400 text-sm hover:text-green-300">
  Forgot Password?
</Link>
            </div>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 rounded-lg text-white font-medium transition disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        <p className="text-center text-gray-400 text-sm mt-8">
          Don't have an account?{' '}
          <Link href="/signup" className="text-green-400 font-medium hover:text-green-300">
            Sign Up
          </Link>
        </p>

        <p className="text-center text-gray-600 text-xs mt-6">
          Free forever. No credit card required.
        </p>
      </div>
    </main>
  )
}

