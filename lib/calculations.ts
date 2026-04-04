export interface SalaryInputs {
  basicSalary: number
  hra: number
  allowances: number
  workingDays: number
  daysPresent: number
  overtimeHours: number
  overtimeRate: number
  bonus: number
  pfEnabled: boolean
  pfRate: number
  esiEnabled: boolean
  esiRate: number
  tdsEnabled: boolean
  tdsRate: number
  ptEnabled: boolean
  ptAmount: number
}

export interface SalaryResult {
  grossSalary: number
  lopDeduction: number
  pfDeduction: number
  esiDeduction: number
  tdsDeduction: number
  ptDeduction: number
  totalDeductions: number
  netSalary: number
}

export function calculateSalary(inputs: SalaryInputs): SalaryResult {
  const {
    basicSalary, hra, allowances,
    workingDays, daysPresent,
    overtimeHours, overtimeRate, bonus,
    pfEnabled, pfRate,
    esiEnabled, esiRate,
    tdsEnabled, tdsRate,
    ptEnabled, ptAmount
  } = inputs

  const perDaySalary = basicSalary / workingDays
  const lopDeduction = perDaySalary * (workingDays - daysPresent)
  const overtimePay = overtimeHours * overtimeRate
  const grossSalary = (basicSalary - lopDeduction) + hra + allowances + overtimePay + bonus

  const pfDeduction = pfEnabled ? (basicSalary * pfRate) / 100 : 0
  const esiDeduction = esiEnabled ? (grossSalary * esiRate) / 100 : 0
  const tdsDeduction = tdsEnabled ? (grossSalary * tdsRate) / 100 : 0
  const ptDeduction = ptEnabled ? ptAmount : 0

  const totalDeductions = lopDeduction + pfDeduction + esiDeduction + tdsDeduction + ptDeduction
  const netSalary = grossSalary - pfDeduction - esiDeduction - tdsDeduction - ptDeduction

  return {
    grossSalary: Math.round(grossSalary),
    lopDeduction: Math.round(lopDeduction),
    pfDeduction: Math.round(pfDeduction),
    esiDeduction: Math.round(esiDeduction),
    tdsDeduction: Math.round(tdsDeduction),
    ptDeduction: Math.round(ptDeduction),
    totalDeductions: Math.round(totalDeductions),
    netSalary: Math.round(netSalary)
  }
}