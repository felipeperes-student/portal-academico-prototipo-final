import { useEffect, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Camera, Mail, MapPin, Monitor, Phone, Settings, Trash2, User } from 'lucide-react'
import { Avatar, Modal, PageHeading } from '../components/ui'
import type { Icon } from '../components/ui'
import { STUDENT_RA } from '../data/academic'
import type { Profile, ToastKind } from '../types'

type Props = {
  profile: Profile
  onSave: (p: Profile) => void
  onToast: (message: string, kind?: ToastKind) => void
}

type Errors = Partial<Record<'name' | 'email' | 'phone' | 'city', string>>

const maskPhone = (value: string) => {
  const d = value.replace(/\D/g, '').slice(0, 11)
  if (d.length === 0) return ''
  if (d.length <= 2) return `(${d}`
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

const validate = (f: Profile): Errors => {
  const errors: Errors = {}
  if (f.name.trim().length < 3) errors.name = 'Informe seu nome completo.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) errors.email = 'Informe um e-mail válido, como nome@dominio.com.'
  const digits = f.phone.replace(/\D/g, '').length
  if (digits < 10) errors.phone = 'Informe o telefone com DDD, por exemplo (11) 99999-8888.'
  if (!f.city.trim()) errors.city = 'Informe sua cidade.'
  return errors
}

const MAX_PHOTO = 1024 * 1024

export function Perfil({ profile, onSave, onToast }: Props) {
  const [form, setForm] = useState<Profile>(profile)
  const [errors, setErrors] = useState<Errors>({})
  const [dialog, setDialog] = useState<'password' | 'sessions' | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const dirty = JSON.stringify(form) !== JSON.stringify(profile)

  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault() }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const update = (key: keyof Errors, value: string) => {
    setForm(f => ({ ...f, [key]: key === 'phone' ? maskPhone(value) : value }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }))
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length) {
      onToast('Corrija os campos destacados para salvar.', 'error')
      formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      return
    }
    onSave({ ...form, name: form.name.trim(), email: form.email.trim(), city: form.city.trim() })
    onToast('Perfil atualizado com sucesso.')
  }

  const pickPhoto = (file?: File) => {
    if (!file) return
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      onToast('Use uma imagem PNG, JPG ou WebP.', 'error')
      return
    }
    if (file.size > MAX_PHOTO) {
      onToast('A foto deve ter no máximo 1 MB.', 'error')
      return
    }
    const reader = new FileReader()
    reader.onload = () => setForm(f => ({ ...f, photo: String(reader.result) }))
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <PageHeading eyebrow="Conta acadêmica" title="Meu perfil" description="Mantenha seus dados de contato atualizados para receber comunicados importantes." />

      <form ref={formRef} onSubmit={submit} noValidate className="grid gap-6 xl:grid-cols-[300px_1fr]">
        <section className="card h-fit p-6 text-center" aria-label="Resumo do aluno">
          <Avatar profile={form} className="mx-auto h-24 w-24 text-2xl" />
          <h3 className="mt-4 font-bold">{form.name || 'Sem nome'}</h3>
          <p className="mt-1 text-xs text-slate-600">RA {STUDENT_RA}</p>
          <div className="mt-5 rounded-xl bg-slate-50 p-3 text-left text-xs">
            <p className="font-bold">Curso</p>
            <p className="mt-1 text-slate-600">{form.course}</p>
          </div>
          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" tabIndex={-1} aria-label="Escolher foto de perfil" onChange={e => { pickPhoto(e.target.files?.[0]); e.target.value = '' }} />
          <div className="mt-4 flex flex-col gap-2">
            <button type="button" onClick={() => fileRef.current?.click()} className="btn-secondary w-full"><Camera className="h-4 w-4" aria-hidden="true" /> Alterar foto</button>
            {form.photo && <button type="button" onClick={() => setForm(f => ({ ...f, photo: undefined }))} className="btn w-full text-rose-700 hover:bg-rose-50"><Trash2 className="h-4 w-4" aria-hidden="true" /> Remover foto</button>}
          </div>
          <p className="mt-2 text-xs text-slate-600">PNG, JPG ou WebP, até 1 MB.</p>
        </section>

        <section className="card p-5 sm:p-7" aria-labelledby="dados">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-700"><User className="h-5 w-5" /></span>
            <div>
              <h3 id="dados" className="font-bold">Dados pessoais</h3>
              <p className="text-xs text-slate-600">Todos os campos são obrigatórios.</p>
            </div>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field label="Nome completo" icon={User} value={form.name} error={errors.name} onChange={v => update('name', v)} autoComplete="name" />
            <Field label="E-mail" icon={Mail} value={form.email} error={errors.email} onChange={v => update('email', v)} type="email" autoComplete="email" />
            <Field label="Telefone" icon={Phone} value={form.phone} error={errors.phone} onChange={v => update('phone', v)} type="tel" autoComplete="tel" placeholder="(11) 99999-8888" />
            <Field label="Cidade" icon={MapPin} value={form.city} error={errors.city} onChange={v => update('city', v)} autoComplete="address-level2" />
          </div>
          <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">
            <p className="text-sm text-slate-600" role="status">{dirty ? 'Você tem alterações não salvas.' : 'Nenhuma alteração pendente.'}</p>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <button type="button" disabled={!dirty} onClick={() => { setForm(profile); setErrors({}) }} className="btn-secondary">Descartar alterações</button>
              <button type="submit" disabled={!dirty} className="btn-primary">Salvar alterações</button>
            </div>
          </div>
        </section>
      </form>

      <section className="card mt-6 p-5 sm:p-6" aria-labelledby="seguranca">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100"><Settings className="h-5 w-5" /></span>
          <div>
            <h3 id="seguranca" className="font-bold">Segurança</h3>
            <p className="text-xs text-slate-600">Gerencie as configurações de acesso.</p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={() => setDialog('password')} className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50/50">
            <p className="text-sm font-bold">Alterar senha</p>
            <p className="mt-1 text-xs text-slate-600">Atualize sua senha de acesso.</p>
          </button>
          <button type="button" onClick={() => setDialog('sessions')} className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50/50">
            <p className="text-sm font-bold">Sessões ativas</p>
            <p className="mt-1 text-xs text-slate-600">1 dispositivo conectado agora.</p>
          </button>
        </div>
      </section>

      {dialog === 'password' && <PasswordDialog onClose={() => setDialog(null)} onDone={() => { setDialog(null); onToast('Senha alterada com sucesso.') }} />}
      {dialog === 'sessions' && (
        <Modal title="Sessões ativas" onClose={() => setDialog(null)}>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
            <Monitor className="h-6 w-6 text-slate-600" aria-hidden="true" />
            <div>
              <p className="text-sm font-bold">Este dispositivo</p>
              <p className="text-xs text-slate-600">Navegador atual • ativo agora</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600">Não há outras sessões abertas na sua conta.</p>
          <div className="mt-6 flex justify-end"><button type="button" onClick={() => setDialog(null)} className="btn-secondary">Fechar</button></div>
        </Modal>
      )}
    </div>
  )
}

