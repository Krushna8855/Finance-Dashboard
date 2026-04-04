import { useApp } from '../../context/AppContext'
import { CATEGORY_COLORS, formatDate, formatSignedAmount } from '../../utils/calculations'

export default function TransactionTable({ transactions, onEdit, onDelete }) {
  const { role, seedTransactions } = useApp()

  if (!transactions.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/80 px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900/50">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-3xl shadow-sm dark:bg-slate-800">
          📭
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No transactions found</h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {role === 'admin' 
            ? 'Your transaction history is empty. Start fresh or seed the database with sample data.' 
            : 'Try adjusting your filters or switch to admin mode to see more records.'}
        </p>
        {role === 'admin' && (
          <button
            onClick={seedTransactions}
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            🌱 Seed Sample Data
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/60 lg:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/70">
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Date</th>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Description</th>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Category</th>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Amount</th>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Type</th>
              {role === 'admin' && (
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Actions</th>
              )}
            </tr>
          </thead>

          <tbody>
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                className="border-b border-slate-100 transition hover:bg-slate-50/80 dark:border-slate-800 dark:hover:bg-slate-900/40"
              >
                <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400">
                  {formatDate(tx.date)}
                </td>
                <td className="px-5 py-4">
                  <p className="font-semibold text-slate-900 dark:text-white">{tx.desc}</p>
                </td>
                <td className="px-5 py-4">
                  <span
                    className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
                    style={{
                      background: `${CATEGORY_COLORS[tx.category] || '#6366f1'}20`,
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
                <td className="px-5 py-4">
                  <span className={`text-sm font-bold ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'}`}>
                    {formatSignedAmount(tx.amount, tx.type)}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
                      tx.type === 'income'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300'
                    }`}
                  >
                    {tx.type}
                  </span>
                </td>
                {role === 'admin' && (
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(tx)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(tx)}
                        className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 lg:hidden">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/60"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  {formatDate(tx.date)}
                </p>
                <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-white">{tx.desc}</h3>
              </div>

              <span
                className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
                  tx.type === 'income'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300'
                }`}
              >
                {tx.type}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
                style={{
                  background: `${CATEGORY_COLORS[tx.category] || '#6366f1'}20`,
                  color: CATEGORY_COLORS[tx.category] || '#6366f1',
                }}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: CATEGORY_COLORS[tx.category] || '#6366f1' }} />
                {tx.category}
              </span>

              <span className={`text-lg font-bold ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'}`}>
                {formatSignedAmount(tx.amount, tx.type)}
              </span>
            </div>

            {role === 'admin' && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => onEdit(tx)}
                  className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(tx)}
                  className="flex-1 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
                >
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