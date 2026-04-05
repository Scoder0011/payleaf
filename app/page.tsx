import Link from 'next/link'
import { PayLeafMarkIcon } from '@/components/ui/icons'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="text-center max-w-md">
        <div className="mb-4 flex items-center justify-center gap-3">
          <PayLeafMarkIcon className="h-11 w-11 text-emerald-600" />
          <h1 className="text-4xl font-bold text-gray-900">
            PayLeaf
          </h1>
        </div>
        <p className="text-gray-500 text-lg mb-8">
          Simple open source payroll. Free. For everyone.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="border border-green-600 text-green-600 px-6 py-3 rounded-lg hover:bg-green-50 transition"
          >
            Sign up
          </Link>
        </div>
      </div>
    </main>
  )
}
