export default function SummaryCard({ title, value, change, changeType, icon, color, description }) {
  const colorSchemes = {
    emerald: {
      bg: 'from-emerald-500/20 to-emerald-600/20',
      border: 'border-emerald-500/30',
      icon: 'bg-emerald-500/20 text-emerald-400',
      value: 'text-emerald-400',
      change: changeType === 'up' ? 'text-emerald-300' : 'text-red-300'
    },
    blue: {
      bg: 'from-blue-500/20 to-blue-600/20',
      border: 'border-blue-500/30',
      icon: 'bg-blue-500/20 text-blue-400',
      value: 'text-blue-400',
      change: changeType === 'up' ? 'text-emerald-300' : 'text-red-300'
    },
    red: {
      bg: 'from-red-500/20 to-red-600/20',
      border: 'border-red-500/30',
      icon: 'bg-red-500/20 text-red-400',
      value: 'text-red-400',
      change: changeType === 'up' ? 'text-emerald-300' : 'text-red-300'
    },
    purple: {
      bg: 'from-purple-500/20 to-purple-600/20',
      border: 'border-purple-500/30',
      icon: 'bg-purple-500/20 text-purple-400',
      value: 'text-purple-400',
      change: changeType === 'up' ? 'text-emerald-300' : 'text-red-300'
    }
  }

  const scheme = colorSchemes[color] || colorSchemes.blue

  return (
    <div className={`relative bg-gradient-to-br ${scheme.bg} backdrop-blur-xl border ${scheme.border} rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 overflow-hidden`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${scheme.icon} shadow-lg`}>
          {icon}
        </div>
        <div className={`text-xs font-semibold px-2 py-1 rounded-full bg-white/10 text-slate-300 uppercase tracking-wide`}>
          {changeType === 'up' ? '↗' : '↘'} {change}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-400 uppercase tracking-wide">{title}</p>
        <p className={`text-3xl font-bold ${scheme.value}`}>{value}</p>
        {description && (
          <p className="text-xs text-slate-500">{description}</p>
        )}
      </div>

      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  )
}