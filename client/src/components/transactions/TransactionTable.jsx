import { useApp } from '../../context/AppContext'
import { CATEGORY_COLORS, formatDate, formatSignedAmount } from '../../utils/calculations'
import { Edit2, Trash2, Database, ReceiptText } from 'lucide-react'

export default function TransactionTable({ transactions, onEdit, onDelete }) {
  const { role, seedTransactions } = useApp()

  if (!transactions.length) {
    return (
      <div className="premium-panel border-dashed border-slate-300 bg-slate-50/80 px-6 py-20 text-center dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-3xl shadow-lg dark:bg-slate-950">
          <ReceiptText className="h-10 w-10 text-slate-400" />
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white">No activity detected</h3>
        <p className="mx-auto mt-3 max-w-sm text-sm font-medium text-slate-500 dark:text-slate-400">
          {role === 'admin' 
            ? 'Your ledger is currently sterile. Start adding records or seed with demo data.' 
            : 'Audit history is currently empty for the current filter set.'}
        </p>
        {role === 'admin' && (
          <button
            onClick={seedTransactions}
            className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-slate-900 px-8 py-3.5 text-sm font-black uppercase tracking-widest text-white transition hover:scale-105 active:scale-95 dark:bg-white dark:text-slate-950"
          >
            <Database size={18} />
            Seed Database
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="hidden overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-950/60 dark:shadow-none lg:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50">
              <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Date</th>
              <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Description</th>
              <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Category</th>
              <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Amount</th>
              {role === 'admin' && (
                <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Actions</th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                className="group transition-colors hover:bg-slate-50/80 dark:hover:bg-white/[0.02]"
              >
                <td className="px-6 py-5 text-sm font-medium text-slate-500 dark:text-slate-400">
                  {formatDate(tx.date)}
                </td>
                <td className="px-6 py-5">
                  <p className="font-bold text-slate-900 dark:text-white">{tx.desc}</p>
                </td>
                <td className="px-6 py-5">
                  <span
                    className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-[11px] font-black uppercase tracking-wider"
                    style={{
                      background: `${CATEGORY_COLORS[tx.category] || '#6366f1'}15`,
                      color: CATEGORY_COLORS[tx.category] || '#6366f1',
                    }}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: CATEGORY_COLORS[tx.category] || '#6366f1' }}
                    />
                    {tx.category}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className={`text-base font-black ${tx.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {formatSignedAmount(tx.amount, tx.type)}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{tx.type}</span>
                  </div>
                </td>
                {role === 'admin' && (
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => onEdit(tx)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-blue-600 hover:text-white dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-blue-600 dark:hover:text-white"
                        title="Edit Entry"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(tx)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-rose-600 hover:text-white dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-rose-600 dark:hover:text-white"
                        title="Delete Entry"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-6 lg:hidden">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="premium-panel p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {formatDate(tx.date)}
                </p>
                <h3 className="mt-2 text-lg font-black text-slate-900 dark:text-white">{tx.desc}</h3>
              </div>
              <span
                className={`rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${
                  tx.type === 'income'
                    ? 'bg-emerald-500/10 text-emerald-500'
                    : 'bg-rose-500/10 text-rose-500'
                }`}
              >
                {tx.type}
              </span>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span
                className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-wider"
                style={{
                  background: `${CATEGORY_COLORS[tx.category] || '#6366f1'}15`,
                  color: CATEGORY_COLORS[tx.category] || '#6366f1',
                }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: CATEGORY_COLORS[tx.category] || '#6366f1' }} />
                {tx.category}
              </span>

              <span className={`text-xl font-black ${tx.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                {formatSignedAmount(tx.amount, tx.type)}
              </span>
            </div>

            {role === 'admin' && (
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => onEdit(tx)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-100 py-3 text-[11px] font-black uppercase tracking-widest text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                >
                  <Edit2 size={14} />
                  Edit
                </button>
                <button
                  onClick={() => onDelete(tx)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-rose-50 py-3 text-[11px] font-black uppercase tracking-widest text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}