function Field({ label, icon: IconC, value, onChange, error, type = 'text', autoComplete, placeholder }: {
  label: string; icon: Icon; value: string; onChange: (v: string) => void; error?: string; type?: string; autoComplete?: string; placeholder?: string
}) {
  const errorId = `${label.replace(/\s/g, '-')}-erro`
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-800">{label}</span>
      <span className="relative block">
        <IconC className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
        <input type={type} value={value} onChange={e => onChange(e.target.value)} autoComplete={autoComplete} placeholder={placeholder} aria-invalid={error ? true : undefined} aria-describedby={error ? errorId : undefined} className="field pl-10" />
      </span>
      {error && <span id={errorId} className="mt-1.5 block text-xs font-medium text-rose-700">{error}</span>}
    </label>
  )
}

function PasswordDialog({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [v, setV] = useState({ current: '', next: '', confirm: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof typeof v, string>>>({})

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const found: typeof errors = {}
    if (!v.current) found.current = 'Informe sua senha atual.'
    if (v.next.length < 8 || !/[A-Za-z]/.test(v.next) || !/\d/.test(v.next)) found.next = 'Use ao menos 8 caracteres, com letras e números.'
    else if (v.next === v.current) found.next = 'A nova senha deve ser diferente da atual.'
    if (v.confirm !== v.next) found.confirm = 'As senhas não são iguais.'
    setErrors(found)
    if (!Object.keys(found).length) onDone()
  }

  const row = (key: keyof typeof v, label: string, autoComplete: string): ReactNode => (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-800">{label}</span>
      <input type="password" value={v[key]} autoComplete={autoComplete} onChange={e => setV(s => ({ ...s, [key]: e.target.value }))} aria-invalid={errors[key] ? true : undefined} aria-describedby={errors[key] ? `pw-${key}` : undefined} className="field" />
      {errors[key] && <span id={`pw-${key}`} className="mt-1.5 block text-xs font-medium text-rose-700">{errors[key]}</span>}
    </label>
  )

  return (
    <Modal title="Alterar senha" onClose={onClose}>
      <form onSubmit={submit} noValidate className="space-y-4">
        {row('current', 'Senha atual', 'current-password')}
        {row('next', 'Nova senha', 'new-password')}
        {row('confirm', 'Confirmar nova senha', 'new-password')}
        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
          <button type="submit" className="btn-primary">Salvar nova senha</button>
        </div>
      </form>
    </Modal>
  )
}
