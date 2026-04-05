'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { UsersIcon } from '@/components/ui/icons'

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [salary, setSalary] = useState('')
  const router = useRouter()
  const supabase = createClient()
  const cardStyle = { background: 'var(--bg-card)', border: '1px solid var(--border)' }
  const inputStyle = {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
  }

  useEffect(() => { loadEmployees() }, [])

  async function loadEmployees() {
    const { data: business } = await supabase
      .from('businesses').select('id').single()
    const { data } = await supabase
      .from('employees')
      .select('*')
      .eq('business_id', business?.id)
      .order('created_at', { ascending: false })
    setEmployees(data || [])
    setLoading(false)
  }

  async function addEmployee() {
    if (!name || !salary) return
    const { data: business } = await supabase
      .from('businesses').select('id').single()
    await supabase.from('employees').insert({
      business_id: business?.id,
      name, role,
      basic_salary: parseFloat(salary)
    })
    setName(''); setRole(''); setSalary('')
    setShowForm(false)
    loadEmployees()
  }

  async function deleteEmployee(id: string) {
    if (!confirm('Delete this employee? This cannot be undone.')) return
    await supabase.from('employees').delete().eq('id', id)
    loadEmployees()
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
    </div>
  )

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Employees</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{employees.length} total</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 rounded-lg text-white text-sm font-medium transition"
          style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
        >
          + Add Employee
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="rounded-xl p-6 mb-6" style={cardStyle}>
          <h2 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>New Employee</h2>
          <div className="flex flex-col gap-3">
            <input
              placeholder="Full name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm outline-none"
              style={inputStyle}
            />
            <input
              placeholder="Role / Designation"
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm outline-none"
              style={inputStyle}
            />
            <input
              placeholder="Base monthly salary"
              type="number"
              value={salary}
              onChange={e => setSalary(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm outline-none"
              style={inputStyle}
            />
            <div className="flex gap-3">
              <button
                onClick={addEmployee}
                className="flex-1 py-3 rounded-lg text-white text-sm font-medium transition"
                style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
              >
                Add Employee
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-3 rounded-lg text-sm transition"
                style={{ ...cardStyle, color: 'var(--text-secondary)' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Employee list */}
      {employees.length === 0 ? (
        <div className="rounded-xl p-12 text-center" style={cardStyle}>
          <div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
          >
            <UsersIcon className="h-8 w-8" />
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>No employees yet</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Add your first employee above</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {employees.map(emp => (
            <div
              key={emp.id}
              className="rounded-xl p-5 flex items-center justify-between transition cursor-pointer"
              style={cardStyle}
            >
              <div
                className="flex-1"
                onClick={() => router.push(`/employees/${emp.id}`)}
              >
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{emp.name}</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{emp.role}</p>
              </div>
              <div className="flex items-center gap-6">
                <div
                  className="text-right cursor-pointer"
                  onClick={() => router.push(`/employees/${emp.id}`)}
                >
                  <p className="text-green-400 font-semibold">
                    ₹{parseFloat(emp.basic_salary).toLocaleString()}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>base salary</p>
                </div>
                <button
                  onClick={() => deleteEmployee(emp.id)}
                  className="hover:text-red-400 text-sm transition"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
