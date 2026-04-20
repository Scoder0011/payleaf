'use client'

import { useEffect, useState, use } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { calculateSalary } from '@/lib/calculations'
import { ArrowLeftIcon } from '@/components/ui/icons'

export default function EmployeePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [employee, setEmployee] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editRole, setEditRole] = useState('')
  const [editSalary, setEditSalary] = useState('')
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
    setEditName(data?.name || '')
    setEditRole(data?.role || '')
    setEditSalary(String(data?.basic_salary ?? ''))
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
  const cardStyle = { background: 'var(--bg-card)', border: '1px solid var(--border)' }
  const inputStyle = {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
  }

  async function saveEmployee() {
    await supabase
      .from('employees')
      .update({
        name: editName,
        role: editRole,
        basic_salary: parseFloat(editSalary)
      })
      .eq('id', id)
    setEditing(false)
    loadEmployee()
  }

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
      <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
    </main>
  )

  return (
    <main className="min-h-screen px-4 py-8" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-2xl mx-auto">

        <button onClick={() => router.push('/employees')}
          className="mb-4 inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
          style={{ color: 'var(--text-muted)' }}>
          <ArrowLeftIcon className="h-4 w-4" />
          Back
        </button>

        {/* Employee info */}
        <div
          className="rounded-xl p-6 mb-4"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          {editing ? (
            <div className="flex flex-col gap-3">
              <input
                value={editName}
                onChange={e => setEditName(e.target.value)}
                placeholder="Full name"
                className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)'
                }}
              />
              <input
                value={editRole}
                onChange={e => setEditRole(e.target.value)}
                placeholder="Role / Designation"
                className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)'
                }}
              />
              <input
                type="number"
                value={editSalary}
                onChange={e => setEditSalary(e.target.value)}
                placeholder="Base monthly salary"
                className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)'
                }}
              />
              <div className="flex gap-3">
                <button
                  onClick={saveEmployee}
                  className="px-5 py-2 rounded-lg text-white text-sm font-medium"
                  style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-5 py-2 rounded-lg text-sm"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between">
              <div>
                <h1 style={{ color: 'var(--text-primary)' }} className="text-xl font-bold">
                  {employee?.name}
                </h1>
                <p style={{ color: 'var(--text-muted)' }} className="text-sm">{employee?.role}</p>
                <p className="text-green-400 font-semibold mt-1">
                  Rs. {parseFloat(employee?.basic_salary || 0).toLocaleString()} base monthly salary
                </p>
              </div>
              <button
                onClick={() => setEditing(true)}
                className="text-sm px-4 py-2 rounded-lg transition"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)'
                }}
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Attendance */}
        <div className="rounded-xl p-6 mb-4" style={cardStyle}>
          <h2 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Attendance</h2>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
            Set total working days this month and how many days the employee was present.
            Salary will be deducted proportionally for absent days.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Total working days this month</label>
              <input type="number" value={workingDays}
                min={1}
                onChange={e => {
                  const val = Math.max(1, Number(e.target.value))
                  setWorkingDays(val)
                  if (daysPresent > val) setDaysPresent(val)
                }}
                className="w-full rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
                style={inputStyle}
              />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>
                Days present (max {workingDays})
              </label>
              <input type="number" value={daysPresent}
                min={0} max={workingDays}
                onChange={e => setDaysPresent(Math.min(Math.max(0, Number(e.target.value)), workingDays))}
                className="w-full rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
                style={inputStyle}
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
        <div className="rounded-xl p-6 mb-4" style={cardStyle}>
          <h2 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Additional Earnings</h2>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
            Add anything on top of the base salary. Leave at 0 if not applicable.
          </p>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>
                  HRA — House Rent Allowance
                </label>
                <input type="number" value={hra} min={0}
                  onChange={e => setHra(pos(Number(e.target.value)))}
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>
                  Allowances — travel, food etc.
                </label>
                <input type="number" value={allowances} min={0}
                  onChange={e => setAllowances(pos(Number(e.target.value)))}
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
                  style={inputStyle}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Overtime hours worked</label>
                <input type="number" value={overtimeHours} min={0}
                  onChange={e => setOvertimeHours(pos(Number(e.target.value)))}
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Overtime pay per hour (₹)</label>
                <input type="number" value={overtimeRate} min={0}
                  onChange={e => setOvertimeRate(pos(Number(e.target.value)))}
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
                  style={inputStyle}
                />
              </div>
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>
                Bonus — festival, performance etc.
              </label>
              <input type="number" value={bonus} min={0}
                onChange={e => setBonus(pos(Number(e.target.value)))}
                className="w-full rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Deductions */}
        <div className="rounded-xl p-6 mb-4" style={cardStyle}>
          <h2 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Deductions</h2>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
            Enable only what applies. You can customize the rates.
          </p>
          <div className="flex flex-col gap-4">

            {/* PF */}
            <div>
              <label className="flex items-center justify-between cursor-pointer mb-2">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>PF — Provident Fund</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Deducted from basic salary</p>
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
                    className="w-24 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
                    style={inputStyle}
                  />
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>% of basic salary</span>
                </div>
              )}
            </div>

            {/* ESI */}
            <div>
              <label className="flex items-center justify-between cursor-pointer mb-2">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>ESI — Employee State Insurance</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Deducted from gross salary</p>
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
                    className="w-24 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
                    style={inputStyle}
                  />
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>% of gross salary</span>
                </div>
              )}
            </div>

            {/* TDS */}
            <div>
              <label className="flex items-center justify-between cursor-pointer mb-2">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>TDS — Tax Deducted at Source</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Deducted from gross salary</p>
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
                    className="w-24 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
                    style={inputStyle}
                  />
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>% of gross salary</span>
                </div>
              )}
            </div>

            {/* PT */}
            <div>
              <label className="flex items-center justify-between cursor-pointer mb-2">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>PT — Professional Tax</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Fixed amount per month</p>
                </div>
                <input type="checkbox" checked={ptEnabled}
                  onChange={e => setPtEnabled(e.target.checked)}
                  className="w-4 h-4 accent-green-600"
                />
              </label>
              {ptEnabled && (
                <div className="flex items-center gap-2">
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>₹</span>
                  <input type="number" value={ptAmount} min={0}
                    onChange={e => setPtAmount(pos(Number(e.target.value)))}
                    className="w-24 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"
                    style={inputStyle}
                  />
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>per month</span>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Result */}
        {result && (
          <div
            className="rounded-xl p-6 mb-4"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <h2 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Salary Breakdown</h2>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Base salary</span>
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>₹{Number(employee?.basic_salary).toLocaleString()}</span>
              </div>
              {hra > 0 && (
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>HRA</span>
                  <span className="text-green-600">+₹{hra.toLocaleString()}</span>
                </div>
              )}
              {allowances > 0 && (
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Allowances</span>
                  <span className="text-green-600">+₹{allowances.toLocaleString()}</span>
                </div>
              )}
              {overtimeHours > 0 && (
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Overtime ({overtimeHours}hrs)</span>
                  <span className="text-green-600">+₹{(overtimeHours * overtimeRate).toLocaleString()}</span>
                </div>
              )}
              {bonus > 0 && (
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Bonus</span>
                  <span className="text-green-600">+₹{bonus.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 mt-1" style={{ borderTop: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Gross salary</span>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>₹{result.grossSalary.toLocaleString()}</span>
              </div>
              {result.lopDeduction > 0 && (
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Absent deduction ({workingDays - daysPresent} days)</span>
                  <span className="text-red-500">-₹{result.lopDeduction.toLocaleString()}</span>
                </div>
              )}
              {result.pfDeduction > 0 && (
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>PF ({pfRate}%)</span>
                  <span className="text-red-500">-₹{result.pfDeduction.toLocaleString()}</span>
                </div>
              )}
              {result.esiDeduction > 0 && (
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>ESI ({esiRate}%)</span>
                  <span className="text-red-500">-₹{result.esiDeduction.toLocaleString()}</span>
                </div>
              )}
              {result.tdsDeduction > 0 && (
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>TDS ({tdsRate}%)</span>
                  <span className="text-red-500">-₹{result.tdsDeduction.toLocaleString()}</span>
                </div>
              )}
              {result.ptDeduction > 0 && (
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Professional Tax</span>
                  <span className="text-red-500">-₹{result.ptDeduction.toLocaleString()}</span>
                </div>
              )}
              <div className="pt-2 mt-1 flex justify-between" style={{ borderTop: '1px solid var(--border)' }}>
                <span className="font-bold" style={{ color: 'var(--text-primary)' }}>Net Salary</span>
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
