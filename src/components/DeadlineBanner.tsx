import { CheckCircle2, Clock3, AlertCircle } from 'lucide-react'
import type { ReactNode } from 'react'
import { MATRICULA_DEADLINE } from '../data/academic'
import { formatFullDate, matriculaInfo, plural } from '../lib/format'

/**
 * O prazo da matrícula fica sempre visível (dashboard, página de matrícula e menu lateral),
 * independente de a notificação ter sido lida ou não.
 */
export function DeadlineBanner({ confirmed, action }: { confirmed: boolean; action?: ReactNode }) {
  const { days, closed, urgent } = matriculaInfo()
  const date = formatFullDate(MATRICULA_DEADLINE)

  let tone = 'border-amber-200 bg-amber-50 text-amber-950'
  let IconC = Clock3
  let title = `Prazo final da matrícula: ${date}`
  let text = days === 0 ? 'O prazo termina hoje.' : `Faltam ${plural(days, 'dia', 'dias')} para o fim do prazo.`

  if (confirmed) {
    tone = 'border-emerald-200 bg-emerald-50 text-emerald-950'
    IconC = CheckCircle2
    title = 'Matrícula confirmada'
    text = closed ? 'O prazo de alteração já terminou.' : `Você ainda pode alterar sua escolha até ${date}.`
  } else if (closed) {
    tone = 'border-rose-200 bg-rose-50 text-rose-950'
    IconC = AlertCircle
    title = 'Prazo da matrícula encerrado'
    text = `O período terminou em ${date}. Procure a secretaria acadêmica.`
  } else if (urgent) {
    tone = 'border-rose-200 bg-rose-50 text-rose-950'
    IconC = AlertCircle
  }

  return (
    <section aria-label="Prazo da matrícula" className={`flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 ${tone}`}>
      <div className="flex gap-3">
        <IconC className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <div>
          <p className="font-bold">{title}</p>
          <p className="mt-0.5 text-sm">{text}</p>
        </div>
      </div>
      {action}
    </section>
  )
}
