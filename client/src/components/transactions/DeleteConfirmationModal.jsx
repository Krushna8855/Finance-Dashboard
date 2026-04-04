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
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm transition-all"
      onClick={(e) => e.target === e.currentTarget && !submitting && onClose()}
    >
      <div className="w-full max-w-sm animate-fade-in-up rounded-[2.5rem] bg-white p-9 shadow-2xl dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-rose-50 text-5xl dark:bg-rose-500/10 shadow-inner group transition-transform hover:scale-105">
          <span className="drop-shadow-sm">⚠️</span>
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Confirm Deletion
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Are you sure you want to remove <span className="font-bold text-slate-800 dark:text-slate-200">"{transactionTitle}"</span>? 
            <br />
            <span className="text-xs mt-2 block font-medium text-rose-500/80 uppercase tracking-widest">This action is permanent</span>
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-3">
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="w-full rounded-2xl bg-rose-600 py-4 text-sm font-bold text-white shadow-xl shadow-rose-200 transition-all hover:bg-rose-700 hover:shadow-rose-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-rose-300 dark:shadow-none dark:disabled:bg-rose-900/50"
          >
            {submitting ? (
              <div className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Deleting...
              </div>
            ) : (
              'Yes, Delete Permanent'
            )}
          </button>
          
          <button
            onClick={onClose}
            disabled={submitting}
            className="w-full rounded-2xl border border-slate-200 bg-white py-4 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50 active:scale-[0.98] disabled:cursor-not-allowed dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
