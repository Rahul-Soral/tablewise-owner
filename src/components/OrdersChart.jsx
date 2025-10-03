import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

/**
 * OrdersChart Component
 * Displays order statistics using Recharts
 */
function OrdersChart() {
  // TODO: Fetch real data from API
  const data = [
    { month: 'Jan', completed: 240, pending: 40, cancelled: 10 },
    { month: 'Feb', completed: 200, pending: 30, cancelled: 8 },
    { month: 'Mar', completed: 300, pending: 50, cancelled: 15 },
    { month: 'Apr', completed: 280, pending: 45, cancelled: 12 },
    { month: 'May', completed: 350, pending: 60, cancelled: 18 },
    { month: 'Jun', completed: 320, pending: 55, cancelled: 14 },
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
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
        <Legend />
        <Bar dataKey="completed" fill="#22C55E" radius={[4, 4, 0, 0]} />
        <Bar dataKey="pending" fill="#F59E0B" radius={[4, 4, 0, 0]} />
        <Bar dataKey="cancelled" fill="#EF4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default OrdersChart

