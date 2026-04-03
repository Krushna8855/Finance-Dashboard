import { useApp } from '../../context/AppContext'
import { CATEGORIES } from '../../utils/calculations'

export default function FilterBar() {
  const { filters, setFilters } = useApp()

  const update = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }))
  const reset = () =>
    setFilters({
      search: '',
      type: '',
      category: '',
      sort: 'date-desc',
    })

  return (
    <div className="mb-5 grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(170px,1fr))_auto]">
      <input
        type="text"
        placeholder="Search by description, category, or type..."
        value={filters.search}
        onChange={(e) => update('search', e.target.value)}
        className="focus-ring min-w-0 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
      />
      <select
        value={filters.type}
        onChange={(e) => update('type', e.target.value)}
        className="focus-ring rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      >
        <option value="">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <select
        value={filters.category}
        onChange={(e) => update('category', e.target.value)}
        className="focus-ring rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      >
        <option value="">All Categories</option>
        {CATEGORIES.map((category) => (
          <option key={category}>{category}</option>
        ))}
      </select>
      <select
        value={filters.sort}
        onChange={(e) => update('sort', e.target.value)}
        className="focus-ring rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      >
        <option value="date-desc">Newest first</option>
        <option value="date-asc">Oldest first</option>
        <option value="amount-desc">Amount high to low</option>
        <option value="amount-asc">Amount low to high</option>
      </select>
      <button
        type="button"
        onClick={reset}
        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
      >
        Reset
      </button>
    </div>
  )
}
