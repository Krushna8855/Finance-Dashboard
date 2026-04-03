import { useApp } from '../../context/AppContext'

export default function Navbar({ activePage, sidebarOpen, setSidebarOpen }) {
  const { role, darkMode, toggleDarkMode } = useApp()

  const titles = {
    dashboard: 'Dashboard',
    transactions: 'Transactions',
    insights: 'Insights',
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 shadow-sm shadow-slate-200/40 backdrop-blur-xl transition-colors duration-300 dark:border-white/10 dark:bg-slate-900/75 dark:shadow-black/10">
      <div className="relative mx-auto flex h-16 w-full max-w-none items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
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
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-600 dark:text-blue-400">
              FinanceIQ Workspace
            </p>
            <div className="flex min-w-0 items-center gap-2">
              <h1 className="truncate text-base font-bold text-slate-900 sm:text-lg dark:text-white">
                {titles[activePage] ?? 'Dashboard'}
              </h1>
              <span className="hidden text-sm text-slate-400 sm:inline dark:text-slate-500">/</span>
              <span className="hidden truncate text-sm text-slate-500 sm:inline dark:text-slate-400">
                Professional finance control center
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 md:flex dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Live sync
          </div>

          <div
            className={`hidden rounded-full border px-3 py-1.5 text-xs font-semibold sm:inline-flex ${
              role === 'admin'
                ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300'
                : 'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {role === 'admin' ? 'Admin Access' : 'Viewer Mode'}
          </div>

          <button
            type="button"
            onClick={toggleDarkMode}
            className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-700"
            aria-label="Toggle dark mode"
          >
            <span className="text-base">{darkMode ? '🌙' : '☀️'}</span>
            <span className="hidden sm:inline">{darkMode ? 'Dark' : 'Light'}</span>
          </button>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:scale-105"
            aria-label="User profile"
          >
            U
          </button>
        </div>
      </div>
    </header>
  )
}
