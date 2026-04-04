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

const DUMMY_GOALS = [
  { id: 'g1', name: 'Tesla Model 3', current: 15400, target: 45000, color: 'blue' },
  { id: 'g2', name: 'Summer Vacation', current: 2800, target: 5000, color: 'emerald' },
  { id: 'g3', name: 'Emergency Fund', current: 8500, target: 10000, color: 'purple' },
  { id: 'g4', name: 'New MacBook Pro', current: 400, target: 2400, color: 'rose' },
  { id: 'g5', name: 'Home Renovation', current: 12000, target: 35000, color: 'blue' },
  { id: 'g6', name: 'Retirement Fund', current: 50000, target: 1000000, color: 'emerald' },
  { id: 'g7', name: 'Wedding Plannig', current: 5000, target: 20000, color: 'purple' },
  { id: 'g8', name: 'World Tour', current: 1500, target: 15000, color: 'rose' },
  { id: 'g9', name: 'Crypto Investment', current: 2000, target: 10000, color: 'blue' },
  { id: 'g10', name: 'Charity Fund', current: 500, target: 2000, color: 'emerald' },
  { id: 'g11', name: 'New iPhone', current: 800, target: 1200, color: 'blue' },
  { id: 'g12', name: 'Gaming Rig', current: 1200, target: 3000, color: 'purple' },
  { id: 'g13', name: 'Ski Trip', current: 3000, target: 5000, color: 'rose' },
  { id: 'g14', name: 'Art Collection', current: 4500, target: 10000, color: 'emerald' },
  { id: 'g15', name: 'Luxury Watch', current: 12000, target: 25000, color: 'blue' },
  { id: 'g16', name: 'E-Bike', current: 1500, target: 2500, color: 'rose' },
  { id: 'g17', name: 'Garden Greenhouse', current: 2000, target: 4000, color: 'emerald' },
  { id: 'g18', name: 'Photography Gear', current: 3500, target: 7000, color: 'purple' },
  { id: 'g19', name: 'Down Payment', current: 45000, target: 150000, color: 'blue' },
  { id: 'g20', name: 'Business Startup', current: 10000, target: 50000, color: 'emerald' },
  { id: 'g21', name: 'Furniture Upgrade', current: 2500, target: 6000, color: 'purple' },
  { id: 'g22', name: 'Kitchen Gadgets', current: 500, target: 1500, color: 'rose' },
  { id: 'g23', name: 'Fitness Equipment', current: 1200, target: 3000, color: 'blue' },
  { id: 'g24', name: 'Reading Nook', current: 300, target: 1000, color: 'emerald' },
  { id: 'g25', name: 'Masters Degree', current: 15000, target: 40000, color: 'purple' },
  { id: 'g26', name: 'Tesla Powerwall', current: 2000, target: 12000, color: 'rose' },
  { id: 'g27', name: 'Custom Suit', current: 1000, target: 2500, color: 'blue' },
  { id: 'g28', name: 'Camping Gear', current: 800, target: 2000, color: 'emerald' },
  { id: 'g29', name: 'Smart Home Hub', current: 1500, target: 5000, color: 'purple' },
  { id: 'g30', name: 'Wine Cellar', current: 5000, target: 20000, color: 'rose' },
  { id: 'g31', name: 'Solar Panels', current: 8000, target: 15000, color: 'blue' },
  { id: 'g32', name: 'Project Car', current: 4000, target: 10000, color: 'emerald' },
  { id: 'g33', name: 'New Sofa', current: 1500, target: 2500, color: 'purple' },
  { id: 'g34', name: 'Drone', current: 600, target: 1200, color: 'rose' },
  { id: 'g35', name: 'Pool Table', current: 2500, target: 5000, color: 'blue' },
  { id: 'g36', name: 'Coffee Machine', current: 400, target: 1000, color: 'emerald' },
  { id: 'g37', name: 'Backyard Deck', current: 7000, target: 15000, color: 'purple' },
  { id: 'g38', name: 'Electric Guitar', current: 1200, target: 2500, color: 'rose' },
  { id: 'g39', name: 'Mountain Bike', current: 2000, target: 4500, color: 'blue' },
  { id: 'g40', name: 'Vinyl Records', current: 500, target: 1500, color: 'emerald' },
  { id: 'g41', name: 'Spa Days', current: 1000, target: 2000, color: 'purple' },
  { id: 'g42', name: 'Private Lessons', current: 1500, target: 4000, color: 'rose' },
  { id: 'g43', name: 'Workshop Tools', current: 3000, target: 8000, color: 'blue' },
  { id: 'g44', name: 'Aquarium Setup', current: 600, target: 1500, color: 'emerald' },
  { id: 'g45', name: 'Designer Bags', current: 4000, target: 10000, color: 'purple' },
  { id: 'g46', name: 'Home Theater', current: 5000, target: 15000, color: 'rose' },
  { id: 'g47', name: 'Classic Car Fund', current: 15000, target: 60000, color: 'blue' },
  { id: 'g48', name: 'Gaming Console', current: 300, target: 500, color: 'emerald' },
  { id: 'g49', name: 'Luxury Mattress', current: 2500, target: 5000, color: 'purple' },
  { id: 'g50', name: 'Designer Lighting', current: 1800, target: 4000, color: 'rose' },
  { id: 'g51', name: 'Telescope', current: 1200, target: 2500, color: 'blue' },
  { id: 'g52', name: 'Pizza Oven', current: 600, target: 1000, color: 'emerald' },
  { id: 'g53', name: 'Surveillance System', current: 2000, target: 4500, color: 'purple' },
  { id: 'g54', name: 'Electric Scooter', current: 800, target: 1500, color: 'rose' },
]

export function AppProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('fin_transactions')
    return saved ? JSON.parse(saved) : DUMMY_DATA
  })

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('fin_goals_v2')
    return saved ? JSON.parse(saved) : DUMMY_GOALS
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
    localStorage.setItem('fin_goals_v2', JSON.stringify(goals))
  }, [goals])

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

  const addGoal = useCallback(async (goal) => {
    const newGoal = {
      ...goal,
      id: `g${Date.now()}`,
      current: parseFloat(goal.current || 0),
      target: parseFloat(goal.target || 0),
    }
    setGoals((prev) => [newGoal, ...prev])
    return newGoal
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
    setGoals(DUMMY_GOALS)
    return true
  }, [])

  const value = useMemo(
    () => ({
      transactions,
      goals,
      role,
      setRole,
      filters,
      setFilters,
      darkMode,
      toggleDarkMode,
      addTransaction,
      addGoal,
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
      goals,
      role,
      filters,
      darkMode,
      loading,
      error,
      addTransaction,
      addGoal,
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

