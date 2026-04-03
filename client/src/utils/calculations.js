export const getTotalIncome = (transactions) =>
  transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)

export const getTotalExpenses = (transactions) =>
  transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

export const getBalance = (transactions) =>
  getTotalIncome(transactions) - getTotalExpenses(transactions)

export const getCategoryBreakdown = (transactions) => {
  const cats = {}

  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      cats[t.category] = (cats[t.category] || 0) + t.amount
    })

  return cats
}

export const getMonthlyData = (transactions) => {
  const now = new Date()
  const months = []

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = `${d.toLocaleString('en-IN', { month: 'short' })} '${String(d.getFullYear()).slice(2)}`
    const monthTxs = transactions.filter((t) => t.date.startsWith(key))
    const income = monthTxs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const expense = monthTxs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

    months.push({ label, income, expense, balance: income - expense })
  }

  return months
}

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const fmt = (n) => inrFormatter.format(Number(n) || 0)

export const formatSignedAmount = (amount, type) => `${type === 'income' ? '+' : '-'}${fmt(amount)}`

export const formatDate = (value, options = { day: 'numeric', month: 'short', year: 'numeric' }) =>
  new Date(value).toLocaleDateString('en-IN', options)

export const CATEGORY_COLORS = {
  Food: '#f59e0b',
  Travel: '#3b82f6',
  Shopping: '#8b5cf6',
  Salary: '#10b981',
  Investment: '#14b8a6',
  Utilities: '#6366f1',
  Health: '#ec4899',
  Entertainment: '#f97316',
}

export const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Salary', 'Investment', 'Utilities', 'Health', 'Entertainment']

export const initialTransactions = [
  { id: 1, desc: 'Monthly Salary', amount: 5500, date: '2025-06-01', category: 'Salary', type: 'income' },
  { id: 2, desc: 'Grocery Shopping', amount: 142, date: '2025-06-03', category: 'Food', type: 'expense' },
  { id: 3, desc: 'Netflix & Spotify', amount: 28, date: '2025-06-04', category: 'Entertainment', type: 'expense' },
  { id: 4, desc: 'Flight Booking', amount: 320, date: '2025-06-05', category: 'Travel', type: 'expense' },
  { id: 5, desc: 'Amazon Order', amount: 195, date: '2025-06-08', category: 'Shopping', type: 'expense' },
  { id: 6, desc: 'Freelance Payment', amount: 1200, date: '2025-06-10', category: 'Investment', type: 'income' },
  { id: 7, desc: 'Electricity Bill', amount: 85, date: '2025-06-11', category: 'Utilities', type: 'expense' },
  { id: 8, desc: 'Gym Membership', amount: 50, date: '2025-06-12', category: 'Health', type: 'expense' },
  { id: 9, desc: 'Restaurant Dinner', amount: 76, date: '2025-06-15', category: 'Food', type: 'expense' },
  { id: 10, desc: 'Stock Dividends', amount: 380, date: '2025-06-18', category: 'Investment', type: 'income' },
  { id: 11, desc: 'Monthly Salary', amount: 5500, date: '2025-05-01', category: 'Salary', type: 'income' },
  { id: 12, desc: 'Supermarket Run', amount: 210, date: '2025-05-05', category: 'Food', type: 'expense' },
  { id: 13, desc: 'Weekend Trip', amount: 450, date: '2025-05-10', category: 'Travel', type: 'expense' },
  { id: 14, desc: 'Clothing Haul', amount: 230, date: '2025-05-14', category: 'Shopping', type: 'expense' },
  { id: 15, desc: 'Water Bill', amount: 40, date: '2025-05-15', category: 'Utilities', type: 'expense' },
  { id: 16, desc: 'Monthly Salary', amount: 5500, date: '2025-04-01', category: 'Salary', type: 'income' },
  { id: 17, desc: 'Food Delivery', amount: 95, date: '2025-04-07', category: 'Food', type: 'expense' },
  { id: 18, desc: 'Doctor Checkup', amount: 120, date: '2025-04-10', category: 'Health', type: 'expense' },
  { id: 19, desc: 'Monthly Salary', amount: 5500, date: '2025-03-01', category: 'Salary', type: 'income' },
  { id: 20, desc: 'Weekly Groceries', amount: 170, date: '2025-03-06', category: 'Food', type: 'expense' },
]