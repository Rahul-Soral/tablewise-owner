import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

/**
 * HourlyChart Component
 * Sparkline-style chart showing hourly order distribution
 */
function HourlyChart({ data }) {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const hour = payload[0].payload.hour
      const count = payload[0].value
      const timeLabel = hour === 0 ? '12 AM' : 
                       hour < 12 ? `${hour} AM` : 
                       hour === 12 ? '12 PM' : 
                       `${hour - 12} PM`
      
      return (
        <div className="bg-white p-2 rounded-lg shadow-elevation-md border border-stone-200">
          <p className="font-semibold text-stone-900 text-sm">{timeLabel}</p>
          <p className="text-sm text-stone-600">{count} orders</p>
        </div>
      )
    }
    return null
  }

  const formatXAxis = (hour) => {
    if (hour === 0) return '12a'
    if (hour < 12) return `${hour}a`
    if (hour === 12) return '12p'
    return `${hour - 12}p`
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-stone-500">
        No data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <defs>
          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
        <XAxis 
          dataKey="hour" 
          stroke="#78716C"
          style={{ fontSize: '10px' }}
          tickFormatter={formatXAxis}
          interval={2}
        />
        <YAxis 
          stroke="#78716C"
          style={{ fontSize: '10px' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area 
          type="monotone" 
          dataKey="count" 
          stroke="#3B82F6" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorCount)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default HourlyChart


