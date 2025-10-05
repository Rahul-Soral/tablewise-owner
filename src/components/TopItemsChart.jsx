import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

/**
 * TopItemsChart Component
 * Bar chart showing top 5 selling items
 */
function TopItemsChart({ data }) {
  const colors = ['#3B82F6', '#14B8A6', '#F97316', '#22C55E', '#F59E0B']

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload
      return (
        <div className="bg-white p-3 rounded-lg shadow-elevation-md border border-stone-200">
          <p className="font-semibold text-stone-900 mb-1">{item.name}</p>
          <p className="text-sm text-stone-600">Sales: {item.quantity} units</p>
          <p className="text-sm text-stone-600">Revenue: ${item.revenue.toFixed(2)}</p>
        </div>
      )
    }
    return null
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-stone-500">
        No data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
        <XAxis 
          dataKey="name" 
          stroke="#78716C"
          style={{ fontSize: '12px' }}
          angle={-15}
          textAnchor="end"
          height={60}
        />
        <YAxis 
          stroke="#78716C"
          style={{ fontSize: '12px' }}
          label={{ value: 'Sales', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="quantity" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default TopItemsChart



