import { Suspense, lazy, useEffect, useState } from 'react'
import { AppProvider } from './context/AppContext'
import Sidebar from './components/layout/Sidebar'
import Navbar from './components/layout/Navbar'
import Loader from './components/common/Loader'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Transactions = lazy(() => import('./pages/Transactions'))
const Insights = lazy(() => import('./pages/Insights'))

const pages = {
  dashboard: <Dashboard />,
  transactions: <Transactions />,
  insights: <Insights />,
}

function AppShell() {
  const [activePage, setActivePage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_28%),radial-gradient(circle_at_right,_rgba(168,85,247,0.16),_transparent_24%)] text-slate-900 transition-colors duration-300 dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-slate-50/90 dark:bg-slate-950/70" />

      <div className="relative flex min-h-screen w-full">
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <Navbar
            activePage={activePage}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          <main className="flex-1 px-4 pb-6 pt-4 sm:px-6 sm:pb-8 lg:px-8 lg:pt-6">
            <Suspense fallback={<Loader />}>
              <div className="w-full">
                {pages[activePage]}
              </div>
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}
