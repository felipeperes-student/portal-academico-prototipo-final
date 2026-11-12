import { AlertCircle, ArrowRight, BarChart3, BookOpen, CalendarDays, ChevronDown, ClipboardCheck, Clock3, TrendingUp, UserRound } from 'lucide-react'
import { DeadlineBanner } from '../components/DeadlineBanner'
import { Badge, Metric, statusTone } from '../components/ui'
import type { Icon } from '../components/ui'
import { MATRICULA_DEADLINE, MIN_ATTENDANCE } from '../data/academic'
import { average, daysUntil, fmt1, fmtAvg, formatDay, formatFullDate, formatMonth, matriculaInfo, plural, relativeDays } from '../lib/format'
import type { Page, Profile, Semester } from '../types'

type Props = {
  semester: Semester
  previous?: Semester
  profile: Profile
  matriculaConfirmed: boolean
  onNavigate: (p: Page) => void
}

export function Dashboard({ semester, previous, profile, matriculaConfirmed, onNavigate }: Props) {
  const { courses } = semester
  const avgAll = average(courses.map(c => c.grade))
  const avgApproved = average(courses.filter(c => c.status === 'Aprovado').map(c => c.grade))
  const prevAvg = previous ? average(previous.courses.map(c => c.grade)) : null
  const credits = courses.reduce((sum, c) => sum + c.credits, 0)
  const attendance = Math.round(average(courses.map(c => c.attendance)) ?? 0)
  const pendencies = semester.pendencies.filter(p => !(p.resolvedBy === 'matricula' && matriculaConfirmed))
  const firstName = profile.name.trim().split(/\s+/)[0] || 'aluno'
  const { closed } = matriculaInfo()

  const delta = avgAll !== null && prevAvg !== null ? avgAll - prevAvg : null
  const mediaDetails = [
    `Só aprovadas: ${fmtAvg(avgApproved)}`,
    ...(delta !== null && previous ? [`${delta >= 0 ? '+' : '−'}${fmt1(Math.abs(delta))} em relação a ${previous.id}`] : []),
  ]

  const faq = [
    { q: 'Até quando posso fazer a matrícula?', a: `Até ${formatFullDate(MATRICULA_DEADLINE)}. O prazo fica visível na página de Matrícula e no menu lateral.` },
    { q: 'Por que existem duas médias no boletim?', a: 'A média das aprovadas considera só as disciplinas concluídas. A média parcial inclui também as que ainda estão em andamento.' },
    { q: 'Posso consultar semestres anteriores?', a: 'Sim. Escolha o semestre no topo da página. Semestres encerrados são somente para consulta.' },
  ]

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-indigo-700 p-6 text-white sm:p-8">
        <p className="text-sm font-medium text-indigo-100">Semestre {semester.id}</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Olá, {firstName}</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
          {semester.current
            ? pendencies.length ? `Você tem ${plural(pendencies.length, 'pendência', 'pendências')} neste semestre.` : 'Você está com tudo em dia neste semestre.'
            : 'Este semestre está encerrado. Os dados abaixo são somente para consulta.'}
        </p>
        <button type="button" onClick={() => onNavigate('notas')} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-indigo-800 transition hover:bg-indigo-50">
          Ver minhas notas <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </section>

      {semester.current && (
        <DeadlineBanner
          confirmed={matriculaConfirmed}
          action={!matriculaConfirmed && !closed ? <button type="button" onClick={() => onNavigate('matricula')} className="btn-primary shrink-0">Fazer matrícula</button> : undefined}
        />
      )}

      <section aria-label="Indicadores" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Média parcial" value={fmtAvg(avgAll)} details={mediaDetails} icon={TrendingUp} />
        <Metric label="Disciplinas" value={String(courses.length)} details={[`${credits} créditos`]} icon={BookOpen} tone="emerald" />
        <Metric label="Frequência" value={`${attendance}%`} details={[attendance >= MIN_ATTENDANCE ? `Acima do mínimo de ${MIN_ATTENDANCE}%` : `Abaixo do mínimo de ${MIN_ATTENDANCE}%`]} icon={Clock3} tone="violet" />
        <Metric label="Pendências" value={String(pendencies.length)} details={pendencies.length ? pendencies.map(p => p.title) : ['Nada pendente']} icon={AlertCircle} tone="amber" />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_.8fr]">
        <section className="card" aria-labelledby="acoes">
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <h3 id="acoes" className="font-bold">Ações rápidas</h3>
            <p className="mt-1 text-sm text-slate-600">Acesse o que você mais precisa.</p>
          </div>
          <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
            <QuickAction icon={BarChart3} title="Consultar notas" description="Veja seu desempenho" onClick={() => onNavigate('notas')} />
            <QuickAction icon={BookOpen} title="Ver disciplinas" description="Horários e professores" onClick={() => onNavigate('disciplinas')} />
            <QuickAction icon={ClipboardCheck} title="Fazer matrícula" description={semester.current ? `Prazo: ${formatFullDate(MATRICULA_DEADLINE).split(', ')[1]}` : 'Disponível no semestre atual'} onClick={() => onNavigate('matricula')} />
            <QuickAction icon={UserRound} title="Atualizar perfil" description="Mantenha seus dados em dia" onClick={() => onNavigate('perfil')} />
          </div>
        </section>

        <section className="card" aria-labelledby="eventos">
          <div className="flex items-center justify-between p-5 sm:p-6">
            <div>
              <h3 id="eventos" className="font-bold">Próximos eventos</h3>
              <p className="mt-1 text-sm text-slate-600">Não perca os prazos.</p>
            </div>
            <CalendarDays className="h-5 w-5 text-indigo-700" aria-hidden="true" />
          </div>
          <ul className="space-y-1 px-5 pb-5 sm:px-6 sm:pb-6">
            {semester.events.length === 0 && <li className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">Nenhum prazo em aberto neste semestre.</li>}
            {semester.events.map(ev => (
              <li key={ev.title} className="flex items-center gap-3 rounded-xl p-3">
                <div className={`w-14 shrink-0 rounded-xl px-2 py-2 text-center text-xs font-bold ${ev.urgent ? 'bg-rose-50 text-rose-800' : 'bg-indigo-50 text-indigo-800'}`}>
                  <span className="block text-base leading-none">{formatDay(ev.date)}</span>
                  <span className="mt-1 block">{formatMonth(ev.date)}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold">{ev.title}</p>
                  <p className="mt-0.5 text-xs text-slate-600">{ev.meta} • {relativeDays(daysUntil(ev.date))}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="card" aria-labelledby="resumo">
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h3 id="resumo" className="font-bold">Resumo das notas</h3>
            <p className="mt-1 text-sm text-slate-600">Primeiras disciplinas de {semester.id}.</p>
          </div>
          <button type="button" onClick={() => onNavigate('notas')} className="self-start text-sm font-semibold text-indigo-700 hover:text-indigo-900">Ver todas as notas</button>
        </div>
        <ul className="divide-y divide-slate-100 border-t border-slate-100">
          {courses.slice(0, 4).map(c => (
            <li key={c.code} className="flex items-center gap-3 px-5 py-4 sm:px-6">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{c.name}</p>
                <p className="mt-0.5 text-xs text-slate-600">{c.code} • {c.professor}</p>
              </div>
              <span className="hidden sm:block"><Badge tone={statusTone(c.status)}>{c.status}</Badge></span>
              <span className="text-lg font-bold">{fmt1(c.grade)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card p-5 sm:p-6" aria-labelledby="ajuda">
        <h3 id="ajuda" className="font-bold">Central de ajuda</h3>
        <p className="mt-1 text-sm text-slate-600">Dúvidas frequentes sobre o portal.</p>
        <div className="mt-4 divide-y divide-slate-100 border-t border-slate-100">
          {faq.map(item => (
            <details key={item.q} className="group py-3">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg text-sm font-semibold">
                {item.q}
                <ChevronDown className="h-4 w-4 shrink-0 text-slate-600 transition group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-600">
          Ainda com dúvida? Escreva para <a className="font-semibold text-indigo-700 underline" href="mailto:secretaria@educonnect.example">secretaria@educonnect.example</a>.
        </p>
      </section>
    </div>
  )
}

function QuickAction({ icon: IconC, title, description, onClick }: { icon: Icon; title: string; description: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="group flex items-center gap-4 rounded-2xl border border-slate-200 p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50/50">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-indigo-100 group-hover:text-indigo-700"><IconC className="h-5 w-5" /></span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold">{title}</span>
        <span className="mt-1 block text-xs text-slate-600">{description}</span>
      </span>
      <ArrowRight className="h-4 w-4 text-slate-500" aria-hidden="true" />
    </button>
  )
}
