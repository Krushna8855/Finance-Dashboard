import SummaryCard from '../components/dashboard/SummaryCard'
import BalanceChart from '../components/dashboard/BalanceChart'
import CategoryChart from '../components/dashboard/CategoryChart'
import { useApp } from '../context/AppContext'
import {
  getTotalIncome,
  getTotalExpenses,
  getBalance,
  getCategoryBreakdown,
  getMonthlyData,
  fmt,
  formatSignedAmount,
  formatDate,
} from '../utils/calculations'

export default function Dashboard() {
  const { transactions, loading, error } = useApp()
  const income = getTotalIncome(transactions)
  const expenses = getTotalExpenses(transactions)
  const balance = getBalance(transactions)
  const catData = getCategoryBreakdown(transactions)
  const monthly = getMonthlyData(transactions)

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 px-5 py-8 text-white shadow-2xl shadow-blue-500/20 sm:px-8 sm:py-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.26),_transparent_28%)]" />
        <div className="absolute -bottom-16 -right-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

        <div className="relative grid gap-8 xl:grid-cols-[1.4fr_0.8fr] xl:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-100">Financial Overview</p>
            <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl xl:text-5xl">
              Manage your money with a dashboard built for clarity.
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-blue-100 sm:text-base">
              Monitor cash flow, compare spending trends, and stay on top of your financial activity from a polished,
              fully responsive workspace.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
                <span className="font-semibold text-white">{transactions.length}</span> tracked transactions
              </div>
              <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
                <span className="font-semibold text-emerald-200">{fmt(income)}</span> incoming cash
              </div>
              <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
                <span className="font-semibold text-amber-200">{fmt(expenses)}</span> expenses monitored
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
              <p className="text-xs uppercase tracking-[0.22em] text-blue-100">Net balance</p>
              <p className="mt-2 text-2xl font-bold">{fmt(balance)}</p>
              <p className="mt-1 text-sm text-blue-100/90">Your current financial position</p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
              <p className="text-xs uppercase tracking-[0.22em] text-blue-100">Monthly trend</p>
              <p className="mt-2 text-2xl font-bold">{monthly[monthly.length - 1]?.label || 'N/A'}</p>
              <p className="mt-1 text-sm text-blue-100/90">Latest month in analytics view</p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
              <p className="text-xs uppercase tracking-[0.22em] text-blue-100">Workspace status</p>
              <p className="mt-2 text-2xl font-bold">Healthy</p>
              <p className="mt-1 text-sm text-blue-100/90">Responsive UI and live financial tracking</p>
            </div>
          </div>
        </div>
      </section>

      {(loading || error) && (
        <section className="space-y-3">
          {loading && (
            <div className="surface-panel p-4 text-sm text-slate-500 dark:text-slate-400">
              Loading transactions...
            </div>
          )}

          {error && (
            <div className="surface-panel p-4 text-sm text-rose-500 dark:text-rose-300">
              {error}
            </div>
          )}
        </section>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Net Balance"
          value={fmt(balance)}
          change={`${balance >= 0 ? '+' : ''}${((balance / Math.abs(income || 1)) * 100).toFixed(1)}%`}
          changeType={balance >= 0 ? 'up' : 'down'}
          icon="💰"
          color="emerald"
          description="Current financial position"
        />
        <SummaryCard
          title="Total Income"
          value={fmt(income)}
          change="12.5%"
          changeType="up"
          icon="📈"
          color="blue"
          description="Revenue streams"
        />
        <SummaryCard
          title="Total Expenses"
          value={fmt(expenses)}
          change="4.1%"
          changeType="down"
          icon="📊"
          color="red"
          description="Monthly spending"
        />
        <SummaryCard
          title="Active Transactions"
          value={transactions.length}
          change="3 new"
          changeType="up"
          icon="⚡"
          color="purple"
          description="Transaction volume"
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="surface-panel xl:col-span-2 p-5 sm:p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="section-title">Financial Trends</h3>
              <p className="section-copy">Six-month income and expense performance overview</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-blue-500" />
                Income
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500" />
                Expenses
              </div>
            </div>
          </div>

          <div className="h-[320px]">
            <BalanceChart data={monthly} />
          </div>
        </div>

        <div className="surface-panel p-5 sm:p-6">
          <div className="mb-6">
            <h3 className="section-title">Spending Breakdown</h3>
            <p className="section-copy">Category distribution across your recent activity</p>
          </div>

          <div className="h-[320px]">
            <CategoryChart data={catData} />
          </div>
        </div>
      </section>

      <section className="surface-panel p-5 sm:p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="section-title">Recent Transactions</h3>
            <p className="section-copy">Latest entries across your finance workflow</p>
          </div>

          <button
            type="button"
            className="btn-hover inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white sm:w-auto dark:bg-white dark:text-slate-900"
          >
            View full history
          </button>
        </div>

        <div className="space-y-3">
          {recentTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200/70 bg-white/70 p-4 transition hover:border-slate-300 hover:shadow-lg dark:border-white/10 dark:bg-slate-950/50 dark:hover:border-slate-700 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-lg ${
                    tx.type === 'income'
                      ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300'
                  }`}
                >
                  {tx.type === 'income' ? '💵' : '💸'}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900 dark:text-white">{tx.desc}</p>
                  <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                    {tx.category} • {formatDate(tx.date)}
                  </p>
                </div>
              </div>

              <div
                className={`text-sm font-bold sm:text-base ${
                  tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'
                }`}
              >
                {formatSignedAmount(tx.amount, tx.type)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}