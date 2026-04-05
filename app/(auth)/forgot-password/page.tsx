'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeftIcon, MailIcon, PayLeafMarkIcon } from '@/components/ui/icons'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleReset() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    setSent(true)
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f1923 0%, #1a2535 50%, #0f1923 100%)' }}>

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

      <div className="relative z-10 w-full max-w-md mx-4 rounded-2xl p-8"
        style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>

        <div className="flex items-center gap-2 mb-8">
          <PayLeafMarkIcon className="h-9 w-9 text-emerald-500" />
          <span className="text-white font-bold text-xl">PayLeaf</span>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
              <MailIcon className="h-8 w-8" />
            </div>
            <h1 className="text-white text-xl font-semibold mb-2">Check your email</h1>
            <p className="text-gray-400 text-sm mb-8">
              We sent a password reset link to <span className="text-white">{email}</span>
            </p>
            <Link href="/login" className="inline-flex items-center gap-2 text-green-400 text-sm hover:text-green-300">
              <ArrowLeftIcon className="h-4 w-4" />
              Back to login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-white text-2xl font-semibold mb-2">Forgot password?</h1>
            <p className="text-gray-400 text-sm mb-8">
              Enter your email and we'll send you a reset link
            </p>

            <div className="flex flex-col gap-5">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleReset()}
                  className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                onClick={handleReset}
                disabled={loading}
                className="w-full py-3 rounded-lg text-white font-medium transition disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>

            <p className="text-center text-gray-400 text-sm mt-8">
              Remember your password?{' '}
              <Link href="/login" className="text-green-400 font-medium hover:text-green-300">
                Login
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  )
}
