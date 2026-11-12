import { useEffect, useId, useRef } from 'react'
import type { ButtonHTMLAttributes, ComponentType, ReactNode } from 'react'
import { X } from 'lucide-react'
import type { CourseStatus, Profile } from '../types'

export type Icon = ComponentType<{ className?: string }>

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { label: string }

export function IconButton({ label, className = '', children, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export const initials = (name: string) =>
  name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join('') || '?'

export function Avatar({ profile, className }: { profile: Pick<Profile, 'name' | 'photo'>; className: string }) {
  if (profile.photo) {
    return <img src={profile.photo} alt="" className={`shrink-0 rounded-full object-cover ${className}`} />
  }
  return (
    <span aria-hidden="true" className={`grid shrink-0 place-items-center rounded-full bg-indigo-600 font-bold text-white ${className}`}>
      {initials(profile.name)}
    </span>
  )
}

type Tone = 'green' | 'amber' | 'rose' | 'indigo' | 'slate'
const tones: Record<Tone, string> = {
  green: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  amber: 'bg-amber-50 text-amber-900 ring-amber-200',
  rose: 'bg-rose-50 text-rose-800 ring-rose-200',
  indigo: 'bg-indigo-50 text-indigo-800 ring-indigo-200',
  slate: 'bg-slate-100 text-slate-700 ring-slate-200',
}

export function Badge({ tone = 'slate', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${tones[tone]}`}>
      {children}
    </span>
  )
}

export const statusTone = (s: CourseStatus): Tone => (s === 'Aprovado' ? 'green' : s === 'Reprovado' ? 'rose' : 'amber')

export function PageHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="text-sm font-semibold text-indigo-700">{eyebrow}</p>}
        <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
      </div>
      {action}
    </div>
  )
}

export function ProgressBar({ value, label, max = 100 }: { value: number; label: string; max?: number }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} className="h-2 overflow-hidden rounded-full bg-slate-100">
      <div className="h-full rounded-full bg-indigo-600 transition-[width] duration-500" style={{ width: `${pct}%` }} />
    </div>
  )
}

export function EmptyState({ icon: IconC, title, description, action }: { icon: Icon; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center px-6 py-12 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-600"><IconC className="h-6 w-6" /></span>
      <h3 className="mt-4 font-bold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-600">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

const metricTones = {
  indigo: 'bg-indigo-50 text-indigo-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  violet: 'bg-violet-50 text-violet-700',
  amber: 'bg-amber-50 text-amber-800',
}

export function Metric({ label, value, details, icon: IconC, tone = 'indigo' }: { label: string; value: string; details?: string[]; icon: Icon; tone?: keyof typeof metricTones }) {
  return (
    <div className="card p-5">
      <span className={`grid h-10 w-10 place-items-center rounded-xl ${metricTones[tone]}`}><IconC className="h-5 w-5" /></span>
      <p className="mt-4 text-sm font-medium text-slate-600">{label}</p>
      <p className="mt-1 text-3xl font-bold tracking-tight">{value}</p>
      {details?.map(d => <p key={d} className="mt-1 text-xs text-slate-600">{d}</p>)}
    </div>
  )
}

/** Modal com <dialog> nativo: prende o foco, fecha com Esc e devolve o foco ao botão que o abriu. */
export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null)
  const opener = useRef<Element | null>(document.activeElement)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (dialog && !dialog.open) dialog.showModal()
    const el = opener.current
    return () => {
      if (el instanceof HTMLElement) el.focus()
    }
  }, [])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      className="m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/50"
    >
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
        <h2 id={titleId} className="text-lg font-bold">{title}</h2>
        <IconButton label="Fechar" onClick={onClose}><X className="h-5 w-5" /></IconButton>
      </div>
      <div className="px-6 py-5">{children}</div>
    </dialog>
  )
}
