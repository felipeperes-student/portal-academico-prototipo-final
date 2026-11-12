import { useMemo, useState } from 'react'
import { BarChart3, CheckCircle2, Printer, Search, TrendingUp } from 'lucide-react'
import { Badge, EmptyState, Metric, PageHeading, statusTone } from '../components/ui'
import { average, fmt1, fmtAvg, plural } from '../lib/format'
import type { CourseStatus, Semester } from '../types'

type Filter = 'Todas' | CourseStatus
type Sort = 'nome' | 'nota'

export function Notas({ semester }: { semester: Semester }) {
  const [filter, setFilter] = useState<Filter>('Todas')
  const [sort, setSort] = useState<Sort>('nome')
  const { courses } = semester

  const approved = courses.filter(c => c.status === 'Aprovado')
  const inProgress = courses.filter(c => c.status === 'Em andamento')
  const done = courses.filter(c => c.status !== 'Em andamento')
  const best = courses.reduce((a, b) => (b.grade > a.grade ? b : a), courses[0])

  const rows = useMemo(() => {
    const list = courses.filter(c => filter === 'Todas' || c.status === filter)
    return [...list].sort((a, b) => (sort === 'nota' ? b.grade - a.grade : a.name.localeCompare(b.name, 'pt-BR')))
  }, [courses, filter, sort])

  return (
    <div>
      <PageHeading
        eyebrow={`Boletim de ${semester.id}`}
        title="Acompanhe seu desempenho"
        description="Consulte suas notas, situação acadêmica e professores de cada disciplina."
        action={
          <div className="flex flex-wrap items-end gap-3 print:hidden">
            <label className="text-xs font-semibold text-slate-700">
              Situação
              <select value={filter} onChange={e => setFilter(e.target.value as Filter)} className="field mt-1 block py-2 font-semibold">
                <option>Todas</option><option>Aprovado</option><option>Reprovado</option><option>Em andamento</option>
              </select>
            </label>
            <label className="text-xs font-semibold text-slate-700">
              Ordenar por
              <select value={sort} onChange={e => setSort(e.target.value as Sort)} className="field mt-1 block py-2 font-semibold">
                <option value="nome">Nome</option><option value="nota">Maior nota</option>
              </select>
            </label>
            <button type="button" onClick={() => window.print()} className="btn-secondary"><Printer className="h-4 w-4" aria-hidden="true" /> Imprimir</button>
          </div>
        }
      />

      <section aria-label="Médias do semestre" className="mb-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Média das aprovadas" value={fmtAvg(average(approved.map(c => c.grade)))} details={[`Considera ${plural(approved.length, 'disciplina', 'disciplinas')}`]} icon={TrendingUp} />
        <Metric label="Média parcial (todas)" value={fmtAvg(average(courses.map(c => c.grade)))} details={[`Considera ${plural(courses.length, 'disciplina', 'disciplinas')}`, ...(inProgress.length ? [`Inclui ${inProgress.length} em andamento`] : [])]} icon={BarChart3} tone="violet" />
        <Metric label="Maior nota" value={fmt1(best.grade)} details={[best.name]} icon={BarChart3} tone="emerald" />
        <Metric label="Disciplinas concluídas" value={`${done.length} de ${courses.length}`} icon={CheckCircle2} tone="amber" />
      </section>
      <p className="mb-6 text-sm text-slate-600">
        As médias são simples (soma das notas dividida pelo número de disciplinas). A média parcial muda conforme novas notas forem lançadas.
      </p>

      {rows.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Nenhuma disciplina nesta situação"
          description={`Não há disciplinas com situação "${filter}" em ${semester.id}.`}
          action={<button type="button" onClick={() => setFilter('Todas')} className="btn-secondary">Mostrar todas</button>}
        />
      ) : (
        <section className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Notas das disciplinas de {semester.id}</caption>
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700">
                <tr>
                  <th scope="col" className="px-5 py-3 sm:px-6">Disciplina</th>
                  <th scope="col" className="hidden px-3 py-3 md:table-cell">Professor</th>
                  <th scope="col" className="px-3 py-3">Situação</th>
                  <th scope="col" className="px-5 py-3 text-right sm:px-6">Nota</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map(c => (
                  <tr key={c.code}>
                    <th scope="row" className="px-5 py-4 font-normal sm:px-6">
                      <span className="block font-bold">{c.name}</span>
                      <span className="mt-0.5 block text-xs text-slate-600">{c.code}<span className="md:hidden"> • {c.professor}</span></span>
                    </th>
                    <td className="hidden px-3 py-4 text-slate-700 md:table-cell">{c.professor}</td>
                    <td className="px-3 py-4"><Badge tone={statusTone(c.status)}>{c.status}</Badge></td>
                    <td className="px-5 py-4 text-right sm:px-6">
                      <span className="text-xl font-bold">{fmt1(c.grade)}</span>
                      {c.status === 'Em andamento' && <span className="block text-xs text-slate-600">parcial</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}
