export const currencySymbols: Record<string, string> = {
  INR: 'Rs.',
  USD: '$',
  EUR: '€',
  GBP: '£',
  AED: 'AED',
  SGD: 'S$',
  AUD: 'A$',
  CAD: 'C$',
}

export function formatCurrency(amount: number, currency: string = 'INR') {
  const symbol = currencySymbols[currency] || currency
  return `${symbol} ${amount.toLocaleString()}`
}
