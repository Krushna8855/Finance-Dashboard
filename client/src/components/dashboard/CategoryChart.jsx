import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { CATEGORY_COLORS, fmt } from '../../utils/calculations'

export default function CategoryChart({ data }) {
  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }))

  return (
    <div className="w-full min-w-0">
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="46%"
            innerRadius={58}
            outerRadius={92}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry, i) => (
              <Cell
                key={i}
                fill={CATEGORY_COLORS[entry.name] || '#6366f1'}
                stroke="rgba(255,255,255,0.9)"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '16px',
              color: '#f8fafc',
              fontSize: 12,
              boxShadow: '0 18px 40px rgba(2, 6, 23, 0.25)',
            }}
            formatter={(value) => [fmt(value), '']}
            labelStyle={{ color: '#f8fafc' }}
          />
          <Legend
            wrapperStyle={{
              fontSize: 11,
              color: '#64748b',
              paddingTop: '12px',
            }}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}