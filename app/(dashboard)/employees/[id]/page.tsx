'use client'

import { useEffect, useState, use } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { calculateSalary } from '@/lib/calculations'

export default function EmployeePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [employee, setEmployee] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const [hra, setHra] = useState(0)
  const [allowances, setAllowances] = useState(0)
  const [workingDays, setWorkingDays] = useState(26)
  const [daysPresent, setDaysPresent] = useState(26)
  const [overtimeHours, setOvertimeHours] = useState(0)
  const [overtimeRate, setOvertimeRate] = useState(0)
  const [bonus, setBonus] = useState(0)
  const [pfEnabled, setPfEnabled] = useState(false)
  const [pfRate, setPfRate] = useState(12)
  const [esiEnabled, setEsiEnabled] = useState(false)
  const [esiRate, setEsiRate] = useState(0.75)
  const [tdsEnabled, setTdsEnabled] = useState(false)
  const [tdsRate, setTdsRate] = useState(10)
  const [ptEnabled, setPtEnabled] = useState(false)
  const [ptAmount, setPtAmount] = useState(200)

  useEffect(() => { loadEmployee() }, [id])

  async function loadEmployee() {
    const { data } = await supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .single()
    setEmployee(data)
    setLoading(false)
  }

  // helper — no negatives
  const pos = (val: number) => Math.max(0, val)

  const result = employee ? calculateSalary({
    basicSalary: employee.basic_salary,
    hra: pos(hra),
    allowances: pos(allowances),
    workingDays: Math.max(1, workingDays),
    daysPresent: Math.min(pos(daysPresent), workingDays),
    overtimeHours: pos(overtimeHours),
    overtimeRate: pos(overtimeRate),
    bonus: pos(bonus),
    pfEnabled,
    pfRate,
    esiEnabled,
    esiRate,
    tdsEnabled,
    tdsRate,
    ptEnabled,
    ptAmount,
  }) : null

  async function savePayroll() {
    if (!result || !employee) return
    setSaving(true)
    const now = new Date()
    await supabase.from('payroll_records').insert({
      employee_id: employee.id,
      business_id: employee.business_id,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      basic_salary: employee.basic_salary,
      hra, allowances,
      overtime_hours: overtimeHours,
      overtime_rate: overtimeRate,
      bonus,
      pf_deduction: result.pfDeduction,
      esi_deduction: result.esiDeduction,
      tds_deduction: result.tdsDeduction,
      pt_deduction: result.ptDeduction,
      working_days: workingDays,
      days_present: daysPresent,
      gross_salary: result.grossSalary,
      net_salary: result.netSalary,
      is_paid: true,
      paid_at: new Date().toISOString()
    })
    setSaving(false)
    setSaved(true)
  }

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">

        <button onClick={() => router.push('/employees')}
          className="text-sm text-gray-400 hover:text-gray-600 mb-4 block">
          ← Back
        </button>

        {/* Employee info */}
<div className="bg-white rounded-xl p-6 border border-gray-100 mb-4">
  <h1 className="text-xl font-bold text-gray-900">{employee?.name}</h1>
  <p className="text-gray-400 text-sm">{employee?.role}</p>
  <p className="text-green-600 font-semibold mt-1">
    ₹{parseFloat(employee?.basic_salary || 0).toLocaleString()} base monthly salary
  </p>
