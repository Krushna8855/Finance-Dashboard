import { TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import { useMemo } from 'react'
import {
  fmt,
  getBalance,
  getCategoryBreakdown,
  getMonthlyData,
  getTotalExpenses,
  getTotalIncome,
} from '../utils/calculations'
import { useApp } from '../context/AppContext'

export default function Insights() {
  const { transactions } = useApp()

  const metrics = useMemo(() => {
    const income = getTotalIncome(transactions)
    const expenses = getTotalExpenses(transactions)
    const balance = getBalance(transactions)
    const monthly = getMonthlyData(transactions)
    const categoryBreakdown = getCategoryBreakdown(transactions)

    const highestCategory = Object.entries(categoryBreakdown).sort((a, b) => b[1] - a[1])[0]
    const lastMonth = monthly[monthly.length - 1]
    const previousMonth = monthly[monthly.length - 2]

    const savingsRate = income > 0 ? ((balance / income) * 100).toFixed(1) : '0.0'
    const expenseChange = previousMonth?.expense
      ? (((lastMonth?.expense || 0) - previousMonth.expense) / previousMonth.expense) * 100
      : 0

    return {
      income,
      expenses,
      balance,
      highestCategory,
      savingsRate,
      expenseChange,
      activeDays: new Set(transactions.map((tx) => tx.date)).size,
      avgTicket: transactions.length ? expenses / transactions.filter((tx) => tx.type === 'expense').length : 0,
      lastMonth,
    }
  }, [transactions])

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="surface-panel p-5 sm:p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-blue-500">Insights</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Understand your money habits</h1>
            <p className="mt-3 max-w-3xl text-sm text-slate-500 dark:text-slate-400 sm:text-base">
              A quick summary of financial signals generated from your current transaction history.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-3xl bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:bg-blue-500/10 dark:text-blue-200">
              <p className="text-xs uppercase tracking-[0.22em] text-blue-500 dark:text-blue-300">Tracking span</p>
              <p className="mt-2 text-xl font-bold">{metrics.lastMonth?.label || 'N/A'}</p>
            </div>
            <div className="rounded-3xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
              <p className="text-xs uppercase tracking-[0.22em] text-emerald-500 dark:text-emerald-300">Savings rate</p>
              <p className="mt-2 text-xl font-bold">{metrics.savingsRate}%</p>
            </div>
            <div className="rounded-3xl bg-violet-50 px-4 py-3 text-sm text-violet-700 dark:bg-violet-500/10 dark:text-violet-200">
              <p className="text-xs uppercase tracking-[0.22em] text-violet-500 dark:text-violet-300">Active days</p>
              <p className="mt-2 text-xl font-bold">{metrics.activeDays}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="surface-panel p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Net position</p>
              <h3 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{fmt(metrics.balance)}</h3>
            </div>
            <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-500">
              <Wallet className="h-6 w-6" />
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Available after all expenses.</p>
        </article>

        <article className="surface-panel p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Expense intensity</p>
              <h3 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
                {metrics.expenseChange >= 0 ? '+' : ''}
                {metrics.expenseChange.toFixed(1)}%
              </h3>
            </div>
            <div
              className={`rounded-2xl p-3 ${
                metrics.expenseChange <= 0
                  ? 'bg-emerald-500/10 text-emerald-500'
                  : 'bg-rose-500/10 text-rose-500'
              }`}
            >
              {metrics.expenseChange <= 0 ? <TrendingDown className="h-6 w-6" /> : <TrendingUp className="h-6 w-6" />}
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Compared with {metrics.lastMonth?.label || 'the latest period'}.
          </p>
        </article>

        <article className="surface-panel p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Top expense category</p>
              <h3 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
                {metrics.highestCategory?.[0] || 'No data'}
              </h3>
            </div>
            <div className="rounded-2xl bg-amber-500/10 p-3 text-amber-500">🏷️</div>
          </div>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            {metrics.highestCategory ? `${fmt(metrics.highestCategory[1])} spent here.` : 'Add expenses to reveal trends.'}
          </p>
        </article>

        <article className="surface-panel p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Average expense ticket</p>
              <h3 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{fmt(metrics.avgTicket)}</h3>
            </div>
            <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-500">🧾</div>
          </div>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Average value of each expense transaction.</p>
        </article>
      </section>

      <section className="surface-panel p-5 sm:p-6">
        <div className="mb-6">
          <h3 className="section-title">Observation highlights</h3>
          <p className="section-copy">Actionable notes from your latest financial performance.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-950/40">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Cash flow momentum</p>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              {metrics.balance >= 0
                ? `You have retained ${fmt(metrics.balance)} after covering your current expenses. Continue maintaining this pace to strengthen your savings rate of ${metrics.savingsRate}%.`
                : `Your spending currently exceeds income by ${fmt(Math.abs(metrics.balance))}. Review the top categories and cut back where possible.`}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-950/40">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Category watch</p>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              {metrics.highestCategory
                ? `${metrics.highestCategory[0]} is your leading expense bucket at ${fmt(metrics.highestCategory[1])}. Keep an eye on this category if you want to improve next month’s balance.`
                : 'Once expense data is available, your leading spending category will appear here.'}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}