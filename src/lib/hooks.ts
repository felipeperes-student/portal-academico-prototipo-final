import { useCallback, useEffect, useState } from 'react'
import type { RefObject } from 'react'
import type { Page } from '../types'

export const PAGES: Page[] = ['dashboard', 'notas', 'disciplinas', 'matricula', 'perfil']

const readHash = (): Page => {
  const hash = window.location.hash.replace(/^#\/?/, '')
  return (PAGES as string[]).includes(hash) ? (hash as Page) : 'dashboard'
}

/**
 * Rota baseada em hash (#/notas). Cada página vira uma entrada no histórico,
 * então o botão Voltar do navegador (e Alt + ←) volta para a tela anterior.
 */
export function useRoute(): [Page, (next: Page) => void] {
  const [page, setPage] = useState<Page>(readHash)

  useEffect(() => {
    const onChange = () => setPage(readHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const navigate = useCallback((next: Page) => {
    if (next === readHash()) {
      window.scrollTo({ top: 0 })
      return
    }
    window.location.hash = `/${next}`
  }, [])

  return [page, navigate]
}

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* armazenamento cheio ou bloqueado: o app segue funcionando em memória */
    }
  }, [key, value])

  return [value, setValue] as const
}

/** Fecha menus ao clicar fora ou apertar Esc */
export function useDismiss(ref: RefObject<HTMLElement>, open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [ref, open, onClose])
}
