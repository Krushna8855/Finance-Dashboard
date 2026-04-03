import { useState } from 'react'

export default function DeleteConfirmationModal({ open, onClose, onConfirm, transactionTitle }) {
  const [submitting, setSubmitting] = useState(false)

  if (!open) return null

  const handleConfirm = async () => {
    setSubmitting(true)
    try {
      await onConfirm()
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && !submitting && onClose()}
    >
      <div className="w-full max-w-sm rounded-[2rem] bg-white p-8 shadow-2xl dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-50 text-4xl dark:bg-rose-500/10 shadow-inner">
          ⚠️
        </div>
        
        <h2 className="text-center text-xl font-bold text-slate-800 dark:text-white">
          Delete Transaction?
        </h2>
        
        <p className="mt-3 text-center text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          Are you sure you want to delete <span className="font-semibold text-slate-900 dark:text-slate-100">"{transactionTitle}"</span>? 
          This action cannot be undone.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="w-full rounded-2xl bg-rose-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-rose-200 transition-all hover:bg-rose-700 hover:shadow-rose-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-rose-300 dark:shadow-none dark:disabled:bg-rose-900/50"
          >
            {submitting ? 'Deleting...' : 'Yes, Delete It'}
          </button>
          
          <button
            onClick={onClose}
            disabled={submitting}
            className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50 active:scale-[0.98] disabled:cursor-not-allowed dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
