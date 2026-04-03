import { useApp } from '../../context/AppContext'

const navItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Overview & analytics',
    icon: (
      <svg width="20" height="20" fill="none">
        <rect x="3" y="3" width="14" height="14" rx="4" stroke="currentColor" strokeWidth="2" />
        <rect x="6.5" y="6.5" width="3" height="3" rx="1" fill="currentColor" />
        <rect x="6.5" y="11.5" width="3" height="2" rx="1" fill="currentColor" />
        <rect x="11.5" y="6.5" width="2" height="7" rx="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'transactions',
    label: 'Transactions',
    description: 'Income and expenses',
    icon: (
      <svg width="20" height="20" fill="none">
        <rect x="2.5" y="4.5" width="15" height="11" rx="3" stroke="currentColor" strokeWidth="2" />
        <path d="M6 9.5h8M6 13h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'insights',
    label: 'Insights',
    description: 'Smart trends',
    icon: (
      <svg width="20" height="20" fill="none">
        <path d="M4 15.5V8m4 7.5V4m4 11.5V9m4 6.5V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
]

export default function Sidebar({ activePage, setActivePage, sidebarOpen, setSidebarOpen }) {
  const { role, setRole, darkMode, toggleDarkMode } = useApp()

  const handleNavigate = (page) => {
    setActivePage(page)
    setSidebarOpen(false)
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm transition duration-300 ${
          sidebarOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <aside
        id="app-sidebar"
        aria-label="Sidebar"
        aria-hidden={!sidebarOpen}
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200/80 bg-white/95 shadow-2xl shadow-slate-900/10 backdrop-blur-xl transition-transform duration-300 dark:border-white/10 dark:bg-slate-900/95 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200/70 px-5 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-lg font-bold text-white shadow-lg shadow-blue-500/25">
              F
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">FinanceIQ</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Responsive Pro Dashboard</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            aria-label="Close menu"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 6l12 12M6 18 18 6" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto px-4 py-5">
          <div className="mb-6 rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 p-4 text-white shadow-lg shadow-blue-500/20">
            <p className="text-xs uppercase tracking-[0.22em] text-blue-100">Performance</p>
            <h2 className="mt-2 text-lg font-semibold">Financial Command Center</h2>
            <p className="mt-1 text-sm text-blue-100/90">
              Track balances, monitor transactions, and review insights in one streamlined workspace.
            </p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const active = activePage === item.id

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigate(item.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all duration-200 ${
                    active
                      ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10 dark:bg-white dark:text-slate-900'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                  }`}
                >
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                      active
                        ? 'bg-white/10 text-white dark:bg-slate-200 dark:text-slate-900'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {item.icon}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{item.label}</span>
                    <span className={`block text-xs ${active ? 'text-slate-200 dark:text-slate-600' : 'text-slate-400 dark:text-slate-500'}`}>
                      {item.description}
                    </span>
                  </span>
                </button>
              )
            })}
          </nav>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Appearance</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Switch between light and dark mode</p>
              </div>

              <button
                type="button"
                onClick={toggleDarkMode}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  darkMode ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
                aria-label="Toggle theme"
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                    darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/60">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Access level</p>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>

            <div
              className={`mt-3 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
                role === 'admin'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300'
              }`}
            >
              {role === 'admin' ? 'Full control enabled' : 'Read-only viewer active'}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
