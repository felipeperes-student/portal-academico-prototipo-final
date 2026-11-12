import type { Page } from '../types'
import { navItems } from './Sidebar'

export function MobileNav({ page, onNavigate }: { page: Page; onNavigate: (p: Page) => void }) {
  return (
    <nav aria-label="Navegação rápida" className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white px-1 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 lg:hidden print:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {navItems.map(({ id, label, icon: IconC }) => (
          <button
            key={id}
            type="button"
            onClick={() => onNavigate(id)}
            aria-current={page === id ? 'page' : undefined}
            className={`flex min-w-14 flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-xs font-semibold transition ${page === id ? 'text-indigo-700' : 'text-slate-600'}`}
          >
            <IconC className="h-5 w-5" />
            {label === 'Meu perfil' ? 'Perfil' : label}
          </button>
        ))}
      </div>
    </nav>
  )
}
