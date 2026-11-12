export type Page = 'dashboard' | 'notas' | 'disciplinas' | 'matricula' | 'perfil'

export type CourseStatus = 'Aprovado' | 'Reprovado' | 'Em andamento'

export type Course = {
  code: string
  name: string
  professor: string
  schedule: string
  room: string
  credits: number
  grade: number
  status: CourseStatus
  progress: number
  attendance: number
}

export type Pendency = {
  id: string
  title: string
  due: string
  page: Page
  /** Some da lista quando a matrícula é confirmada */
  resolvedBy?: 'matricula'
}

export type CalendarEvent = {
  date: string
  title: string
  meta: string
  urgent?: boolean
}

export type Semester = {
  id: string
  current: boolean
  courses: Course[]
  events: CalendarEvent[]
  pendencies: Pendency[]
}

export type AvailableSubject = {
  code: string
  name: string
  professor: string
  schedule: string
  credits: number
  vacancies: number
}

export type Profile = {
  name: string
  email: string
  phone: string
  city: string
  course: string
  photo?: string
}

export type Notice = {
  id: string
  title: string
  body: string
  page: Page
  tone: 'amber' | 'green'
  read: boolean
}

export type MatriculaState = {
  selected: string[]
  confirmed: string[] | null
}

export type ToastKind = 'success' | 'error' | 'info'
