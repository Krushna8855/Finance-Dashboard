import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getAuthToken } from '../firebase'

const AppContext = createContext()

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

if (import.meta.env.PROD && !API_BASE_URL) {
  console.warn('VITE_API_BASE_URL is not defined. API requests will likely fail unless proxied.')
}

export function AppProvider({ children }) {
  const [transactions, setTransactions] = useState([])
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

    if (saved !== null) {
      return JSON.parse(saved)
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    localStorage.setItem('fin_role', role)
  }, [role])

  useEffect(() => {
    localStorage.setItem('fin_darkMode', JSON.stringify(darkMode))
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const parseResponse = async (response) => {
    const data = await response.json().catch(() => null)

    if (!response.ok || !data?.success) {
      throw new Error(data?.message || `Request failed with status ${response.status}.`)
    }

    return data
  }

  const apiRequest = useCallback(async (path, options = {}) => {
    const token = await getAuthToken()
    const headers = {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const sendRequest = async (includeAuthHeader) => {
      const requestHeaders = { ...headers }

      if (!includeAuthHeader) {
        delete requestHeaders.Authorization
      }

      const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`

      return fetch(url, {
        ...options,
        headers: requestHeaders,
        credentials: 'include', // Important for CORS with credentials: true
      })
    }

    let response
    try {
      response = await sendRequest(Boolean(token))
    } catch (err) {
      console.error('Network error:', err)
      throw new Error('Network error. Please check if the backend is running and CORS is configured.')
    }

    const shouldRetryWithoutAuth =
      token &&
      response.status === 401 &&
      !import.meta.env.VITE_API_TOKEN &&
      !import.meta.env.VITE_FIREBASE_API_KEY

    if (shouldRetryWithoutAuth) {
      response = await sendRequest(false)
    }

    return parseResponse(response)
  }, [])

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const data = await apiRequest('/transactions')
      setTransactions(data.data || [])
    } catch (err) {
      console.error('Load transactions failed:', err)
      setTransactions([])
      setError(err.message || 'Could not load transactions from server.')
    } finally {
      setLoading(false)
    }
  }, [apiRequest])

  useEffect(() => {
    loadTransactions()
  }, [loadTransactions])

  const toggleDarkMode = () => setDarkMode((prev) => !prev)

  const addTransaction = useCallback(async (tx) => {
    try {
      setError('')

      const data = await apiRequest('/transactions', {
        method: 'POST',
        body: JSON.stringify(tx),
      })

      setTransactions((prev) => [data.data, ...prev])
      return data.data
    } catch (err) {
      console.error('Add transaction failed:', err)
      setError(err.message || 'Could not add transaction.')
      return null
    }
  }, [apiRequest])

  const editTransaction = useCallback(async (id, updated) => {
    try {
      setError('')

      const data = await apiRequest(`/transactions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updated),
      })

      setTransactions((prev) =>
        prev.map((transaction) => (transaction.id === id ? data.data : transaction))
      )

      return data.data
    } catch (err) {
      console.error('Update transaction failed:', err)
      setError(err.message || 'Could not update transaction.')
      return null
    }
  }, [apiRequest])

  const deleteTransaction = useCallback(async (id) => {
    try {
      setError('')

      await apiRequest(`/transactions/${id}`, {
        method: 'DELETE',
      })

      setTransactions((prev) => prev.filter((transaction) => transaction.id !== id))
      return true
    } catch (err) {
      console.error('Delete transaction failed:', err)
      setError(err.message || 'Could not delete transaction.')
      return false
    }
  }, [apiRequest])

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
      loadTransactions,
      loading,
      error,
      apiBaseUrl: API_BASE_URL,
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
      loadTransactions,
    ]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  return useContext(AppContext)
}
