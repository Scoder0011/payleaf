'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import EmployeeCard from '@/components/EmployeeCard'

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [salary, setSalary] = useState('')
  const router = useRouter()
  const supabase = createClient()

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
    const { data: business } = await supabase
      .from('businesses').select('id').single()

    await supabase.from('employees').insert({
      business_id: business?.id,
      name,
      role,
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
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-sm text-gray-400 hover:text-gray-600 mb-1 block"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
          >
            + Add Employee
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl p-6 border border-gray-100 mb-6">
            <h2 className="font-semibold text-gray-900 mb-4">New Employee</h2>
            <div className="flex flex-col gap-3">
              <input
                placeholder="Full name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-green-500"
              />
              <input
                placeholder="Role / Designation"
                value={role}
                onChange={e => setRole(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-green-500"
              />
              <input
                placeholder="Basic salary"
                type="number"
                value={salary}
                onChange={e => setSalary(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-green-500"
              />
              <button
                onClick={addEmployee}
                className="bg-green-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-green-700 transition"
              >
                Add Employee
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {employees.length === 0 && (
            <div className="bg-white rounded-xl p-8 border border-gray-100 text-center">
              <p className="text-gray-400">No employees yet</p>
              <p className="text-gray-300 text-sm mt-1">Add your first employee above</p>
            </div>
          )}
          {employees.map(emp => (
            <EmployeeCard
              key={emp.id}
              employee={emp}
              onOpen={(id) => router.push(`/employees/${id}`)}
              onDelete={deleteEmployee}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
