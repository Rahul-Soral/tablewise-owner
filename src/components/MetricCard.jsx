import { motion } from 'framer-motion'

/**
 * MetricCard Component
 * Displays a single metric with icon and optional comparison
 */
function MetricCard({ title, value, icon: Icon, trend, comparison, color = 'primary' }) {
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    success: 'bg-success-100 text-success-600',
    warning: 'bg-warning-100 text-warning-600',
    accent: 'bg-accent-100 text-accent-600',
    teal: 'bg-teal-100 text-teal-600'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-elevated p-6 hover:shadow-elevation-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-stone-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-stone-900">{value}</p>
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {(trend || comparison) && (
        <div className="flex items-center gap-2 text-sm">
          {trend && (
            <span className={`font-semibold ${
              trend.direction === 'up' ? 'text-success-600' : 'text-danger-600'
            }`}>
              {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
            </span>
          )}
          {comparison && (
            <span className="text-stone-500">{comparison}</span>
          )}
        </div>
      )}
    </motion.div>
  )
}

export default MetricCard


