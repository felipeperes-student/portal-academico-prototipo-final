import { BarChart3, BookOpen, ClipboardCheck, GraduationCap, Home, LogOut, UserRound, X } from 'lucide-react'
import { STUDENT_RA } from '../data/academic'
import type { Page, Profile } from '../types'
import { Avatar, IconButton } from './ui'
import type { Icon } from './ui'

export const navItems: { id: Page; label: string; icon: Icon }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'notas', label: 'Notas', icon: BarChart3 },
  { id: 'disciplinas', label: 'Disciplinas', icon: BookOpen },
  { id: 'matricula', label: 'Matrícula', icon: ClipboardCheck },
  { id: 'perfil', label: 'Meu perfil', icon: UserRound },
]

type Props = {
  page: Page
  open: boolean
  profile: Profile
  matriculaTag: string
  onNavigate: (p: Page) => void
  onClose: () => void
  onLogout: () => void
}

export function Sidebar({ page, open, profile, matriculaTag, onNavigate, onClose, onLogout }: Props) {
  return (
    <>
      {open && <button type="button" onClick={onClose} className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden print:hidden" aria-label="Fechar menu" />}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-950 px-5 py-6 text-white transition-[transform,visibility] duration-300 lg:translate-x-0 print:hidden ${open ? 'translate-x-0' : '-translate-x-full max-lg:invisible'}`}
      >
        <div className="flex items-center justify-between px-2">
          <button type="button" onClick={() => onNavigate('dashboard')} className="flex items-center gap-3 rounded-xl">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-600"><GraduationCap className="h-6 w-6" aria-hidden="true" /></span>
            <span className="text-left">
              <span className="block text-lg font-bold tracking-tight">EduConnect</span>
              <span className="block text-xs text-slate-400">Portal acadêmico</span>
            </span>
          </button>
          {/* Só existe no mobile: no desktop o menu é fixo e não há o que fechar */}
          <IconButton label="Fechar menu" onClick={onClose} className="text-slate-300 hover:bg-white/10 hover:text-white lg:hidden">
            <X className="h-5 w-5" />
          </IconButton>
        </div>

        <nav aria-label="Principal" className="mt-9 space-y-1.5">
          {navItems.map(({ id, label, icon: IconC }) => (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              aria-current={page === id ? 'page' : undefined}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${page === id ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
            >
              <IconC className="h-5 w-5" />
              {label}
              {id === 'matricula' && matriculaTag && (
                <span className="ml-auto rounded-full bg-amber-300 px-2 py-0.5 text-xs font-bold text-amber-950">{matriculaTag}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto">
          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <Avatar profile={profile} className="h-10 w-10 text-sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{profile.name}</p>
              <p className="truncate text-xs text-slate-400">RA {STUDENT_RA}</p>
            </div>
          </div>
          <button type="button" onClick={onLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-300 transition hover:bg-rose-500/15 hover:text-rose-200">
            <LogOut className="h-5 w-5" /> Sair do sistema
          </button>
        </div>
      </aside>
    </>
  )
}
