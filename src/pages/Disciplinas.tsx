import { useState } from 'react'
import { BookOpen, CalendarDays, CreditCard, MapPin, Search, UserRound, X } from 'lucide-react'
import { Badge, EmptyState, PageHeading, ProgressBar } from '../components/ui'
import type { Icon } from '../components/ui'
import { plural } from '../lib/format'
import type { Course, Semester } from '../types'

export function Disciplinas({ semester }: { semester: Semester }) {
  const [search, setSearch] = useState('')
  const term = search.trim().toLowerCase()
  const list = semester.courses.filter(c => `${c.name} ${c.code} ${c.professor}`.toLowerCase().includes(term))
  const credits = semester.courses.reduce((s, c) => s + c.credits, 0)

  return (
    <div>
      <PageHeading
        eyebrow={`Grade de ${semester.id}`}
        title="Minhas disciplinas"
        description={`${plural(semester.courses.length, 'disciplina', 'disciplinas')} e ${credits} créditos. Veja horários, professores e andamento.`}
        action={
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" aria-hidden="true" />
            <input
              type="search"
              aria-label="Buscar disciplina por nome, código ou professor"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar disciplina..."
              className="field pl-10 pr-10 sm:w-72"
            />
            {search && (
              <button type="button" onClick={() => setSearch('')} aria-label="Limpar busca" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-600 hover:bg-slate-100"><X className="h-4 w-4" /></button>
            )}
          </div>
        }
      />
      <p className="sr-only" role="status">{plural(list.length, 'disciplina encontrada', 'disciplinas encontradas')}</p>

      {list.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Nenhuma disciplina encontrada"
          description={`Nada corresponde a "${search}". Tente o nome, o código ou o professor.`}
          action={<button type="button" onClick={() => setSearch('')} className="btn-secondary">Limpar busca</button>}
        />
      ) : (
        <ul className="grid gap-4 lg:grid-cols-2">
          {list.map(c => <li key={c.code}><SubjectCard course={c} concluded={!semester.current} /></li>)}
        </ul>
      )}
    </div>
  )
}

function SubjectCard({ course: c, concluded }: { course: Course; concluded: boolean }) {
  return (
    <article className="card h-full p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-700"><BookOpen className="h-5 w-5" /></span>
          <div>
            <h3 className="font-bold">{c.name}</h3>
            <p className="mt-1 text-xs font-medium text-slate-600">{c.code}</p>
          </div>
        </div>
        {concluded && <Badge tone={c.status === 'Reprovado' ? 'rose' : 'green'}>{c.status === 'Reprovado' ? 'Reprovado' : 'Concluída'}</Badge>}
      </div>
      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        <Info icon={UserRound} label="Professor" text={c.professor} />
        <Info icon={CalendarDays} label="Horário" text={c.schedule} />
        <Info icon={MapPin} label="Sala" text={c.room} />
        <Info icon={CreditCard} label="Créditos" text={`${c.credits} créditos`} />
      </dl>
      <div className="mt-5">
        <div className="mb-2 flex justify-between text-xs font-semibold">
          <span className="text-slate-600">{concluded ? 'Semestre concluído' : 'Progresso do semestre'}</span>
          <span>{c.progress}%</span>
        </div>
        <ProgressBar value={c.progress} label={`Progresso em ${c.name}`} />
      </div>
    </article>
  )
}

function Info({ icon: IconC, label, text }: { icon: Icon; label: string; text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
      <IconC className="h-4 w-4 shrink-0 text-slate-600" />
      <dt className="sr-only">{label}</dt>
      <dd>{text}</dd>
    </div>
  )
}
