import { useEffect, useState } from 'react'
import { useApp } from '../../context/AppContext'
import { CATEGORIES } from '../../utils/calculations'

const initialFormState = {
  desc: '',
  amount: '',
  date: '',
  category: 'Food',
  type: 'expense',
}

export default function AddTransactionModal({ open, onClose, editData, onDelete }) {
  const { addTransaction, editTransaction } = useApp()
  const [form, setForm] = useState(initialFormState)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) {
      return
    }

    if (editData) {
      setForm({
        desc: editData.desc,
        amount: editData.amount,
        date: editData.date,
        category: editData.category,
        type: editData.type,
      })
      return
    }

    setForm({
      ...initialFormState,
      date: new Date().toISOString().split('T')[0],
    })
  }, [editData, open])

  const handle = (key, value) => {
    setForm((previous) => ({ ...previous, [key]: value }))
  }

  const submit = async () => {
    if (!form.desc || !form.amount || !form.date || submitting) {
      return
    }

    setSubmitting(true)

    try {
      const tx = { ...form, amount: parseFloat(form.amount) }
      const savedTransaction = editData
        ? await editTransaction(editData.id, tx)
        : await addTransaction(tx)

      if (savedTransaction) {
        onClose()
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm transition-all"
      onClick={(event) => event.target === event.currentTarget && !submitting && onClose()}
    >
      <div className="w-full max-w-md animate-fade-in-up rounded-[2rem] bg-white p-7 shadow-2xl dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {editData ? 'Edit Transaction' : 'New Transaction'}
            </h2>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
              {editData ? 'Update your entry details below' : 'Add a new financial record'}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Description
            </label>
            <input
              value={form.desc}
              onChange={(event) => handle('desc', event.target.value)}
              placeholder="e.g. Monthly Salary"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Amount (₹)
              </label>
              <input
                type="number"
                value={form.amount}
                onChange={(event) => handle('amount', event.target.value)}
                placeholder="0.00"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(event) => handle('date', event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Category
              </label>
              <select
                value={form.category}
                onChange={(event) => handle('category', event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-400"
              >
                {CATEGORIES.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Type
              </label>
              <select
                value={form.type}
                onChange={(event) => handle('type', event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-400"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <button
            onClick={submit}
            disabled={submitting}
            className="w-full rounded-2xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-blue-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-blue-300 dark:shadow-none dark:disabled:bg-blue-900/50"
          >
            {submitting
              ? editData
                ? 'Updating...'
                : 'Adding...'
              : editData
                ? 'Update Transaction'
                : 'Add Transaction'}
          </button>

          {editData && (
            <button
              onClick={() => {
                onDelete()
              }}
              disabled={submitting}
              className="w-full rounded-2xl border border-rose-100 bg-rose-50/50 py-3.5 text-sm font-bold text-rose-600 transition-all hover:bg-rose-100 active:scale-[0.98] disabled:cursor-not-allowed dark:border-rose-900/30 dark:bg-rose-500/5 dark:text-rose-400 dark:hover:bg-rose-500/10"
            >
              Delete Transaction
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
