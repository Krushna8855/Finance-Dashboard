import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { fmt } from '../../utils/calculations'

export default function BalanceChart({ data }) {
  return (
    <div className="w-full min-w-0">
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#64748b" opacity={0.18} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={{ stroke: '#cbd5e1' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickFormatter={(value) => fmt(value)}
            axisLine={{ stroke: '#cbd5e1' }}
            tickLine={false}
            width={96}
          />
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
              fontSize: 12,
              color: '#64748b',
              paddingTop: '14px',
            }}
          />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#dbeafe' }}
            activeDot={{ r: 6, fill: '#3b82f6' }}
            name="Income"
          />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#f43f5e"
            strokeWidth={3}
            dot={{ r: 4, fill: '#f43f5e', strokeWidth: 2, stroke: '#ffe4e6' }}
            activeDot={{ r: 6, fill: '#f43f5e' }}
            name="Expenses"
          />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#10b981"
            strokeWidth={3}
            strokeDasharray="8 4"
            dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#d1fae5' }}
            activeDot={{ r: 6, fill: '#10b981' }}
            name="Balance"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}