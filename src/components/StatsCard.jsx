import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'

/**
 * StatsCard Component
 * Displays a metric with icon, value, and trend indicator
 * Uses design system tokens for consistent styling
 */
function StatsCard({ title, value, change, trend, icon: Icon, color, bgColor }) {
  return (
    <div className="card-elevated p-6 hover:shadow-elevation-lg transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-stone-600">{title}</p>
          <p className="text-2xl font-bold text-stone-900 mt-2">{value}</p>
          
          {/* Trend Indicator */}
          {change && (
            <div className="flex items-center gap-1 mt-2">
              {trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-success-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-danger-500" />
              )}
              <span className={`text-sm font-medium ${
                trend === 'up' ? 'text-success-600' : 'text-danger-600'
              }`}>
                {change}
              </span>
              <span className="text-xs text-stone-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        
        {/* Icon */}
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  )
}

export default StatsCard