</div>

        {/* Attendance */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 mb-4">
          <h2 className="font-semibold text-gray-900 mb-1">Attendance</h2>
          <p className="text-xs text-gray-400 mb-4">
            Set total working days this month and how many days the employee was present.
            Salary will be deducted proportionally for absent days.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Total working days this month</label>
              <input type="number" value={workingDays}
                min={1}
                onChange={e => {
                  const val = Math.max(1, Number(e.target.value))
                  setWorkingDays(val)
                  if (daysPresent > val) setDaysPresent(val)
                }}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">
                Days present (max {workingDays})
              </label>
              <input type="number" value={daysPresent}
                min={0} max={workingDays}
                onChange={e => setDaysPresent(Math.min(Math.max(0, Number(e.target.value)), workingDays))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
              />
            </div>
          </div>
          {daysPresent < workingDays && (
            <p className="text-xs text-orange-500 mt-2">
              {workingDays - daysPresent} absent day(s) — salary will be deducted
            </p>
          )}
        </div>

        {/* Earnings */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 mb-4">
          <h2 className="font-semibold text-gray-900 mb-1">Additional Earnings</h2>
          <p className="text-xs text-gray-400 mb-4">
            Add anything on top of the base salary. Leave at 0 if not applicable.
          </p>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">
                  HRA — House Rent Allowance
                </label>
                <input type="number" value={hra} min={0}
                  onChange={e => setHra(pos(Number(e.target.value)))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">
                  Allowances — travel, food etc.
                </label>
                <input type="number" value={allowances} min={0}
                  onChange={e => setAllowances(pos(Number(e.target.value)))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Overtime hours worked</label>
                <input type="number" value={overtimeHours} min={0}
                  onChange={e => setOvertimeHours(pos(Number(e.target.value)))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Overtime pay per hour (₹)</label>
                <input type="number" value={overtimeRate} min={0}
                  onChange={e => setOvertimeRate(pos(Number(e.target.value)))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">
                Bonus — festival, performance etc.
              </label>
              <input type="number" value={bonus} min={0}
                onChange={e => setBonus(pos(Number(e.target.value)))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
              />
            </div>
          </div>
        </div>

        {/* Deductions */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 mb-4">
          <h2 className="font-semibold text-gray-900 mb-1">Deductions</h2>
          <p className="text-xs text-gray-400 mb-4">
            Enable only what applies. You can customize the rates.
          </p>
          <div className="flex flex-col gap-4">

            {/* PF */}
            <div>
              <label className="flex items-center justify-between cursor-pointer mb-2">
                <div>
                  <p className="text-sm font-medium text-gray-700">PF — Provident Fund</p>
                  <p className="text-xs text-gray-400">Deducted from basic salary</p>
                </div>
                <input type="checkbox" checked={pfEnabled}
                  onChange={e => setPfEnabled(e.target.checked)}
                  className="w-4 h-4 accent-green-600"
                />
              </label>
              {pfEnabled && (
                <div className="flex items-center gap-2">
                  <input type="number" value={pfRate} min={0} max={100}
                    onChange={e => setPfRate(pos(Number(e.target.value)))}
                    className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
                  />
                  <span className="text-sm text-gray-400">% of basic salary</span>
                </div>
              )}
            </div>

            {/* ESI */}
            <div>
              <label className="flex items-center justify-between cursor-pointer mb-2">
                <div>
                  <p className="text-sm font-medium text-gray-700">ESI — Employee State Insurance</p>
                  <p className="text-xs text-gray-400">Deducted from gross salary</p>
                </div>
                <input type="checkbox" checked={esiEnabled}
                  onChange={e => setEsiEnabled(e.target.checked)}
                  className="w-4 h-4 accent-green-600"
                />
              </label>
              {esiEnabled && (
                <div className="flex items-center gap-2">
                  <input type="number" value={esiRate} min={0} max={100}
                    onChange={e => setEsiRate(pos(Number(e.target.value)))}
                    className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
                  />
                  <span className="text-sm text-gray-400">% of gross salary</span>
                </div>
              )}
            </div>

            {/* TDS */}
            <div>
              <label className="flex items-center justify-between cursor-pointer mb-2">
                <div>
                  <p className="text-sm font-medium text-gray-700">TDS — Tax Deducted at Source</p>
                  <p className="text-xs text-gray-400">Deducted from gross salary</p>
                </div>
                <input type="checkbox" checked={tdsEnabled}
                  onChange={e => setTdsEnabled(e.target.checked)}
                  className="w-4 h-4 accent-green-600"
                />
              </label>
              {tdsEnabled && (
                <div className="flex items-center gap-2">
                  <input type="number" value={tdsRate} min={0} max={100}
                    onChange={e => setTdsRate(pos(Number(e.target.value)))}
                    className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
                  />
                  <span className="text-sm text-gray-400">% of gross salary</span>
                </div>
              )}
            </div>

            {/* PT */}
            <div>
              <label className="flex items-center justify-between cursor-pointer mb-2">
                <div>
                  <p className="text-sm font-medium text-gray-700">PT — Professional Tax</p>
                  <p className="text-xs text-gray-400">Fixed amount per month</p>
                </div>
                <input type="checkbox" checked={ptEnabled}
                  onChange={e => setPtEnabled(e.target.checked)}
                  className="w-4 h-4 accent-green-600"
                />
              </label>
              {ptEnabled && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">₹</span>
                  <input type="number" value={ptAmount} min={0}
                    onChange={e => setPtAmount(pos(Number(e.target.value)))}
                    className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
                  />
                  <span className="text-sm text-gray-400">per month</span>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="bg-green-50 rounded-xl p-6 border border-green-200 mb-4">
            <h2 className="font-semibold text-gray-900 mb-4">Salary Breakdown</h2>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Base salary</span>
                <span className="font-medium">₹{Number(employee?.basic_salary).toLocaleString()}</span>
              </div>
              {hra > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">HRA</span>
                  <span className="text-green-600">+₹{hra.toLocaleString()}</span>
                </div>
              )}
              {allowances > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Allowances</span>
                  <span className="text-green-600">+₹{allowances.toLocaleString()}</span>
                </div>
              )}
              {overtimeHours > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Overtime ({overtimeHours}hrs)</span>
                  <span className="text-green-600">+₹{(overtimeHours * overtimeRate).toLocaleString()}</span>
                </div>
              )}
              {bonus > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Bonus</span>
                  <span className="text-green-600">+₹{bonus.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-green-200 pt-2 mt-1">
                <span className="text-gray-500">Gross salary</span>
                <span className="font-semibold">₹{result.grossSalary.toLocaleString()}</span>
              </div>
              {result.lopDeduction > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Absent deduction ({workingDays - daysPresent} days)</span>
                  <span className="text-red-500">-₹{result.lopDeduction.toLocaleString()}</span>
                </div>
              )}
              {result.pfDeduction > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">PF ({pfRate}%)</span>
                  <span className="text-red-500">-₹{result.pfDeduction.toLocaleString()}</span>
                </div>
              )}
              {result.esiDeduction > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">ESI ({esiRate}%)</span>
                  <span className="text-red-500">-₹{result.esiDeduction.toLocaleString()}</span>
                </div>
              )}
              {result.tdsDeduction > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">TDS ({tdsRate}%)</span>
                  <span className="text-red-500">-₹{result.tdsDeduction.toLocaleString()}</span>
                </div>
              )}
              {result.ptDeduction > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Professional Tax</span>
                  <span className="text-red-500">-₹{result.ptDeduction.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t border-green-200 pt-2 mt-1 flex justify-between">
                <span className="font-bold text-gray-900">Net Salary</span>
                <span className="font-bold text-green-600 text-lg">
                  ₹{result.netSalary.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        <button onClick={savePayroll} disabled={saving || saved}
          className="w-full bg-green-600 text-white py-4 rounded-xl font-medium hover:bg-green-700 transition disabled:opacity-50">
          {saved ? (
            <span className="inline-flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
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
              Marked as Paid
            </span>
          ) : saving ? 'Saving...' : 'Mark as Paid'}
        </button>

      </div>
    </main>
  )
}
