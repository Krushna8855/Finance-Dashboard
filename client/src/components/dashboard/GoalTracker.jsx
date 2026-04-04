import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import AddGoalModal from './AddGoalModal'
import { Plus } from 'lucide-react'

export default function GoalTracker() {
  const { goals } = useApp()
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="premium-panel p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Savings Goals</h3>
          <p className="text-[10px] font-medium text-slate-500">Live progress tracking</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 transition hover:bg-blue-500 hover:text-white"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/5 hover:scrollbar-thumb-white/10">
        {goals.map((goal) => {
          const progress = Math.min((goal.current / goal.target) * 100, 100)
          
          const progressColors = {
            blue: 'bg-blue-500',
            emerald: 'bg-emerald-500',
            purple: 'bg-purple-500',
            rose: 'bg-rose-500',
          }

          return (
            <div key={goal.id} className="group relative">
              <div className="mb-1.5 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-300">
                    {goal.name}
                  </p>
                  <p className="text-[8px] font-bold text-slate-600">
                    {progress.toFixed(0)}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-white">
                    ₹{(goal.current / 1000).toFixed(1)}K
                  </p>
                </div>
              </div>

              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5 relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, ease: 'circOut' }}
                  className={`h-full rounded-full ${progressColors[goal.color]} relative overflow-hidden`}
                >
                  <div className="absolute inset-0 animate-shimmer opacity-20" />
                </motion.div>
              </div>
            </div>
          )
        })}
      </div>
      
      <button 
        onClick={() => setModalOpen(true)}
        className="mt-6 w-full rounded-xl border border-white/5 bg-white/5 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 transition hover:bg-white hover:text-slate-900"
      >
        Manual Initialization
      </button>

      <AddGoalModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
