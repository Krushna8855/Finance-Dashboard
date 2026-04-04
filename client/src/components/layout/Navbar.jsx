import { useApp } from '../../context/AppContext'

export default function Navbar({ activePage, sidebarOpen, setSidebarOpen, onOpenPalette }) {
  const { role, darkMode, toggleDarkMode } = useApp()

  const titles = {
    dashboard: 'Dashboard',
    transactions: 'Transactions',
    insights: 'Insights',
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 shadow-sm shadow-slate-200/40 backdrop-blur-xl transition-colors duration-300 dark:border-white/10 dark:bg-slate-900/75 dark:shadow-black/10">
      <div className="relative mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-700"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={sidebarOpen}
            aria-controls="app-sidebar"
          >
            {sidebarOpen ? (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 6l12 12M6 18 18 6" />
              </svg>
            ) : (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-600 dark:text-blue-400 leading-none">
              FinanceIQ Workspace
            </p>
            <div className="flex min-w-0 items-center gap-2 mt-0.5">
              <h1 className="truncate text-base font-bold text-slate-900 sm:text-lg dark:text-white">
                {titles[activePage] ?? 'Dashboard'}
              </h1>
              <span className="hidden text-sm text-slate-400 sm:inline dark:text-slate-500">/</span>
              <span className="hidden truncate text-sm font-medium text-slate-500 sm:inline dark:text-slate-400">
                Intel Pro Control
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4 md:gap-6">
          <button
            onClick={onOpenPalette}
            className="hidden h-10 w-48 items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400 transition hover:bg-slate-100 md:flex dark:border-white/5 dark:bg-slate-950/40 dark:hover:bg-slate-900"
          >
            <div className="flex items-center gap-2">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="7" cy="7" r="5" />
                <path d="M11 11l4 4" />
              </svg>
              <span>Quick search...</span>
            </div>
            <kbd className="flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-black uppercase text-slate-400 border border-slate-200 dark:border-white/10 dark:bg-slate-800">
              <span className="text-[8px]">ctrl</span>k
            </kbd>
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
             <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 md:flex dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              Live
            </div>

            <button
              type="button"
              onClick={toggleDarkMode}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-lg transition hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
              aria-label="Toggle dark mode"
            >
              {darkMode ? '🌙' : '☀️'}
            </button>

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-650 text-sm font-black text-white shadow-lg shadow-blue-500/20 transition hover:scale-105 active:scale-95"
              aria-label="User profile"
            >
              K
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
