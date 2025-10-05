import { motion } from 'framer-motion'
import { 
  AlertTriangle, 
  TrendingUp, 
  Info, 
  CheckCircle,
  ArrowRight
} from 'lucide-react'

/**
 * ActionCard Component
 * Displays prioritized recommendations based on business data analysis
 */
function ActionCard({ recommendation }) {
  if (!recommendation) return null

  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-success-50',
      borderColor: 'border-success-200',
      iconColor: 'text-success-600',
      titleColor: 'text-success-900'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-warning-50',
      borderColor: 'border-warning-200',
      iconColor: 'text-warning-600',
      titleColor: 'text-warning-900'
    },
    danger: {
      icon: AlertTriangle,
      bgColor: 'bg-danger-50',
      borderColor: 'border-danger-200',
      iconColor: 'text-danger-600',
      titleColor: 'text-danger-900'
    },
    info: {
      icon: Info,
      bgColor: 'bg-primary-50',
      borderColor: 'border-primary-200',
      iconColor: 'text-primary-600',
      titleColor: 'text-primary-900'
    }
  }

  const config = typeConfig[recommendation.type] || typeConfig.info
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`card-elevated p-6 border-l-4 ${config.borderColor} ${config.bgColor}`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`p-3 rounded-lg bg-white shadow-sm flex-shrink-0`}>
          <Icon className={`w-6 h-6 ${config.iconColor}`} />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className={`text-lg font-bold ${config.titleColor}`}>
              {recommendation.title}
            </h3>
            <TrendingUp className={`w-5 h-5 ${config.iconColor}`} />
          </div>

          <p className="text-stone-700 mb-4 leading-relaxed">
            {recommendation.message}
          </p>

          {recommendation.action && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-stone-200">
              <span className="text-sm text-stone-600 font-medium">
                {recommendation.action.metric}
              </span>
              <button className="btn-primary text-sm flex items-center gap-2">
                {recommendation.action.label}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ActionCard



