import { useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { Check, ClipboardCheck, Lock } from 'lucide-react'
import { DeadlineBanner } from '../components/DeadlineBanner'
import { Badge, EmptyState, Modal, PageHeading, ProgressBar } from '../components/ui'
import { MATRICULA_DEADLINE, MAX_CREDITS, availableSubjects } from '../data/academic'
import { formatFullDate, matriculaInfo, plural } from '../lib/format'
import type { MatriculaState, Semester, ToastKind } from '../types'

type Props = {
  semester: Semester
  state: MatriculaState
  setState: Dispatch<SetStateAction<MatriculaState>>
  onToast: (message: string, kind?: ToastKind) => void
  onGoCurrent: () => void
}

export function Matricula({ semester, state, setState, onToast, onGoCurrent }: Props) {
  const [reviewing, setReviewing] = useState(false)
  const { closed } = matriculaInfo()

  if (!semester.current) {
    return (
      <div>
        <PageHeading eyebrow={`Semestre ${semester.id}`} title="Matrícula" description="A matrícula só pode ser feita no semestre atual." />
        <EmptyState
          icon={Lock}
          title={`${semester.id} é um semestre encerrado`}
          description="Volte para o semestre atual para ver as disciplinas disponíveis e o prazo."
          action={<button type="button" onClick={onGoCurrent} className="btn-primary">Ir para o semestre atual</button>}
        />
      </div>
    )
  }

  const baseCredits = semester.courses.reduce((s, c) => s + c.credits, 0)
  const valid = state.selected.filter(code => availableSubjects.some(s => s.code === code))
  const chosen = availableSubjects.filter(s => valid.includes(s.code))
  const credits = chosen.reduce((sum, s) => sum + s.credits, baseCredits)
  const confirmed = state.confirmed !== null
  const changed = !confirmed || [...valid].sort().join() !== [...(state.confirmed ?? [])].sort().join()
  const locked = closed

  const toggle = (code: string) => {
    if (locked) return
    const subject = availableSubjects.find(s => s.code === code)
    if (!subject) return
    if (!valid.includes(code) && credits + subject.credits > MAX_CREDITS) {
      onToast(`Limite de ${MAX_CREDITS} créditos por semestre. Remova uma disciplina para adicionar ${subject.name}.`, 'error')
      return
    }
    setState(s => ({ ...s, selected: valid.includes(code) ? valid.filter(x => x !== code) : [...valid, code] }))
  }

  const confirm = () => {
    setState({ selected: valid, confirmed: valid })
    setReviewing(false)
    onToast(`Matrícula confirmada. Você pode alterar até ${formatFullDate(MATRICULA_DEADLINE).split(', ')[1]}.`)
  }

  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow={`Período ${semester.id}`}
        title="Monte sua grade"
        description="Escolha as disciplinas extras. Antes de confirmar, você revisa tudo."
      />
      <DeadlineBanner confirmed={confirmed} />

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <fieldset disabled={locked} className="min-w-0">
          <legend className="sr-only">Disciplinas disponíveis</legend>
          <ul className="space-y-3">
            {availableSubjects.map(s => {
              const on = valid.includes(s.code)
              return (
                <li key={s.code}>
                  <label className={`card flex cursor-pointer items-center gap-4 p-4 transition sm:p-5 ${on ? 'border-indigo-600 ring-2 ring-indigo-100' : 'hover:border-slate-300'} ${locked ? 'cursor-not-allowed opacity-60' : ''}`}>
                    <input type="checkbox" checked={on} onChange={() => toggle(s.code)} className="peer sr-only" />
                    <span aria-hidden="true" className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg border-2 transition peer-focus-visible:ring-4 peer-focus-visible:ring-indigo-200 ${on ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-400'}`}>
                      {on && <Check className="h-4 w-4" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-bold">{s.name}</span>
                      <span className="mt-1 block text-xs text-slate-600">{s.code} • {s.professor} • {s.schedule} • {s.credits} créditos</span>
                    </span>
                    <Badge tone={s.vacancies <= 5 ? 'amber' : 'slate'}>{s.vacancies <= 5 ? `Só ${s.vacancies} vagas` : `${s.vacancies} vagas`}</Badge>
                  </label>
                </li>
              )
            })}
          </ul>
        </fieldset>

        <aside className="card h-fit p-5 xl:sticky xl:top-24" aria-labelledby="resumo-mat">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-700"><ClipboardCheck className="h-5 w-5" /></span>
            <div>
              <h3 id="resumo-mat" className="font-bold">Resumo</h3>
              <p className="text-xs text-slate-600">Sua seleção atual</p>
            </div>
          </div>
          <dl className="my-5 space-y-3 border-y border-slate-100 py-5 text-sm">
            <div className="flex justify-between"><dt className="text-slate-600">Disciplinas atuais</dt><dd className="font-bold">{semester.courses.length}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-600">Novas disciplinas</dt><dd className="font-bold">{valid.length}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-600">Total de créditos</dt><dd className="font-bold">{credits} de {MAX_CREDITS}</dd></div>
          </dl>
          <ProgressBar value={credits} max={MAX_CREDITS} label="Créditos usados" />

          {chosen.length > 0 && (
            <ul className="mt-4 space-y-2">
              {chosen.map(s => (
                <li key={s.code} className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs">
                  <span className="truncate font-semibold">{s.name}</span>
                  <button type="button" disabled={locked} onClick={() => toggle(s.code)} className="shrink-0 rounded-md px-2 py-1 font-semibold text-rose-700 hover:bg-rose-50">Remover</button>
                </li>
              ))}
            </ul>
          )}

          <button type="button" disabled={locked || valid.length === 0 || !changed} onClick={() => setReviewing(true)} className="btn-primary mt-5 w-full">
            {confirmed ? 'Atualizar matrícula' : 'Revisar matrícula'}
          </button>
          <p className="mt-3 text-center text-xs leading-5 text-slate-600" role="status">
            {locked ? 'O prazo terminou. Não é mais possível alterar.' : valid.length === 0 ? 'Selecione ao menos uma disciplina.' : !changed ? 'Nada mudou desde a última confirmação.' : 'Você poderá conferir tudo antes de confirmar.'}
          </p>
        </aside>
      </div>

      {reviewing && (
        <Modal title="Revise sua matrícula" onClose={() => setReviewing(false)}>
          <p className="text-sm text-slate-600">Você vai se matricular em {plural(chosen.length, 'nova disciplina', 'novas disciplinas')}, além das {semester.courses.length} atuais.</p>
          <ul className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200">
            {chosen.map(s => (
              <li key={s.code} className="p-3 text-sm">
                <p className="font-bold">{s.name}</p>
                <p className="mt-0.5 text-xs text-slate-600">{s.professor} • {s.schedule} • {s.credits} créditos</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm"><b>Total: {credits} créditos</b> (limite de {MAX_CREDITS}).</p>
          <p className="mt-1 text-sm text-slate-600">Você pode alterar sua escolha até {formatFullDate(MATRICULA_DEADLINE)}.</p>
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => setReviewing(false)} className="btn-secondary">Voltar e editar</button>
            <button type="button" onClick={confirm} className="btn-primary">Confirmar matrícula</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
