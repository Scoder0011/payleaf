'use client'

type EmployeeCardProps = {
  employee: {
    id: string
    name: string
    role: string
    basic_salary: number | string
  }
  onOpen: (id: string) => void
  onDelete: (id: string) => void
}

export default function EmployeeCard({
  employee,
  onOpen,
  onDelete,
}: EmployeeCardProps) {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 flex items-center justify-between hover:border-green-300 transition">
      <div
        onClick={() => onOpen(employee.id)}
        className="flex-1 cursor-pointer"
      >
        <p className="font-medium text-gray-900">{employee.name}</p>
        <p className="text-sm text-gray-400">{employee.role}</p>
      </div>
      <div className="flex items-center gap-4">
        <div
          onClick={() => onOpen(employee.id)}
          className="text-right cursor-pointer"
        >
          <p className="font-semibold text-gray-900">
            ₹{Number(employee.basic_salary || 0).toLocaleString()}
          </p>
          <p className="text-xs text-gray-400">basic salary</p>
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onDelete(employee.id)
          }}
          className="text-red-400 hover:text-red-600 text-sm transition"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
