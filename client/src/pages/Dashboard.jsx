import { motion } from 'framer-motion'
import SummaryCard from '../components/dashboard/SummaryCard'
import BorderGlow from '../components/common/BorderGlow'
import BalanceChart from '../components/dashboard/BalanceChart'
import CategoryChart from '../components/dashboard/CategoryChart'
import GoalTracker from '../components/dashboard/GoalTracker'
import { useApp } from '../context/AppContext'
import Hyperspeed from '../components/common/Hyperspeed'
import {
  getTotalIncome,
  getTotalExpenses,
  getBalance,
  getCategoryBreakdown,
  getMonthlyData,
  fmt,
  formatSignedAmount,
  formatDate,
  CATEGORY_COLORS,
} from '../utils/calculations'

export default function Dashboard() {
  const { transactions, loading, error, role } = useApp()
  
  const hyperspeedOptions = {
    distortion: 'mountainDistortion',
    length: 300,
    roadWidth: 9,
    islandWidth: 2,
    lanesPerRoad: 3,
    fov: 90,
    fovSpeedUp: 150,
    speedUp: 2,
    carLightsFade: 0.4,
    totalSideLightSticks: 20,
    lightPairsPerRoadWay: 30,
    shoulderLinesWidthPercentage: 0.05,
    brokenLinesWidthPercentage: 0.1,
    brokenLinesLengthPercentage: 0.5,
    lightStickWidth: [0.12, 0.5],
    lightStickHeight: [1.3, 1.7],
    movingAwaySpeed: [60, 80],
    movingCloserSpeed: [-120, -160],
    carLightsLength: [300 * 0.05, 300 * 0.15],
    carLightsRadius: [0.05, 0.14],
    carWidthPercentage: [0.3, 0.5],
    carShiftX: [-0.2, 0.2],
    carFloorSeparation: [0.05, 1],
    colors: {
      roadColor: 0x080808,
      islandColor: 0x0a0a0a,
      background: 0x000000,
      shoulderLines: 0x131318,
      brokenLines: 0x131318,
      leftCars: [0x3b82f6, 0x2563eb, 0x1d4ed8],
      rightCars: [0x475569, 0x334155, 0x1e293b],
      sticks: 0x3b82f6
    }
  }

  const income = getTotalIncome(transactions)
  const expenses = getTotalExpenses(transactions)
  const balance = getBalance(transactions)
  const catData = getCategoryBreakdown(transactions)
  const monthly = getMonthlyData(transactions)

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  // Advanced data processing
  const breakdown = Object.entries(catData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
  
  const totalExpense = Object.values(catData).reduce((a, b) => a + b, 0)
  const expenseRatio = ((expenses / (income || 1)) * 100).toFixed(1)

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden rounded-[40px] bg-slate-950 px-6 py-12 text-white shadow-2xl sm:px-10 sm:py-16">
        <div className="absolute inset-0 z-0 opacity-40">
          <Hyperspeed effectOptions={hyperspeedOptions} />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-slate-900/60 to-slate-950/80" />
        
        <div className="relative z-20">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-blue-400">
            <span>Corporate Intelligence Center</span>
            <span className="opacity-40">•</span>
            <span>v4.0.2</span>
            <span className="opacity-40">•</span>
            <span className="rounded-full bg-blue-500/20 px-3 py-1 text-blue-300">Standalone Mode</span>
          </div>

          <div className="mt-8 grid gap-8 xl:grid-cols-[1.5fr_0.8fr] xl:items-center">
            <div>
              <h1 className="max-w-4xl text-4xl font-black leading-[1.1] tracking-tighter text-glow sm:text-6xl xl:text-7xl">
                Intelligence built for <br />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">financial clarity.</span>
              </h1>
              <p className="mt-8 max-w-lg text-sm font-medium leading-relaxed text-slate-400 sm:text-base">
                Welcome back, {role}. Monitor your assets, minimize waste, and master your cash flow with institutional-grade analytics in the palm of your hand.
              </p>
              
              <div className="mt-10 flex flex-wrap gap-4">
                <button className="flex h-12 items-center justify-center rounded-2xl bg-white px-8 text-sm font-black uppercase tracking-widest text-slate-950 shadow-lg shadow-white/5 transition hover:bg-slate-100 hover:scale-[1.05] active:scale-[0.98]">
                  Export Report
                </button>
                <button className="flex h-12 items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-8 text-sm font-black uppercase tracking-widest text-white transition backdrop-blur-md hover:bg-white/12 hover:scale-[1.05] active:scale-[0.98]">
                  View Settings
                </button>
              </div>
            </div>

            <BorderGlow
              borderRadius={40}
              glowRadius={50}
              glowColor="145 100 60"
              colors={['#10b981', '#34d399', '#059669']}
              backgroundColor="rgba(15, 23, 42, 0.4)"
              edgeSensitivity={40}
              fillOpacity={0.1}
              className="w-full"
            >
              <div className="p-8 lg:p-10">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Live Portofolio</p>
                  <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_12px_#10b981]" />
                </div>
                <h2 className="mt-4 text-5xl font-black tracking-tight text-white">{fmt(balance)}</h2>
                <p className="mt-2 text-sm font-bold text-emerald-400">+1.2% since yesterday</p>
                
                <div className="mt-10 space-y-5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-400">Monthly Efficency</p>
                    <p className="text-xs font-black text-white">{100 - expenseRatio}%</p>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${100 - expenseRatio}%` }}
                      transition={{ duration: 1.5, ease: 'circOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" 
                    />
                  </div>
                </div>
              </div>
            </BorderGlow>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_0.4fr]">
        <div className="space-y-6">
          {/* Quick Stats Grid */}
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              title="Current Position"
              value={fmt(balance)}
              change={`${balance >= 0 ? '+' : ''}${((balance / Math.abs(income || 1)) * 100).toFixed(1)}%`}
              changeType={balance >= 0 ? 'up' : 'down'}
              icon="💰"
              color="emerald"
              description="Net liquid assets"
            />
            <SummaryCard
              title="Revenue"
              value={fmt(income)}
              change="12.5%"
              changeType="up"
              icon="📈"
              color="blue"
              description="Gross monthly inflow"
            />
            <SummaryCard
              title="Burn Rate"
              value={fmt(expenses)}
              change="4.1%"
              changeType="down"
              icon="📊"
              color="red"
              description="Monthly overheads"
            />
            <SummaryCard
              title="Volume"
              value={transactions.length}
              change="3 new"
              changeType="up"
              icon="⚡"
              color="purple"
              description="Processed entires"
            />
          </section>

          {/* Detailed Charts */}
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <BorderGlow borderRadius={32} glowColor="217 91 60" colors={['#3b82f6', '#1d4ed8', '#1e40af']} backgroundColor="rgba(15, 23, 42, 0.4)" edgeSensitivity={50}>
              <div className="p-6 sm:p-8">
                <div className="mb-8">
                  <h3 className="section-title">Cash Flow Volatility</h3>
                  <p className="section-copy">Year-to-date performance vs budget projections</p>
                </div>
                <div className="h-[300px]">
                  <BalanceChart data={monthly} />
                </div>
              </div>
            </BorderGlow>

            <BorderGlow borderRadius={32} glowColor="268 89 60" colors={['#8b5cf6', '#7c3aed', '#6d28d9']} backgroundColor="rgba(15, 23, 42, 0.4)" edgeSensitivity={50}>
              <div className="p-6 sm:p-8">
                <div className="mb-8">
                  <h3 className="section-title">Expense Allocation</h3>
                  <p className="section-copy">Category weight analysis for June 2025</p>
                </div>
                <div className="grid h-[300px] grid-cols-1 gap-8 md:grid-cols-[1fr_0.8fr]">
                  <CategoryChart data={catData} />
                  <div className="flex flex-col justify-center space-y-5">
                    {breakdown.map(([name, amount]) => (
                      <div key={name}>
                        <div className="mb-1 flex items-center justify-between text-[10px] font-black tracking-widest uppercase text-slate-500">
                          <span>{name}</span>
                          <span className="text-white">{((amount / totalExpense) * 100).toFixed(0)}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-white/5">
                          <div 
                            className="h-full rounded-full" 
                            style={{ 
                              width: `${(amount / totalExpense) * 100}%`,
                              backgroundColor: CATEGORY_COLORS[name] || '#6366f1'
                            }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </BorderGlow>
          </section>

          {/* Large Transactions Table Preview */}
          <section className="premium-panel overflow-hidden p-6 sm:p-8">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="section-title">Activity Stream</h3>
                <p className="section-copy">Immediate real-time insight into the five latest transactions.</p>
              </div>

              <button
                type="button"
                className="group flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-xs font-black uppercase tracking-widest text-white transition hover:bg-black active:scale-95 dark:bg-white dark:text-slate-900"
              >
                Full History
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
            </div>

            <div className="space-y-2">
              {recentTransactions.map((tx) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  key={tx.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/5 p-3 px-4 transition-all hover:bg-white/10 dark:bg-slate-900/40"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg shadow-inner ${
                        tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {tx.type === 'income' ? '💵' : '💸'}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black tracking-tight text-white">{tx.desc}</p>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                        {tx.category} • {formatDate(tx.date)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-base font-black tracking-tighter ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {formatSignedAmount(tx.amount, tx.type)}
                    </div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-600">Processed</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Info Area */}
        <aside className="space-y-6">
          <GoalTracker />
          
          <div className="premium-panel bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 p-8 text-white">
            <div className="mb-6 h-14 w-14 rounded-2xl bg-white/10 text-3xl flex items-center justify-center backdrop-blur-md">
              🤖
            </div>
            <h3 className="text-2xl font-black leading-tight tracking-tight">AI Insights Profile</h3>
            <p className="mt-4 text-sm font-medium leading-relaxed text-blue-100/70">
              Based on your habits, you spend <span className="font-black text-white">14% more</span> on "Food" than the global average. Consider setting a cap.
            </p>
            
            <button className="mt-8 w-full rounded-2xl bg-white py-3.5 text-xs font-black uppercase tracking-widest text-blue-800 transition hover:bg-blue-50 active:scale-95">
              Refactor Budget
            </button>
          </div>

          <div className="premium-panel p-6 dark:!bg-slate-900/40">
            <h3 className="section-title !text-xs opacity-50">Operational Pulse</h3>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center justify-center rounded-xl bg-white/5 py-3">
                <span className="text-[9px] font-black uppercase text-slate-500 mb-1.5">Sync</span>
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/20" />
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl bg-white/5 py-3">
                <span className="text-[9px] font-black uppercase text-slate-500 mb-0.5">Mem</span>
                <span className="text-white font-black text-xs">98%</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl bg-white/5 py-3">
                <span className="text-[9px] font-black uppercase text-slate-500 mb-0.5">UP</span>
                <span className="text-white font-black text-xs">99.9</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}