import { motion } from 'framer-motion'
import { TrendingUp, ShoppingBag, DollarSign, Users } from 'lucide-react'
import StatsCard from '../components/StatsCard'
import RevenueChart from '../components/RevenueChart'

/**
 * Dashboard Page
 * Main overview page with key metrics and charts
 */
function Dashboard() {
  // TODO: Fetch real data from API
  const stats = [
    {
      title: 'Total Revenue',
      value: '$12,345',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-success-600',
      bgColor: 'bg-success-100',
    },
    {
      title: 'Total Orders',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingBag,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
    },
    {
      title: 'Active Customers',
      value: '567',
      change: '+15.3%',
      trend: 'up',
      icon: Users,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100',
    },
    {
      title: 'Growth Rate',
      value: '24.5%',
      change: '+3.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-accent-600',
      bgColor: 'bg-accent-100',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-stone-900">Dashboard</h1>
        <p className="text-stone-600 mt-1">Welcome back! Here's your business overview.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card-elevated p-6"
        >
          <h2 className="text-xl font-semibold mb-4 text-stone-900">Revenue Overview</h2>
          <RevenueChart />
        </motion.div>

        {/* TODO: Add more charts or widgets */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="card-elevated p-6"
        >
          <h2 className="text-xl font-semibold mb-4 text-stone-900">Recent Activity</h2>
          <div className="space-y-4">
            <p className="text-stone-600">Activity feed coming soon...</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard

