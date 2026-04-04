'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSignup() {
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // create business for this user
    const { error: bizError } = await supabase
      .from('businesses')
      .insert({ owner_id: data.user?.id, name: businessName })

    if (bizError) {
      setError(bizError.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">🌿 PayLeaf</h1>
        <p className="text-gray-500 mb-6">Create your account</p>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Business name"
            value={businessName}
            onChange={e => setBusinessName(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-green-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-green-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-green-500"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            onClick={handleSignup}
            disabled={loading}
            className="bg-green-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-green-600 font-medium">
            Login
          </Link>
        </p>
      </div>
    </main>
  )
}