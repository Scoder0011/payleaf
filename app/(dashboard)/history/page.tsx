'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

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
      <p className="text-gray-400">Loading...</p>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm text-gray-400 hover:text-gray-600 mb-1 block"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
        </div>

        {records.length === 0 && (
          <div className="bg-white rounded-xl p-8 border border-gray-100 text-center">
            <p className="text-gray-400">No payments recorded yet</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {records.map(record => (
            <div key={record.id}
              className="bg-white rounded-xl p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium text-gray-900">
                    {record.employees?.name || 'Deleted Employee'}
                  </p>
                  <p className="text-sm text-gray-400">
                    {record.employees?.role || '-'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600 text-lg">
                    ₹{record.net_salary?.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">
                    {months[record.month - 1]} {record.year}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-gray-400 border-t border-gray-50 pt-3">
                <div>
                  <p>Gross</p>
                  <p className="text-gray-600 font-medium">₹{record.gross_salary?.toLocaleString()}</p>
                </div>
                <div>
                  <p>Days present</p>
                  <p className="text-gray-600 font-medium">{record.days_present}/{record.working_days}</p>
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
