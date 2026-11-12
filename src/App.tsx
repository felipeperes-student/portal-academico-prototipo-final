import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, GraduationCap, Info, X } from 'lucide-react'
import { Header } from './components/Header'
import { MobileNav } from './components/MobileNav'
import { Sidebar } from './components/Sidebar'
import { IconButton } from './components/ui'
import { MATRICULA_DEADLINE, currentSemester, initialNotices, initialProfile, semesters } from './data/academic'
import { formatShortDate, matriculaInfo } from './lib/format'
import { useLocalStorage, useRoute } from './lib/hooks'
import { Dashboard } from './pages/Dashboard'
import { Disciplinas } from './pages/Disciplinas'
import { Matricula } from './pages/Matricula'
import { Notas } from './pages/Notas'
import { Perfil } from './pages/Perfil'
import type { MatriculaState, Page, Profile, ToastKind } from './types'

const titles: Record<Page, string> = {
  dashboard: 'Dashboard',
  notas: 'Minhas notas',
  disciplinas: 'Minhas disciplinas',
  matricula: 'Matrícula',
  perfil: 'Meu perfil',
}

const semesterIds = semesters.map(s => s.id)

export default function App() {
  const [page, navigate] = useRoute()
  const [loggedOut, setLoggedOut] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [semesterId, setSemesterId] = useLocalStorage('educonnect:semester', currentSemester.id)
  const [profile, setProfile] = useLocalStorage<Profile>('educonnect:profile', initialProfile)
  const [readIds, setReadIds] = useLocalStorage<string[]>('educonnect:read-notices', [])
  const [matricula, setMatricula] = useLocalStorage<MatriculaState>('educonnect:matricula', { selected: [], confirmed: null })
  const [toast, setToast] = useState<{ message: string; kind: ToastKind } | null>(null)

  const toastTimer = useRef<number>()
  const mainRef = useRef<HTMLElement>(null)
  const firstRender = useRef(true)

  const semesterIndex = Math.max(0, semesterIds.indexOf(semesterId))
  const semester = semesters[semesterIndex]
  const previous = semesters[semesterIndex + 1]
  const matriculaConfirmed = matricula.confirmed !== null

  const notices = useMemo(() => initialNotices.map(n => ({ ...n, read: readIds.includes(n.id) })), [readIds])

  const showToast = useCallback((message: string, kind: ToastKind = 'success') => {
    window.clearTimeout(toastTimer.current)
    setToast({ message, kind })
    toastTimer.current = window.setTimeout(() => setToast(null), 5000)
  }, [])

  useEffect(() => () => window.clearTimeout(toastTimer.current), [])

  // A cada troca de página (inclusive pelo botão Voltar): título, rolagem, foco e menu mobile
  useEffect(() => {
    document.title = `${titles[page]} · EduConnect`
    window.scrollTo({ top: 0 })
    setSidebarOpen(false)
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    mainRef.current?.focus({ preventScroll: true })
  }, [page])

  useEffect(() => {
    if (!sidebarOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSidebarOpen(false) }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [sidebarOpen])

  const changeSemester = (id: string) => {
    setSemesterId(id)
    const target = semesters.find(s => s.id === id)
    showToast(target?.current ? `Exibindo o semestre atual (${id}).` : `Exibindo o semestre ${id}, encerrado e somente para consulta.`, 'info')
  }

  const readNotice = (id: string) => setReadIds(ids => (ids.includes(id) ? ids : [...ids, id]))
  const readAll = () => setReadIds(initialNotices.map(n => n.id))

  const { closed } = matriculaInfo()
  const matriculaTag = closed ? 'Encerrada' : matriculaConfirmed ? 'Confirmada' : `Até ${formatShortDate(MATRICULA_DEADLINE)}`

  if (loggedOut) {
    return (
      <main className="grid min-h-screen place-items-center px-4">
        <div className="card max-w-md p-8 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-indigo-600 text-white"><GraduationCap className="h-7 w-7" aria-hidden="true" /></span>
          <h1 className="mt-5 text-2xl font-bold">Sessão encerrada</h1>
          <p className="mt-2 text-sm text-slate-600">Você saiu do EduConnect com segurança. Esta é uma demonstração: o botão abaixo apenas reabre o portal.</p>
          <button type="button" autoFocus onClick={() => { setLoggedOut(false); showToast('Bem-vindo de volta.') }} className="btn-primary mt-6 w-full">Entrar novamente</button>
        </div>
      </main>
    )
  }

  return (
    <div className="min-h-screen">
      <button type="button" onClick={() => mainRef.current?.focus()} className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[70] focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:shadow-lg">
        Pular para o conteúdo
      </button>

      <Sidebar page={page} open={sidebarOpen} profile={profile} matriculaTag={matriculaTag} onNavigate={navigate} onClose={() => setSidebarOpen(false)} onLogout={() => setLoggedOut(true)} />

      <div className="lg:pl-72 print:pl-0">
        <Header
          title={titles[page]}
          semesterIds={semesterIds}
          currentId={currentSemester.id}
          semesterId={semester.id}
          onSemester={changeSemester}
          onMenu={() => setSidebarOpen(true)}
          notices={notices}
          onReadNotice={readNotice}
          onReadAll={readAll}
          profile={profile}
          onNavigate={navigate}
          onLogout={() => setLoggedOut(true)}
        />

        <main id="conteudo" ref={mainRef} tabIndex={-1} className="mx-auto max-w-[1500px] px-4 pb-28 pt-6 outline-none sm:px-6 lg:px-8 lg:pb-10">
          {!semester.current && page !== 'perfil' && (
            <div role="status" className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-300 bg-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
              <p className="text-sm text-slate-800"><b>Você está vendo o semestre {semester.id}.</b> Ele já foi encerrado e os dados são somente para consulta.</p>
              <button type="button" onClick={() => changeSemester(currentSemester.id)} className="btn-secondary shrink-0">Voltar para {currentSemester.id}</button>
            </div>
          )}

          <div key={page} className="animate-page">
            {page === 'dashboard' && <Dashboard semester={semester} previous={previous} profile={profile} matriculaConfirmed={matriculaConfirmed} onNavigate={navigate} />}
            {page === 'notas' && <Notas semester={semester} />}
            {page === 'disciplinas' && <Disciplinas semester={semester} />}
            {page === 'matricula' && <Matricula semester={semester} state={matricula} setState={setMatricula} onToast={showToast} onGoCurrent={() => changeSemester(currentSemester.id)} />}
            {page === 'perfil' && <Perfil profile={profile} onSave={setProfile} onToast={showToast} />}
          </div>
        </main>
      </div>

      <MobileNav page={page} onNavigate={navigate} />

      <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex justify-center px-4 lg:bottom-6 print:hidden">
        {toast && (
          <div className="pointer-events-auto flex max-w-md items-start gap-3 rounded-2xl bg-slate-900 py-3 pl-4 pr-2 text-sm font-medium text-white shadow-2xl">
            {toast.kind === 'success' && <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" aria-hidden="true" />}
            {toast.kind === 'error' && <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" aria-hidden="true" />}
            {toast.kind === 'info' && <Info className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" aria-hidden="true" />}
            <span className="py-0.5">{toast.message}</span>
            <IconButton label="Fechar aviso" onClick={() => setToast(null)} className="!p-1 text-slate-300 hover:bg-white/10 hover:text-white"><X className="h-4 w-4" /></IconButton>
          </div>
        )}
      </div>
    </div>
  )
}
