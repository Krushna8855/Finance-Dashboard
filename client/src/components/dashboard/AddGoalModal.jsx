import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Target, Flag, Coins, Box } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function AddGoalModal({ open, onClose }) {
  const { addGoal } = useApp()
  const [formData, setFormData] = useState({
    name: '',
    target: '',
    current: '',
    color: 'blue'
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    await addGoal(formData)
    setFormData({ name: '', target: '', current: '', color: 'blue' })
    onClose()
  }

  if (!open) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-white p-8 dark:bg-slate-900 shadow-2xl"
        >
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Create New Goal</h2>
              <p className="mt-1 text-sm font-medium text-slate-500">Define your next financial milestone</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Goal Name</label>
              <div className="relative">
                <Flag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  type="text"
                  placeholder="e.g. New Electric Bike"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-2xl border-none bg-slate-50 py-4 pl-12 pr-6 text-sm font-bold text-slate-900 outline-none ring-2 ring-transparent transition-all focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Amount</label>
                <div className="relative">
                  <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    required
                    type="number"
                    placeholder="2500"
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                    className="w-full rounded-2xl border-none bg-slate-50 py-4 pl-12 pr-6 text-sm font-bold text-slate-900 outline-none ring-2 ring-transparent transition-all focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Savings</label>
                <div className="relative">
                  <Coins className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    required
                    type="number"
                    placeholder="500"
                    value={formData.current}
                    onChange={(e) => setFormData({ ...formData, current: e.target.value })}
                    className="w-full rounded-2xl border-none bg-slate-50 py-4 pl-12 pr-6 text-sm font-bold text-slate-900 outline-none ring-2 ring-transparent transition-all focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Theme Color</label>
              <div className="flex gap-4">
                {['blue', 'emerald', 'purple', 'rose'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: c })}
                    className={`h-12 w-12 rounded-xl transition-all ${
                      formData.color === c ? 'ring-4 ring-offset-4 ring-blue-500' : 'opacity-60 hover:opacity-100'
                    } ${
                      c === 'blue' ? 'bg-blue-500' : 
                      c === 'emerald' ? 'bg-emerald-500' : 
                      c === 'purple' ? 'bg-purple-500' : 'bg-rose-500'
                    }`}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-slate-900 py-5 text-sm font-black uppercase tracking-widest text-white shadow-xl transition-all hover:bg-black hover:scale-[1.02] active:scale-[0.98] dark:bg-white dark:text-slate-900"
            >
              Initialize Goal
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
