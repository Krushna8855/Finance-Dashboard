import { useMemo, useState } from 'react'
import TransactionTable from '../components/transactions/TransactionTable'
import FilterBar from '../components/transactions/FilterBar'
import AddTransactionModal from '../components/transactions/AddTransactionModal'
import DeleteConfirmationModal from '../components/transactions/DeleteConfirmationModal'
import { useApp } from '../context/AppContext'
import { fmt } from '../utils/calculations'

export default function Transactions() {
  const { transactions, filters, role, deleteTransaction } = useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [txToDelete, setTxToDelete] = useState(null)

  const filtered = useMemo(() => {
    return transactions
      .filter((tx) => {
        const search = filters.search.trim().toLowerCase()
        if (
          search &&
          !`${tx.desc} ${tx.category} ${tx.type}`.toLowerCase().includes(search)
        ) {
          return false
        }

        if (filters.type !== '' && tx.type !== filters.type) return false
        if (filters.category !== '' && tx.category !== filters.category) return false
        return true
      })
      .sort((a, b) => {
        if (filters.sort === 'date-desc') return new Date(b.date) - new Date(a.date)
        if (filters.sort === 'date-asc') return new Date(a.date) - new Date(b.date)
        if (filters.sort === 'amount-desc') return b.amount - a.amount
        if (filters.sort === 'amount-asc') return a.amount - b.amount
        return 0
      })
  }, [transactions, filters])

  const incomeCount = filtered.filter((tx) => tx.type === 'income').length
  const expenseCount = filtered.filter((tx) => tx.type === 'expense').length
  const totalVolume = filtered.reduce((sum, tx) => sum + tx.amount, 0)

  const openAdd = () => {
    setEditData(null)
    setModalOpen(true)
  }

  const openEdit = (tx) => {
    setEditData(tx)
    setModalOpen(true)
  }

  const handleDeleteClick = (tx) => {
    setTxToDelete(tx)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (txToDelete) {
      await deleteTransaction(txToDelete.id)
      setDeleteModalOpen(false)
      setModalOpen(false)
    }
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="surface-panel overflow-hidden p-5 sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr] xl:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-blue-600 dark:text-blue-400">
              Transaction Workspace
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">Explore and manage activity</h1>
            <p className="mt-3 max-w-3xl text-sm text-slate-500 dark:text-slate-400">
              Review every finance entry with search, filters, sorting, and role-based actions. The viewer role can
              inspect records, while the admin role can create and edit transactions for demonstration.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300">
                <span className="font-semibold text-slate-900 dark:text-white">{filtered.length}</span> visible records
              </div>
              <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300">
                <span className="font-semibold text-emerald-600 dark:text-emerald-300">{incomeCount}</span> income
              </div>
              <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300">
                <span className="font-semibold text-rose-600 dark:text-rose-300">{expenseCount}</span> expense
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950/70">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Role mode</p>
              <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white">{role === 'admin' ? 'Admin' : 'Viewer'}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {role === 'admin' ? 'Can add, edit, and delete transactions.' : 'Can review data in read-only mode.'}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950/70">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Transaction volume</p>
              <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white">{fmt(totalVolume)}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Aggregate amount in current filtered view.</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950/70">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Quick action</p>
              <button
                onClick={openAdd}
                disabled={role !== 'admin'}
                className="mt-3 inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
              >
                {role === 'admin' ? 'Add Transaction' : 'Admin role required'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="surface-panel p-5 sm:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="section-title">Transaction Explorer</h2>
            <p className="section-copy">Search by description, filter by type/category, and sort by date or amount.</p>
          </div>
        </div>

        <FilterBar />
        <TransactionTable transactions={filtered} onEdit={openEdit} onDelete={handleDeleteClick} />
      </section>

      <AddTransactionModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        editData={editData} 
        onDelete={() => handleDeleteClick(editData)}
      />

      <DeleteConfirmationModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        transactionTitle={txToDelete?.desc}
      />
    </div>
  )
}
