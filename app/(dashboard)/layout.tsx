'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter, usePathname } from 'next/navigation'
import { useTheme } from '@/lib/theme'
import Link from 'next/link'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DashboardIcon,
  HistoryIcon,
  LogoutIcon,
  MoonIcon,
  PayLeafMarkIcon,
  SettingsIcon,
  SunIcon,
  UsersIcon,
} from '@/components/ui/icons'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [business, setBusiness] = useState<any>(null)
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      const { data } = await supabase.from('businesses').select('*').single()
      setBusiness(data)
    }
    load()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
    { href: '/employees', label: 'Employees', icon: UsersIcon },
    { href: '/history', label: 'History', icon: HistoryIcon },
    { href: '/settings', label: 'Settings', icon: SettingsIcon },
  ]
  const ThemeIcon = theme === 'dark' ? SunIcon : MoonIcon

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>

      {/* Sidebar */}
      <aside
        className="flex flex-col justify-between py-6 transition-all duration-300"
        style={{
          width: collapsed ? '72px' : '240px',
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border)',
          minHeight: '100vh'
        }}
      >
        {/* Top */}
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 px-5 mb-8">
            <PayLeafMarkIcon className="h-9 w-9 flex-shrink-0 text-emerald-500" />
            {!collapsed && (
              <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>PayLeaf</span>
            )}
          </div>

          {/* Business name */}
          {!collapsed && business && (
            <div className="px-5 mb-6">
              <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Organization</p>
              <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{business.name}</p>
            </div>
          )}

          {/* Nav links */}
          <nav className="flex flex-col gap-1 px-3">
            {links.map(link => {
              const active = pathname === link.href
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg transition-all"
                  style={{
                    background: active ? 'rgba(22,163,74,0.15)' : 'transparent',
                    border: active ? '1px solid rgba(22,163,74,0.3)' : '1px solid transparent',
                    color: active ? '#4ade80' : 'var(--text-secondary)'
                  }}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && (
                    <span className="text-sm font-medium">{link.label}</span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Bottom */}
        <div className="px-3 flex flex-col gap-1">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-3 py-3 rounded-lg transition-all w-full text-left"
            style={{ color: 'var(--text-muted)' }}
          >
            <ThemeIcon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && (
              <span className="text-sm">
                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </span>
            )}
          </button>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-3 px-3 py-3 rounded-lg transition-all w-full text-left"
            style={{ color: 'var(--text-muted)' }}
          >
            {collapsed ? (
              <ChevronRightIcon className="h-5 w-5 flex-shrink-0" />
            ) : (
              <ChevronLeftIcon className="h-5 w-5 flex-shrink-0" />
            )}
            {!collapsed && <span className="text-sm">Collapse</span>}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-3 rounded-lg transition-all w-full text-left hover:bg-red-500/10"
            style={{ color: 'var(--text-muted)' }}
          >
            <LogoutIcon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto" style={{ background: 'var(--bg-primary)' }}>
        {children}
      </main>

    </div>
  )
}
