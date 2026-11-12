import type { AvailableSubject, Notice, Profile, Semester } from '../types'

/** Nota mínima para aprovação */
export const PASS_GRADE = 6
export const MIN_ATTENDANCE = 75
export const MAX_CREDITS = 32

/** Fim do período de matrícula do semestre atual */
export const MATRICULA_DEADLINE = '2026-09-05'

/**
 * Data de referência da demonstração. Os dados são fictícios e ficam em setembro de 2026.
 * Ao conectar a um backend, troque por: new Date().toISOString().slice(0, 10)
 */
export const TODAY = '2026-08-29'

export const semesters: Semester[] = [
  {
    id: '2026.2',
    current: true,
    courses: [
      { name: 'Desenvolvimento Web', code: 'WEB301', professor: 'Marina Costa', schedule: 'Seg • 19:00 – 21:00', room: 'Lab 03', credits: 4, grade: 9.4, status: 'Aprovado', progress: 82, attendance: 96 },
      { name: 'Banco de Dados', code: 'BD204', professor: 'Rafael Mendes', schedule: 'Ter • 19:00 – 21:00', room: 'Sala 12', credits: 4, grade: 8.7, status: 'Aprovado', progress: 76, attendance: 92 },
      { name: 'Engenharia de Software', code: 'ENG210', professor: 'Carla Nunes', schedule: 'Qua • 19:00 – 21:00', room: 'Sala 08', credits: 4, grade: 8.2, status: 'Aprovado', progress: 70, attendance: 95 },
      { name: 'UX e Design de Interfaces', code: 'UX110', professor: 'Lucas Alves', schedule: 'Qui • 19:00 – 21:00', room: 'Lab 01', credits: 3, grade: 9.1, status: 'Aprovado', progress: 91, attendance: 97 },
      { name: 'Estruturas de Dados', code: 'ED202', professor: 'João Prado', schedule: 'Sex • 19:00 – 21:00', room: 'Lab 02', credits: 4, grade: 7.6, status: 'Em andamento', progress: 61, attendance: 91 },
      { name: 'Arquitetura de Computadores', code: 'AC101', professor: 'Ana Lima', schedule: 'Sex • 21:00 – 23:00', room: 'Lab 04', credits: 5, grade: 8.0, status: 'Em andamento', progress: 58, attendance: 93 },
    ],
    events: [
      { date: '2026-09-02', title: 'Entrega do projeto Web', meta: 'Desenvolvimento Web' },
      { date: MATRICULA_DEADLINE, title: 'Fim do período de matrícula', meta: 'Secretaria acadêmica', urgent: true },
      { date: '2026-09-12', title: 'Avaliação parcial', meta: 'Estruturas de Dados' },
    ],
    pendencies: [
      { id: 'p-web', title: 'Entregar o projeto de Desenvolvimento Web', due: '2026-09-02', page: 'disciplinas' },
      { id: 'p-mat', title: 'Concluir a matrícula', due: MATRICULA_DEADLINE, page: 'matricula', resolvedBy: 'matricula' },
    ],
  },
  {
    id: '2026.1',
    current: false,
    courses: [
      { name: 'Algoritmos e Programação', code: 'ALG101', professor: 'Paulo Teixeira', schedule: 'Seg • 19:00 – 21:00', room: 'Lab 02', credits: 4, grade: 8.4, status: 'Aprovado', progress: 100, attendance: 97 },
      { name: 'Redes de Computadores', code: 'RED205', professor: 'Helena Souza', schedule: 'Ter • 19:00 – 21:00', room: 'Sala 05', credits: 4, grade: 7.8, status: 'Aprovado', progress: 100, attendance: 90 },
      { name: 'Matemática Discreta', code: 'MAT120', professor: 'Otávio Lima', schedule: 'Qua • 19:00 – 21:00', room: 'Sala 09', credits: 4, grade: 7.2, status: 'Aprovado', progress: 100, attendance: 88 },
      { name: 'Sistemas Operacionais', code: 'SO215', professor: 'Renata Faria', schedule: 'Qui • 19:00 – 21:00', room: 'Lab 01', credits: 4, grade: 8.0, status: 'Aprovado', progress: 100, attendance: 94 },
      { name: 'Inglês Técnico', code: 'ING101', professor: 'Camila Prado', schedule: 'Sex • 19:00 – 21:00', room: 'Sala 03', credits: 2, grade: 9.0, status: 'Aprovado', progress: 100, attendance: 98 },
    ],
    events: [],
    pendencies: [],
  },
  {
    id: '2025.2',
    current: false,
    courses: [
      { name: 'Introdução à Computação', code: 'INT100', professor: 'Sérgio Barros', schedule: 'Seg • 19:00 – 21:00', room: 'Sala 01', credits: 4, grade: 8.8, status: 'Aprovado', progress: 100, attendance: 96 },
      { name: 'Cálculo I', code: 'CAL101', professor: 'Beatriz Moraes', schedule: 'Ter • 19:00 – 21:00', room: 'Sala 10', credits: 4, grade: 5.4, status: 'Reprovado', progress: 100, attendance: 81 },
      { name: 'Lógica de Programação', code: 'LOG102', professor: 'Henrique Alves', schedule: 'Qua • 19:00 – 21:00', room: 'Lab 03', credits: 4, grade: 7.9, status: 'Aprovado', progress: 100, attendance: 92 },
      { name: 'Comunicação e Expressão', code: 'COM100', professor: 'Lívia Torres', schedule: 'Qui • 19:00 – 21:00', room: 'Sala 04', credits: 2, grade: 8.2, status: 'Aprovado', progress: 100, attendance: 95 },
    ],
    events: [],
    pendencies: [],
  },
]

export const currentSemester = semesters[0]

export const availableSubjects: AvailableSubject[] = [
  { name: 'Computação em Nuvem', code: 'CLD310', professor: 'Fernanda Reis', schedule: 'Seg • 21:00 – 23:00', credits: 4, vacancies: 12 },
  { name: 'Segurança da Informação', code: 'SEC320', professor: 'Bruno Dias', schedule: 'Ter • 21:00 – 23:00', credits: 4, vacancies: 7 },
  { name: 'Mobile Development', code: 'MOB305', professor: 'Diego Ramos', schedule: 'Qua • 21:00 – 23:00', credits: 4, vacancies: 15 },
  { name: 'Inteligência Artificial', code: 'IA401', professor: 'Patrícia Melo', schedule: 'Qui • 21:00 – 23:00', credits: 5, vacancies: 4 },
]

export const initialNotices: Notice[] = [
  { id: 'n-matricula', title: 'Matrícula aberta', body: 'Período 2026.2 disponível até 05/09/2026.', page: 'matricula', tone: 'amber', read: false },
  { id: 'n-nota', title: 'Nota atualizada', body: 'Estruturas de Dados recebeu uma nova nota.', page: 'notas', tone: 'green', read: false },
]

export const initialProfile: Profile = {
  name: 'João Silva',
  email: 'joao.silva@email.com',
  phone: '(11) 99999-8888',
  city: 'São Paulo',
  course: 'Sistemas de Informação',
}

export const STUDENT_RA = '20261234'
