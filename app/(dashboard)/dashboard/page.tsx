'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { HistoryIcon, SparklesIcon, UsersIcon } from '@/components/ui/icons'

export default function DashboardPage() {
  const [business, setBusiness] = useState<any>(null)
  const [employeeCount, setEmployeeCount] = useState(0)
  const [paidCount, setPaidCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data } = await supabase.from('businesses').select('*').single()
      setBusiness(data)

      const { count: empCount } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', data?.id)
      setEmployeeCount(empCount || 0)

      const now = new Date()
      const { count: paid } = await supabase
        .from('payroll_records')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', data?.id)
        .eq('month', now.getMonth() + 1)
        .eq('year', now.getFullYear())
        .eq('is_paid', true)
      setPaidCount(paid || 0)

      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
    </div>
  )

  const now = new Date()
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{months[now.getMonth()]} {now.getFullYear()}</p>
        <h1 className="mt-1 flex items-center gap-3 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          <SparklesIcon className="h-6 w-6 text-emerald-400" />
          Welcome back
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{business?.name}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="rounded-xl p-6"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Total Employees</p>
          <p className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>{employeeCount}</p>
        </div>
        <div className="rounded-xl p-6"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Paid This Month</p>
          <p className="text-green-400 text-4xl font-bold">{paidCount}</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mb-4">
        <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>Quick Actions</p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push('/employees')}
            className="w-full py-4 rounded-xl text-white font-medium text-left px-6 flex items-center gap-3 transition"
            style={{ background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.3)' }}
          >
            <UsersIcon className="h-5 w-5 text-emerald-300" />
            Manage Employees
          </button>
          <button
            onClick={() => router.push('/history')}
            className="w-full py-4 rounded-xl font-medium text-left px-6 flex items-center gap-3 transition"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          >
            <HistoryIcon className="h-5 w-5" style={{ color: 'var(--text-secondary)' }} />
            Payment History
          </button>
        </div>
      </div>
    </div>
  )
}
