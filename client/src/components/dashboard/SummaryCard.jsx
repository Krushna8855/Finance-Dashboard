import { motion } from 'framer-motion'
import BorderGlow from '../common/BorderGlow'

export default function SummaryCard({ title, value, change, changeType, icon, color, description }) {
  const isUp = changeType === 'up'
  
  const colors = {
    emerald: { glow: '145 100 60', hex: ['#10b981', '#34d399', '#059669'] },
    blue: { glow: '217 91 60', hex: ['#3b82f6', '#60a5fa', '#2563eb'] },
    red: { glow: '349 89 60', hex: ['#f43f5e', '#fb7185', '#e11d48'] },
    purple: { glow: '268 89 60', hex: ['#8b5cf6', '#a78bfa', '#7c3aed'] },
  }

  const activeColor = colors[color] || colors.blue

  return (
    <BorderGlow
      borderRadius={24}
      glowRadius={30}
      glowColor={activeColor.glow}
      backgroundColor="transparent"
      colors={activeColor.hex}
      edgeSensitivity={40}
      fillOpacity={0.2}
      className="group"
    >
      <div className="flex items-center gap-5 p-5">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border bg-slate-900/50 text-2xl shadow-inner transition-transform group-hover:scale-110 border-white/5`}>
          {icon}
        </div>
        
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 truncate">{title}</p>
            <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider shrink-0 ${isUp ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
              {isUp ? '↑' : '↓'} {change}
            </div>
          </div>
          <h3 className="mt-1 text-2xl font-black tracking-tighter text-white leading-none">{value}</h3>
          <p className="mt-1.5 truncate text-[10px] font-medium text-slate-500 opacity-60">
            {description}
          </p>
          
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: isUp ? '75%' : '45%' }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className={`h-full rounded-full ${color === 'emerald' ? 'bg-emerald-500/80' : color === 'blue' ? 'bg-blue-500' : color === 'red' ? 'bg-rose-500' : 'bg-purple-500'}`}
            />
          </div>
        </div>
      </div>
    </BorderGlow>
  )
}