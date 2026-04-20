'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useTheme } from '@/lib/theme'
import { MoonIcon, SunIcon } from '@/components/ui/icons'

export default function SettingsPage() {
  const [business, setBusiness] = useState<any>(null)
  const [businessName, setBusinessName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwError, setPwError] = useState('')
  const [pwSaved, setPwSaved] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const supabase = createClient()
  const ThemeIcon = theme === 'dark' ? SunIcon : MoonIcon
  const [currency, setCurrency] = useState('INR')
  const [currencySaved, setCurrencySaved] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase.from('businesses').select('*').single()
    setBusiness(data)
    setBusinessName(data?.name || '')
    setCurrency(data?.currency || 'INR')
    setLoading(false)
  }

  async function saveBusinessName() {
    setSaving(true)
    await supabase
      .from('businesses')
      .update({ name: businessName })
      .eq('id', business.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function saveCurrency() {
    if (!business?.id) return

    await supabase
      .from('businesses')
      .update({ currency })
      .eq('id', business.id)

    setCurrencySaved(true)
    setTimeout(() => setCurrencySaved(false), 2000)
  }

  async function changePassword() {
    setPwError('')
    if (newPassword.length < 6) {
      setPwError('Password must be at least 6 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setPwError('Passwords do not match')
      return
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) { setPwError(error.message); return }
    setNewPassword('')
    setConfirmPassword('')
    setPwSaved(true)
    setTimeout(() => setPwSaved(false), 2000)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
    </div>
  )

  return (
    <div className="w-full max-w-2xl p-4 sm:p-8">
      <div className="mb-8">
        <h1 style={{ color: 'var(--text-primary)' }} className="text-2xl font-bold">Settings</h1>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm mt-1">Manage your account and preferences</p>
      </div>

      {/* Business name */}
      <div className="rounded-xl p-6 mb-4"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h2 style={{ color: 'var(--text-primary)' }} className="font-semibold mb-1">Organization Name</h2>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm mb-4">This shows on your dashboard and payslips</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={businessName}
            onChange={e => setBusinessName(e.target.value)}
            className="w-full min-w-0 flex-1 px-4 py-3 rounded-lg text-sm outline-none"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)'
            }}
          />
          <button
            onClick={saveBusinessName}
            disabled={saving}
            className="w-full rounded-lg px-5 py-3 text-white text-sm font-medium transition disabled:opacity-50 sm:w-auto sm:whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
          >
            {saved ? 'Saved ✓' : saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Currency */}
      <div className="rounded-xl p-6 mb-4"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h2 style={{ color: 'var(--text-primary)' }} className="font-semibold mb-1">Currency</h2>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm mb-4">
          Set your default currency for salary display
        </p>
        <div className="flex gap-3">
          <select
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg text-sm outline-none"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              colorScheme: 'dark'
            }}
          >
            <option value="INR">INR — Indian Rupee (Rs.)</option>
            <option value="USD">USD — US Dollar ($)</option>
            <option value="EUR">EUR — Euro (€)</option>
            <option value="GBP">GBP — British Pound (£)</option>
            <option value="AED">AED — UAE Dirham (AED)</option>
            <option value="SGD">SGD — Singapore Dollar (S$)</option>
            <option value="AUD">AUD — Australian Dollar (A$)</option>
            <option value="CAD">CAD — Canadian Dollar (C$)</option>
          </select>
          <button
            onClick={saveCurrency}
            className="px-5 py-3 rounded-lg text-white text-sm font-medium transition"
            style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
          >
            {currencySaved ? 'Saved ✓' : 'Save'}
          </button>
        </div>
      </div>

      {/* Theme */}
      <div className="rounded-xl p-6 mb-4"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h2 style={{ color: 'var(--text-primary)' }} className="font-semibold mb-1">Appearance</h2>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm mb-4">Switch between dark and light mode</p>
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-5 py-3 rounded-lg text-sm font-medium transition"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
        >
          <ThemeIcon className="h-5 w-5 flex-shrink-0" />
          Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
        </button>
      </div>

      {/* Change password */}
      <div className="rounded-xl p-6 mb-4"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h2 style={{ color: 'var(--text-primary)' }} className="font-semibold mb-1">Change Password</h2>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm mb-4">Choose a strong password</p>
        <div className="flex flex-col gap-3">
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg text-sm outline-none"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)'
            }}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg text-sm outline-none"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)'
            }}
          />
          {pwError && <p className="text-red-400 text-sm">{pwError}</p>}
          <button
            onClick={changePassword}
            className="px-5 py-3 rounded-lg text-white text-sm font-medium transition w-fit"
            style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
          >
            {pwSaved ? 'Updated ✓' : 'Update Password'}
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-xl p-6"
        style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}>
        <h2 className="text-red-400 font-semibold mb-1">Danger Zone</h2>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm mb-4">
          These actions are irreversible. Please be careful.
        </p>
        <button
          className="px-5 py-3 rounded-lg text-red-400 text-sm font-medium transition"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
          onClick={() => alert('Delete account coming soon')}
        >
          Delete Account
        </button>
      </div>
    </div>
  )
}
