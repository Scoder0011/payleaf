import { useEffect, useState } from 'react'
import { createClient } from './supabase'
import { formatCurrency } from './currency'

export function useBusiness() {
  const [business, setBusiness] = useState<any>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('businesses')
        .select('*')
        .single()
      setBusiness(data)
    }
    load()
  }, [])

  function format(amount: number) {
    return formatCurrency(amount, business?.currency || 'INR')
  }

  return { business, format }
}