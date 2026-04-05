import Link from 'next/link'
import {
  AnalyticsIcon,
  CalculatorIcon,
  CheckCircleIcon,
  CurrencyIcon,
  FileTextIcon,
  KeyIcon,
  PayLeafMarkIcon,
  ShieldIcon,
  SparklesIcon,
  ThemeIcon,
  UsersIcon,
} from '@/components/ui/icons'

export default function Home() {
  const features = [
    {
      icon: UsersIcon,
      title: 'Employee Management',
      desc: 'Add employees, set their base salary, role and details. Everything saved, nothing to redo every month.',
      soon: false,
    },
    {
      icon: CalculatorIcon,
      title: 'Smart Salary Calculator',
      desc: 'Fill in attendance, toggle overtime, bonuses, HRA, allowances. Deductions like PF, ESI, TDS are customizable per employee.',
      soon: false,
    },
    {
      icon: FileTextIcon,
      title: 'Payslip Generation',
      desc: 'Generate clean payslip PDFs instantly. Download and share with employees in one click.',
      soon: true,
    },
    {
      icon: CheckCircleIcon,
      title: 'Mark as Paid',
      desc: 'Mark salaries as paid each month and keep a full history. Know exactly who was paid what and when.',
      soon: false,
    },
    {
      icon: ShieldIcon,
      title: 'Secure by Default',
      desc: 'Row level security means each business only sees their own data. Your data never touches anyone else.',
      soon: false,
    },
    {
      icon: ThemeIcon,
      title: 'Dark & Light Mode',
      desc: 'Switch between dark and light mode from the sidebar or settings. Your preference is saved automatically.',
      soon: false,
    },
    
    {
      icon: KeyIcon,
      title: 'Google OAuth',
      desc: 'Sign in with Google in one click. No passwords to remember.',
      soon: true,
    },
    {
      icon: CurrencyIcon,
      title: 'Currency Selector',
      desc: 'Support for multiple currencies. Works for teams anywhere in the world.',
      soon: true,
    },
    {
      icon: AnalyticsIcon,
      title: 'Payroll Analytics',
      desc: 'Monthly payroll trends, cost breakdowns and employee insights at a glance.',
      soon: true,
    },
  ]

  return (
    <main className="min-h-screen relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f1923 0%, #1a2535 50%, #0f1923 100%)' }}>

      {/* Geometric shapes */}
      <div className="absolute left-0 bottom-0 opacity-20 pointer-events-none">
        <svg width="400" height="400" viewBox="0 0 400 400">
          <polygon points="0,400 200,0 400,400" fill="#1e3a5f" />
          <polygon points="0,400 130,130 0,130" fill="#2a4a7f" />
        </svg>
      </div>
      <div className="absolute right-0 top-0 opacity-20 pointer-events-none">
        <svg width="300" height="500" viewBox="0 0 300 500">
          <polygon points="300,0 300,300 80,500 300,500" fill="#b45309" />
          <polygon points="300,0 300,200 150,0" fill="#d97706" />
        </svg>
      </div>

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 relative z-10">
        <div className="flex items-center gap-2">
          <PayLeafMarkIcon className="h-9 w-9 text-emerald-500" />
          <span className="text-white font-bold text-xl">PayLeaf</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login"
            className="text-gray-400 text-sm hover:text-white transition">
            Login
          </Link>
          <Link href="/signup"
            className="px-4 py-2 rounded-lg text-white text-sm font-medium transition"
            style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 text-center px-6 pt-20 pb-24">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs font-medium"
          style={{ background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.3)', color: '#4ade80' }}>
          <SparklesIcon className="h-4 w-4" />
          Open source · Free forever · MIT licensed
        </div>

        <h1 className="text-white text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Payroll for everyone.
          <br />
          <span style={{ color: '#4ade80' }}>Finally free.</span>
        </h1>

        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Most payroll software is expensive, complex, or built only for enterprises.
          PayLeaf works for any business — 2 employees or 2000. No subscriptions. No locked features.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link href="/signup"
            className="px-8 py-4 rounded-xl text-white font-semibold text-sm transition"
            style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
            Start for free →
          </Link>
          <a href="https://github.com/Scoder0011/payleaf"
            target="_blank"
            className="px-8 py-4 rounded-xl text-gray-300 font-medium text-sm transition inline-flex items-center gap-2"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span aria-hidden="true">⭐</span>
            Star on GitHub
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-gray-500 text-sm mb-2">What PayLeaf does</p>
          <h2 className="text-center text-white text-3xl font-bold mb-12">
            Everything you need. Nothing you don't.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map(f => {
              const Icon = f.icon
              return (
                <div
                  key={f.title}
                  className="rounded-xl p-6 relative"
                  style={{
                    background: f.soon ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
                    border: f.soon ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(255,255,255,0.08)',
                    opacity: f.soon ? 0.7 : 1
                  }}
                >
                  {f.soon && (
                    <div
                      className="absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium"
                      style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', color: '#fbbf24' }}
                    >
                      Coming soon
                    </div>
                  )}
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{
                      background: f.soon ? 'rgba(255,255,255,0.06)' : 'rgba(22,163,74,0.12)',
                      color: f.soon ? '#d1d5db' : '#4ade80'
                    }}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-gray-500 text-sm mb-2">How it works</p>
          <h2 className="text-center text-white text-3xl font-bold mb-12">
            3 steps every month
          </h2>

          <div className="flex flex-col gap-4">
            {[
              {
                step: '01',
                title: 'Add your employees',
                desc: 'One time setup. Add name, role and base salary. Done.'
              },
              {
                step: '02',
                title: 'Calculate salary',
                desc: 'Open their profile each month, fill in attendance, toggle what applies — overtime, bonuses, deductions. Net salary calculates instantly.'
              },
              {
                step: '03',
                title: 'Mark as paid and generate payslip',
                desc: 'Hit Mark as Paid, download the payslip PDF. Record is saved automatically.'
              },
            ].map(s => (
              <div key={s.step} className="flex gap-6 rounded-xl p-6"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="text-3xl font-bold flex-shrink-0"
                  style={{ color: 'rgba(74,222,128,0.3)' }}>
                  {s.step}
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{s.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 pb-24">
        <div className="max-w-2xl mx-auto text-center rounded-2xl p-12"
          style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)' }}>
          <h2 className="text-white text-3xl font-bold mb-4">
            Start using PayLeaf today
          </h2>
          <p className="text-gray-400 mb-8">
            Free forever. No credit card. No catch.
          </p>
          <Link href="/signup"
            className="inline-block px-8 py-4 rounded-xl text-white font-semibold text-sm transition"
            style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
            Create free account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-8"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PayLeafMarkIcon className="h-8 w-8 text-emerald-500" />
            <span className="text-gray-400 text-sm">PayLeaf — Free. Open source. Forever.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://github.com/Scoder0011/payleaf"
              target="_blank"
              className="text-gray-500 text-sm hover:text-white transition">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/scoder0011/"
              target="_blank"
              className="text-gray-500 text-sm hover:text-white transition">
              LinkedIn
            </a>
            <Link href="/login"
              className="text-gray-500 text-sm hover:text-white transition">
              Login
            </Link>
          </div>
        </div>
      </footer>

    </main>
  )
}
