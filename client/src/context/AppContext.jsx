import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const AppContext = createContext()

// --- Standalone Mode Configuration ---
// All backend connectivity is disabled to run purely as a frontend app on Vercel.
const DUMMY_DATA = [
  { id: '1', date: '2026-03-28', desc: 'Apple Store - iPhone 15 Case', amount: 59.99, category: 'Electronics', type: 'expense' },
  { id: '2', date: '2026-03-29', desc: 'Salary - Monthly', amount: 4500.00, category: 'Income', type: 'income' },
  { id: '3', date: '2026-03-30', desc: 'Whole Foods Market', amount: 124.50, category: 'Groceries', type: 'expense' },
  { id: '4', date: '2026-03-31', desc: 'Starbucks Coffee', amount: 6.75, category: 'Food & Drink', type: 'expense' },
  { id: '5', date: '2026-04-01', desc: 'Freelance Project Payment', amount: 850.00, category: 'Income', type: 'income' },
  { id: '6', date: '2026-04-01', desc: 'Netflix Subscription', amount: 15.99, category: 'Entertainment', type: 'expense' },
  { id: '7', date: '2026-04-02', desc: 'Shell Gas Station', amount: 45.00, category: 'Transport', type: 'expense' },
  { id: '8', date: '2026-04-02', desc: 'Gym Membership', amount: 50.00, category: 'Health', type: 'expense' },
  { id: '9', date: '2026-04-03', desc: 'Amazon - Books', amount: 32.40, category: 'Shopping', type: 'expense' },
  { id: '10', date: '2026-04-03', desc: 'Uber Ride', amount: 18.25, category: 'Transport', type: 'expense' },
  { id: '11', date: '2026-04-01', desc: 'Rent Payment', amount: 1200.00, category: 'Housing', type: 'expense' },
  { id: '12', date: '2026-03-25', desc: 'Stock Dividends', amount: 125.40, category: 'Investment', type: 'income' },
  { id: '13', date: '2026-03-20', desc: 'Electric Bill', amount: 85.00, category: 'Utilities', type: 'expense' },
  { id: '14', date: '2026-03-15', desc: 'Bonus', amount: 500.00, category: 'Income', type: 'income' },
  { id: '15', date: '2026-03-10', desc: 'Nike Shoes', amount: 110.00, category: 'Shopping', type: 'expense' },
  { id: '16', date: '2026-03-05', desc: 'Spotify', amount: 9.99, category: 'Entertainment', type: 'expense' },
  { id: '17', date: '2026-03-01', desc: 'Internet Bill', amount: 60.00, category: 'Utilities', type: 'expense' },
  { id: '18', date: '2026-02-28', desc: 'Target Checkout', amount: 42.15, category: 'Groceries', type: 'expense' },
  { id: '19', date: '2026-02-15', desc: 'Tax Refund', amount: 1200.00, category: 'Income', type: 'income' },
  { id: '20', date: '2026-02-10', desc: 'Movie Night', amount: 25.00, category: 'Entertainment', type: 'expense' },
]

export function AppProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('fin_transactions')
    return saved ? JSON.parse(saved) : DUMMY_DATA
  })

  const [role, setRole] = useState(() => {
    const saved = localStorage.getItem('fin_role')
    return saved || 'admin'
  })

  const [filters, setFilters] = useState({
    search: '',
    type: '',
    category: '',
    sort: 'date-desc',
  })

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('fin_darkMode')
    if (saved !== null) return JSON.parse(saved)
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('fin_transactions', JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem('fin_role', role)
  }, [role])

  useEffect(() => {
    localStorage.setItem('fin_darkMode', JSON.stringify(darkMode))
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode((prev) => !prev)

  // --- Local CRUD Operations (Bypass Backend) ---

  const loadTransactions = useCallback(async () => {
    // In standalone mode, transactions are loaded from state/localStorage
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  const addTransaction = useCallback(async (tx) => {
    const newTx = {
      ...tx,
      id: Date.now().toString(), // Generate fake ID
      amount: parseFloat(tx.amount),
    }
    setTransactions((prev) => [newTx, ...prev])
    return newTx
  }, [])

  const editTransaction = useCallback(async (id, updated) => {
    let updatedObj = null
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          updatedObj = { ...t, ...updated, amount: parseFloat(updated.amount || t.amount) }
          return updatedObj
        }
        return t
      })
    )
    return updatedObj || true
  }, [])

  const deleteTransaction = useCallback(async (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
    return true
  }, [])

  const seedTransactions = useCallback(async () => {
    // Re-seed with dummy data
    setTransactions(DUMMY_DATA)
    return true
  }, [])

  const value = useMemo(
    () => ({
      transactions,
      role,
      setRole,
      filters,
      setFilters,
      darkMode,
      toggleDarkMode,
      addTransaction,
      editTransaction,
      deleteTransaction,
      seedTransactions,
      loadTransactions,
      loading,
      error,
      apiBaseUrl: 'standalone-frontend',
    }),
    [
      transactions,
      role,
      filters,
      darkMode,
      loading,
      error,
      addTransaction,
      editTransaction,
      deleteTransaction,
      seedTransactions,
      loadTransactions,
    ]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  return useContext(AppContext)
}

