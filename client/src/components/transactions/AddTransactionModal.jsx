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

export default function AddTransactionModal({ open, onClose, editData }) {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(event) => event.target === event.currentTarget && !submitting && onClose()}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            {editData ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            onClick={onClose}
            disabled={submitting}
            className="text-xl text-slate-400 transition hover:text-slate-600 disabled:cursor-not-allowed dark:hover:text-slate-200"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">
              Description
            </label>
            <input
              value={form.desc}
              onChange={(event) => handle('desc', event.target.value)}
              placeholder="e.g. Monthly Salary"
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">
                Amount (₹)
              </label>
              <input
                type="number"
                value={form.amount}
                onChange={(event) => handle('amount', event.target.value)}
                placeholder="0.00"
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">
                Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(event) => handle('date', event.target.value)}
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">
                Category
              </label>
              <select
                value={form.category}
                onChange={(event) => handle('category', event.target.value)}
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              >
                {CATEGORIES.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">
                Type
              </label>
              <select
                value={form.type}
                onChange={(event) => handle('type', event.target.value)}
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={submit}
          disabled={submitting}
          className="mt-5 w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {submitting
            ? editData
              ? 'Updating...'
              : 'Adding...'
            : editData
              ? 'Update Transaction'
              : 'Add Transaction'}
        </button>
      </div>
    </div>
  )
}
