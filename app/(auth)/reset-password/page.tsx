'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { CheckCircleIcon, PayLeafMarkIcon } from '@/components/ui/icons'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleUpdate() {
    setLoading(true)
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    if (password !== confirm) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setDone(true)
    setTimeout(() => router.push('/dashboard'), 2000)
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

        {done ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
              <CheckCircleIcon className="h-8 w-8" />
            </div>
            <h1 className="text-white text-xl font-semibold mb-2">Password updated!</h1>
            <p className="text-gray-400 text-sm">Redirecting you to dashboard...</p>
          </div>
        ) : (
          <>
            <h1 className="text-white text-2xl font-semibold mb-2">Set new password</h1>
            <p className="text-gray-400 text-sm mb-8">
              Choose a strong password for your account
            </p>

            <div className="flex flex-col gap-5">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">New Password</label>
                <input
                  type="password"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleUpdate()}
                  className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                onClick={handleUpdate}
                disabled={loading}
                className="w-full py-3 rounded-lg text-white font-medium transition disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
