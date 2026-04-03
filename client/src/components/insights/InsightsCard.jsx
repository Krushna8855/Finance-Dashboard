export default function InsightsCard({ icon, label, value, desc, valueColor, progress, progressColor }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-sm transition-shadow">
      <div className="text-2xl mb-3">{icon}</div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-bold mb-2 ${valueColor || 'text-slate-800'}`}>{value}</p>
      <p className="text-sm text-slate-500 leading-relaxed" dangerouslySetInnerHTML={{ __html: desc }} />
      {progress !== undefined && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Progress</span><span>{progress.toFixed(0)}%</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, progress)}%`, background: progressColor || '#3b82f6' }} />
          </div>
        </div>
      )}
    </div>
  )
}