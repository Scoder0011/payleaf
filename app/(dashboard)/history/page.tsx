'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon } from '@/components/ui/icons'

export default function HistoryPage() {
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => { loadHistory() }, [])

  async function loadHistory() {
    const { data: business } = await supabase
      .from('businesses').select('id').single()

    const { data } = await supabase
      .from('payroll_records')
      .select('*, employees(name, role)')
      .eq('business_id', business?.id)
      .order('created_at', { ascending: false })

    setRecords(data || [])
    setLoading(false)
  }

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center">
      <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
    </main>
  )

  return (
    <main className="min-h-screen px-4 py-8" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="mb-1 inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
            style={{ color: 'var(--text-muted)' }}
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back
          </button>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Payment History</h1>
        </div>

        {records.length === 0 && (
          <div
            className="rounded-xl p-8 text-center"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <p style={{ color: 'var(--text-secondary)' }}>No payments recorded yet</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {records.map(record => (
            <div key={record.id}
              className="rounded-xl p-5"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {record.employees?.name || 'Deleted Employee'}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {record.employees?.role || '-'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600 text-lg">
                    ₹{record.net_salary?.toLocaleString()}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {months[record.month - 1]} {record.year}
                  </p>
                </div>
              </div>
              <div
                className="grid grid-cols-3 gap-2 text-xs pt-3"
                style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border)' }}
              >
                <div>
                  <p>Gross</p>
                  <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>₹{record.gross_salary?.toLocaleString()}</p>
                </div>
                <div>
                  <p>Days present</p>
                  <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>{record.days_present}/{record.working_days}</p>
                </div>
                <div>
                  <p>Status</p>
                  <p className="inline-flex items-center gap-2 rounded-full bg-green-50 px-2.5 py-1 font-medium text-green-700">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-white">
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        className="h-3 w-3"
                        aria-hidden="true"
                      >
                        <path
                          d="M3.5 8.5L6.5 11.5L12.5 5.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    Paid
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
