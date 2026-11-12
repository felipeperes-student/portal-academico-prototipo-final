import { useCallback, useId, useRef, useState } from 'react'
import { Bell, CalendarDays, Check, CheckCheck, ChevronDown, ClipboardCheck, CheckCircle2, LogOut, Menu, User } from 'lucide-react'
import { useDismiss } from '../lib/hooks'
import type { Notice, Page, Profile } from '../types'
import { Avatar, IconButton } from './ui'

type Props = {
  title: string
  semesterIds: string[]
  currentId: string
  semesterId: string
  onSemester: (id: string) => void
  onMenu: () => void
  notices: Notice[]
  onReadNotice: (id: string) => void
  onReadAll: () => void
  profile: Profile
  onNavigate: (p: Page) => void
  onLogout: () => void
}

export function Header(p: Props) {
  const [menu, setMenu] = useState<'notices' | 'profile' | null>(null)
  const noticeRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const noticeId = useId()
  const profileId = useId()
  const close = useCallback(() => setMenu(null), [])
  useDismiss(noticeRef, menu === 'notices', close)
  useDismiss(profileRef, menu === 'profile', close)

  const unread = p.notices.filter(n => !n.read).length

  const openNotice = (n: Notice) => {
    p.onReadNotice(n.id)
    setMenu(null)
    p.onNavigate(n.page)
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur print:static print:border-0">
      <div className="flex h-16 items-center justify-between gap-2 px-4 sm:px-6 lg:h-20 lg:px-8">
        <div className="flex min-w-0 items-center gap-2">
          <IconButton label="Abrir menu" onClick={p.onMenu} className="lg:hidden print:hidden"><Menu className="h-6 w-6" /></IconButton>
          <div className="min-w-0">
            <p className="hidden text-xs font-medium text-slate-600 sm:block">Área do aluno</p>
            <h1 className="truncate text-lg font-bold tracking-tight sm:text-xl">{p.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 print:hidden">
          <label className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-700 sm:px-3 sm:py-2">
            <CalendarDays className="h-4 w-4 text-indigo-700" aria-hidden="true" />
            <span className="sr-only">Semestre</span>
            <select value={p.semesterId} onChange={e => p.onSemester(e.target.value)} className="bg-transparent outline-none">
              {p.semesterIds.map(id => <option key={id} value={id}>{id}{id === p.currentId ? ' (atual)' : ''}</option>)}
            </select>
          </label>

          <div className="relative" ref={noticeRef}>
            <IconButton
              label={unread ? `Notificações, ${unread} não lida${unread > 1 ? 's' : ''}` : 'Notificações'}
              aria-expanded={menu === 'notices'}
              aria-controls={noticeId}
              onClick={() => setMenu(menu === 'notices' ? null : 'notices')}
              className="relative"
            >
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <span aria-hidden="true" className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-indigo-600 px-1 text-xs font-bold text-white ring-2 ring-white">{unread}</span>
              )}
            </IconButton>
            {menu === 'notices' && (
              <div id={noticeId} className="fixed inset-x-4 top-[4.5rem] z-40 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-96">
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
                  <h2 className="font-bold">Notificações</h2>
                  <button type="button" onClick={p.onReadAll} disabled={!unread} className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900 disabled:cursor-not-allowed disabled:text-slate-500">
                    <CheckCheck className="h-4 w-4" /> Marcar todas como lidas
                  </button>
                </div>
                {p.notices.length === 0 ? (
                  <p className="p-6 text-center text-sm text-slate-600">Você não tem notificações.</p>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {p.notices.map(n => (
                      <li key={n.id} className={`flex items-start gap-1 p-2 ${n.read ? '' : 'bg-indigo-50/50'}`}>
                        <button type="button" onClick={() => openNotice(n)} className="flex flex-1 gap-3 rounded-xl p-2 text-left hover:bg-slate-50">
                          <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${n.tone === 'amber' ? 'bg-amber-50 text-amber-800' : 'bg-emerald-50 text-emerald-700'}`}>
                            {n.tone === 'amber' ? <ClipboardCheck className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                          </span>
                          <span>
                            <span className="block text-sm font-semibold">{n.title}{!n.read && <span className="sr-only"> (não lida)</span>}</span>
                            <span className="mt-0.5 block text-xs text-slate-600">{n.body}</span>
                          </span>
                        </button>
                        {!n.read && (
                          <IconButton label={`Marcar "${n.title}" como lida`} onClick={() => p.onReadNotice(n.id)}><Check className="h-4 w-4" /></IconButton>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                <p className="border-t border-slate-100 bg-slate-50 px-4 py-2.5 text-xs text-slate-600">Prazos importantes continuam visíveis na página de Matrícula.</p>
              </div>
            )}
          </div>

          <div className="relative" ref={profileRef}>
            <button
              type="button"
              aria-expanded={menu === 'profile'}
              aria-controls={profileId}
              aria-label="Menu da conta"
              onClick={() => setMenu(menu === 'profile' ? null : 'profile')}
              className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-100"
            >
              <Avatar profile={p.profile} className="h-9 w-9 text-xs" />
              <span className="hidden text-left sm:block">
                <span className="block text-xs font-bold">{p.profile.name}</span>
                <span className="block text-xs text-slate-600">Aluno</span>
              </span>
              <ChevronDown className="hidden h-4 w-4 text-slate-600 sm:block" aria-hidden="true" />
            </button>
            {menu === 'profile' && (
              <div id={profileId} className="absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl">
                <button type="button" onClick={() => { setMenu(null); p.onNavigate('perfil') }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-slate-50"><User className="h-4 w-4" /> Meu perfil</button>
                <button type="button" onClick={() => { setMenu(null); p.onLogout() }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-700 hover:bg-rose-50"><LogOut className="h-4 w-4" /> Sair</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
