import { MATRICULA_DEADLINE, TODAY } from '../data/academic'

const nf1 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
const nf2 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const fmt1 = (n: number) => nf1.format(n)
export const fmt2 = (n: number) => nf2.format(n)
export const fmtAvg = (n: number | null) => (n === null ? '—' : fmt2(n))

export const average = (values: number[]) =>
  values.length ? values.reduce((a, b) => a + b, 0) / values.length : null

export const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

const toUTC = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return Date.UTC(y, m - 1, d)
}
const toDate = (iso: string) => new Date(toUTC(iso))

export const daysUntil = (iso: string, today: string = TODAY) =>
  Math.round((toUTC(iso) - toUTC(today)) / 86_400_000)

const full = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
const short = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'UTC' })
const month = new Intl.DateTimeFormat('pt-BR', { month: 'short', timeZone: 'UTC' })

export const formatFullDate = (iso: string) => full.format(toDate(iso))
export const formatShortDate = (iso: string) => short.format(toDate(iso))
export const formatDay = (iso: string) => String(toDate(iso).getUTCDate()).padStart(2, '0')
export const formatMonth = (iso: string) => month.format(toDate(iso)).replace('.', '')

export const relativeDays = (days: number) => {
  if (days < 0) return 'encerrado'
  if (days === 0) return 'hoje'
  if (days === 1) return 'amanhã'
  return `em ${days} dias`
}

export function matriculaInfo() {
  const days = daysUntil(MATRICULA_DEADLINE)
  return { days, closed: days < 0, urgent: days <= 3 }
}
