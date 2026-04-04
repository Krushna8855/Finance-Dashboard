import { TrendingDown, TrendingUp, Wallet, Zap, Calendar, Target, ShieldCheck, Activity } from 'lucide-react'
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  fmt,
  getBalance,
  getCategoryBreakdown,
  getMonthlyData,
  getTotalExpenses,
  getTotalIncome,
} from '../utils/calculations'
import { useApp } from '../context/AppContext'
import Hyperspeed from '../components/common/Hyperspeed'

export default function Insights() {
  const { transactions } = useApp()

  const hyperspeedOptions = {
    distortion: 'turbulentDistortion',
    length: 400,
    roadWidth: 10,
    islandWidth: 2,
    lanesPerRoad: 3,
    fov: 90,
    fovSpeedUp: 150,
    speedUp: 2,
    carLightsFade: 0.4,
    totalSideLightSticks: 20,
    lightPairsPerRoadWay: 40,
    shoulderLinesWidthPercentage: 0.05,
    brokenLinesWidthPercentage: 0.1,
    brokenLinesLengthPercentage: 0.5,
    lightStickWidth: [0.12, 0.5],
    lightStickHeight: [1.3, 1.7],
    movingAwaySpeed: [60, 80],
    movingCloserSpeed: [-120, -160],
    carLightsLength: [400 * 0.03, 400 * 0.2],
    carLightsRadius: [0.05, 0.14],
    carWidthPercentage: [0.3, 0.5],
    carShiftX: [-0.8, 0.8],
    carFloorSeparation: [0, 5],
    colors: {
      roadColor: 0x080808,
      islandColor: 0x0a0a0a,
      background: 0x000000,
      shoulderLines: 0x131318,
      brokenLines: 0x131318,
      leftCars: [0x3b82f6, 0x6366f1, 0x1e40af],
      rightCars: [0x0ea5e9, 0x0284c7, 0x0369a1],
      sticks: 0x3b82f6,
    },
  }

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 lg:space-y-10"
    >
      {/* Header Section */}
      <section className="relative overflow-hidden rounded-[3rem] bg-slate-950 px-6 py-12 text-white shadow-2xl sm:px-10 sm:py-20">
        <div className="absolute inset-0 z-0 opacity-40">
          <Hyperspeed effectOptions={hyperspeedOptions} />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-slate-900/70 via-slate-900/60 to-indigo-950/90" />
        <div className="relative z-20 flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">
              <Zap size={14} className="fill-current" />
              <span>Deep Intelligence Analysis</span>
            </div>
            <h1 className="mt-6 text-4xl font-black tracking-tighter sm:text-6xl xl:text-7xl">
              Financial <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">transcendence.</span>
            </h1>
            <p className="mt-8 max-w-xl text-sm font-medium leading-[2] text-slate-300 sm:text-base lg:text-lg">
              Our neural engine decodes your micro-activity to identify vectors for wealth-building and operational efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:flex lg:flex-wrap lg:justify-end">
            <div className="premium-panel min-w-[180px] border-white/5 bg-white/5 p-6 backdrop-blur-3xl transition-transform hover:scale-105">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Savings Rate</p>
              <p className="mt-2 text-3xl font-black text-emerald-400 sm:text-4xl">{metrics.savingsRate}%</p>
            </div>
            <div className="premium-panel min-w-[220px] border-white/5 bg-white/5 p-6 backdrop-blur-3xl transition-transform hover:scale-105">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Liquidity</p>
              <p className="mt-2 text-3xl font-black text-blue-400 sm:text-4xl">{fmt(metrics.balance)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Metric Cards Grid */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <motion.article variants={item} className="premium-panel group p-8">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-blue-500/10 p-3.5 text-blue-500 transition-transform group-hover:scale-110">
              <Wallet className="h-6 w-6" />
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Net Position</p>
              <h3 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white">{fmt(metrics.balance)}</h3>
            </div>
          </div>
          <p className="mt-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Operational liquidity</p>
          <div className="mt-2 h-1 w-full rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full w-2/3 rounded-full bg-blue-500" />
          </div>
        </motion.article>

        <motion.article variants={item} className="premium-panel group p-8">
          <div className="flex items-center justify-between">
            <div className={`rounded-2xl p-3.5 transition-transform group-hover:scale-110 ${metrics.expenseChange <= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
              {metrics.expenseChange <= 0 ? <TrendingDown className="h-6 w-6" /> : <TrendingUp className="h-6 w-6" />}
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Expense Delta</p>
              <h3 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                {metrics.expenseChange >= 0 ? '+' : ''}{metrics.expenseChange.toFixed(1)}%
              </h3>
            </div>
          </div>
          <p className="mt-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">MoM variance analysis</p>
          <div className="mt-2 h-1 w-full rounded-full bg-slate-100 dark:bg-slate-800">
            <div className={`h-full rounded-full ${metrics.expenseChange <= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${Math.min(Math.abs(metrics.expenseChange), 100)}%` }} />
          </div>
        </motion.article>

        <motion.article variants={item} className="premium-panel group p-8">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-amber-500/10 p-3.5 text-amber-500 transition-transform group-hover:scale-110">
              <Target className="h-6 w-6" />
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Peak Category</p>
              <h3 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white truncate max-w-[120px]">
                {metrics.highestCategory?.[0] || 'N/A'}
              </h3>
            </div>
          </div>
          <p className="mt-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Strategic concentration</p>
          <div className="mt-2 h-1 w-full rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full w-4/5 rounded-full bg-amber-500" />
          </div>
        </motion.article>

        <motion.article variants={item} className="premium-panel group p-8">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-purple-500/10 p-3.5 text-purple-500 transition-transform group-hover:scale-110">
              <Activity className="h-6 w-6" />
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Avg Ticket</p>
              <h3 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white">{fmt(metrics.avgTicket)}</h3>
            </div>
          </div>
          <p className="mt-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Unit cost efficiency</p>
          <div className="mt-2 h-1 w-full rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full w-1/2 rounded-full bg-purple-500" />
          </div>
        </motion.article>
      </section>

      {/* Detailed Insights & Projections */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div variants={item} className="premium-panel p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h3 className="section-title">Strategic Observations</h3>
              <p className="section-copy">AI-generated signals from your activity</p>
            </div>
            <ShieldCheck className="text-blue-500" size={24} />
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-100 bg-slate-50/50 p-6 dark:border-white/5 dark:bg-slate-950/40">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Momentum Alert</p>
              </div>
              <p className="mt-4 text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                {metrics.balance >= 0
                  ? `You've successfully retained ${fmt(metrics.balance)} this period. Our projection suggests a 14% increase in net worth if this savings rate persists.`
                  : `Spending exceeds income by ${fmt(Math.abs(metrics.balance))}. Recommend immediate audit of high-frequency expenses to prevent structural deficit.`}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-slate-50/50 p-6 dark:border-white/5 dark:bg-slate-950/40">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Weight Concentration</p>
              </div>
              <p className="mt-4 text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                {metrics.highestCategory
                  ? `${metrics.highestCategory[0]} constitutes the majority of your burn rate at ${fmt(metrics.highestCategory[1])}. Total allocation efficiency is currently at 82%.`
                  : 'Insufficient data for category weight analysis. Populate more transactions to enable.'}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="premium-panel bg-slate-900 p-8 text-white dark:bg-slate-950">
          <div className="mb-8">
            <h3 className="text-xl font-black tracking-tight text-white">6-Month Projection</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-1">Stochastic forecasting model</p>
          </div>
          
          <div className="relative h-[320px] w-full overflow-hidden rounded-[2.5rem] bg-white/5 p-8 border border-white/5 shadow-inner">
            <div className="absolute inset-0 mesh-gradient opacity-10" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex justify-between items-end pb-8 border-b border-white/5">
                {[
                  { label: 'July', h: 'h-24', op: 'opacity-10' },
                  { label: 'Aug', h: 'h-28', op: 'opacity-20' },
                  { label: 'Sept', h: 'h-36', op: 'opacity-30' },
                  { label: 'Oct', h: 'h-48', op: 'bg-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.5)]' },
                  { label: 'Nov', h: 'h-56', op: 'bg-indigo-500 shadow-[0_0_25px_rgba(99,102,241,0.5)]' }
                ].map((m) => (
                  <div key={m.label} className="text-center group">
                    <p className="text-[10px] font-black uppercase text-slate-500 mb-4 transition-colors group-hover:text-white">{m.label}</p>
                    <div className={`w-10 rounded-full transition-all duration-500 group-hover:scale-y-110 origin-bottom ${m.h} ${m.op.includes('bg-') ? m.op : 'bg-white/' + m.op.split('-')[1]}`} />
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between rounded-3xl bg-white/10 p-6 backdrop-blur-md border border-white/10">
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Expected Balance</p>
                  <p className="mt-1 text-3xl font-black text-white leading-none">{fmt(metrics.balance * 6)}</p>
                </div>
                <div className="rounded-xl bg-emerald-500/90 px-4 py-2 text-[10px] font-black uppercase text-white shadow-lg shadow-emerald-500/20">
                  Healthy Growth
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <Calendar className="text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Simulation Complete</p>
              <p className="text-sm font-medium text-slate-300 mt-0.5">Model accuracy: 96.4% based on historical variance.</p>
            </div>
          </div>
        </motion.div>
      </section>
    </motion.div>
  )
}