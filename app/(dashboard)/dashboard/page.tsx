'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [business, setBusiness] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()
  const [employeeCount, setEmployeeCount] = useState(0)

  useEffect(() => {
  async function load() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    const { data } = await supabase
      .from('businesses')
      .select('*')
      .single()
    setBusiness(data)

    // fix: count employees
    const { count } = await supabase
      .from('employees')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', data?.id)

    setEmployeeCount(count || 0)
    setLoading(false)
  }
  load()
}, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              🌿 {business?.name}
            </h1>
            <p className="text-gray-500 text-sm">Payroll Dashboard</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-500 transition"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <p className="text-gray-500 text-sm mb-1">Total Employees</p>
            <p className="text-3xl font-bold text-gray-900">{employeeCount}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <p className="text-gray-500 text-sm mb-1">Paid This Month</p>
            <p className="text-3xl font-bold text-green-600">0</p>
          </div>
        </div>

        <button
          onClick={() => router.push('/employees')}
          className="w-full bg-green-600 text-white py-4 rounded-xl font-medium hover:bg-green-700 transition"
        >
          Manage Employees →
        </button>

        <button
          onClick={() => router.push('/history')}
          className="w-full border border-gray-200 text-gray-600 py-4 rounded-xl font-medium hover:bg-gray-50 transition mt-3"
        >
          Payment History →
        </button>
      </div>
    </main>
  )
}
