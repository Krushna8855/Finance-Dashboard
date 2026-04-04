import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Zap, Wallet, Activity, Target, X } from 'lucide-react'

export default function CommandPalette({ isOpen, onClose, onNavigate }) {
  const [search, setSearch] = useState('')
  
  const actions = [
    { id: 'dash', label: 'Go to Dashboard', icon: <Zap size={18} />, category: 'Navigation', page: 'dashboard' },
    { id: 'tx', label: 'View Transactions', icon: <Wallet size={18} />, category: 'Navigation', page: 'transactions' },
    { id: 'ins', label: 'Financial Insights', icon: <Activity size={18} />, category: 'Navigation', page: 'insights' },
    { id: 'goal', label: 'Create New Goal', icon: <Target size={18} />, category: 'Actions', page: 'dashboard' },
  ]

  const filtered = actions.filter(a => 
    a.label.toLowerCase().includes(search.toLowerCase()) || 
    a.category.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (isOpen) onClose()
        else onNavigate(null, true) // Toggle via callback
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] sm:pt-[20vh] p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative w-full max-w-xl overflow-hidden rounded-[2rem] bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-white/10"
        >
          <div className="flex items-center border-b border-slate-100 px-6 py-5 dark:border-white/5">
            <Search className="mr-4 text-slate-400" size={20} />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search actions, pages, or commands (Ctrl+K)"
              className="flex-1 bg-transparent text-lg font-medium text-slate-800 outline-none placeholder:text-slate-400 dark:text-white"
            />
            <button onClick={onClose} className="ml-4 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>

          <div className="max-h-[380px] overflow-y-auto p-3">
            {filtered.length > 0 ? (
              <div className="space-y-4">
                {['Navigation', 'Actions'].map(cat => {
                  const items = filtered.filter(f => f.category === cat)
                  if (items.length === 0) return null
                  
                  return (
                    <div key={cat}>
                      <p className="px-4 py-2 text-[10px] font-black uppercase tracking-[.2em] text-slate-400">{cat}</p>
                      <div className="mt-1 space-y-1">
                        {items.map(item => (
                          <button
                            key={item.id}
                            onClick={() => {
                              onNavigate(item.page)
                              onClose()
                            }}
                            className="flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-left transition hover:bg-slate-50 dark:hover:bg-white/5 group"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition group-hover:bg-blue-500 group-hover:text-white dark:bg-slate-800 dark:text-slate-400">
                              {item.icon}
                            </div>
                            <span className="flex-1 font-bold text-slate-700 dark:text-slate-200">{item.label}</span>
                            <span className="text-[10px] font-bold text-slate-300 opacity-0 transition group-hover:opacity-100 uppercase tracking-widest">Enter</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400">
                <p className="text-sm font-medium">No commands found for "{search}"</p>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-white/5 dark:bg-slate-950/20">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <kbd className="flex h-5 w-5 items-center justify-center rounded border border-slate-200 bg-white text-[10px] font-bold text-slate-400 shadow-sm dark:border-white/10 dark:bg-slate-800">↵</kbd>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Select</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="flex h-5 w-5 items-center justify-center rounded border border-slate-200 bg-white text-[10px] font-bold text-slate-400 shadow-sm dark:border-white/10 dark:bg-slate-800">esc</kbd>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Close</span>
              </div>
            </div>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[.2em]">FinanceIQ Command v1.0</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
