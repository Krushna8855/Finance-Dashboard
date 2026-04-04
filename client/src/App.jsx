import { Suspense, lazy, useEffect, useState } from 'react'
import { AppProvider } from './context/AppContext'
import Sidebar from './components/layout/Sidebar'
import Navbar from './components/layout/Navbar'
import Loader from './components/common/Loader'
import CommandPalette from './components/common/CommandPalette'

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
  const [paletteOpen, setPaletteOpen] = useState(false)

  useEffect(() => {
    const handleEscape = (event) => {
      if (document.activeElement.tagName === 'INPUT') return
      
      if (event.key === 'Escape') {
        setSidebarOpen(false)
        setPaletteOpen(false)
      }
    }

    const handleShortcut = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setPaletteOpen(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleEscape)
    window.addEventListener('keydown', handleShortcut)
    return () => {
      window.removeEventListener('keydown', handleEscape)
      window.removeEventListener('keydown', handleShortcut)
    }
  }, [])

  const handleNavigate = (page, toggleOnly = false) => {
    if (toggleOnly) {
      setPaletteOpen(p => !p)
      return
    }
    setActivePage(page)
    setPaletteOpen(false)
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
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
            onOpenPalette={() => setPaletteOpen(true)}
          />

          <main className="flex-1 px-4 pb-6 pt-4 sm:px-6 sm:pb-8 lg:px-8 lg:pt-6">
            <Suspense fallback={<Loader />}>
              <div className="mx-auto w-full max-w-[1600px] animate-fade-in-up">
                {pages[activePage]}
              </div>
            </Suspense>
          </main>
        </div>

        <CommandPalette 
          isOpen={paletteOpen} 
          onClose={() => setPaletteOpen(false)} 
          onNavigate={(p) => handleNavigate(p)} 
        />
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
