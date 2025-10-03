import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

/**
 * RevenueChart Component
 * Displays revenue trends using Recharts
 */
function RevenueChart() {
  // TODO: Fetch real data from API
  const data = [
    { month: 'Jan', revenue: 4000 },
    { month: 'Feb', revenue: 3000 },
    { month: 'Mar', revenue: 5000 },
    { month: 'Apr', revenue: 4500 },
    { month: 'May', revenue: 6000 },
    { month: 'Jun', revenue: 5500 },
    { month: 'Jul', revenue: 7000 },
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
        <XAxis 
          dataKey="month" 
          stroke="#78716C"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#78716C"
          style={{ fontSize: '12px' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #E7E5E4',
            borderRadius: '8px',
          }}
        />
        <Line 
          type="monotone" 
          dataKey="revenue" 
          stroke="#3B82F6" 
          strokeWidth={2}
          dot={{ fill: '#3B82F6', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default RevenueChart

