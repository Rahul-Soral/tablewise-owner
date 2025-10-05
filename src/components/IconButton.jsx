import { motion } from 'framer-motion'

/**
 * IconButton Component
 * Button with only an icon, includes hover and tap animations
 * 
 * @param {React.ReactNode} icon - Icon element to display
 * @param {function} onClick - Click handler
 * @param {string} variant - Color variant (primary, secondary, ghost, danger)
 * @param {string} size - Size (sm, md, lg) - default: md
 * @param {string} ariaLabel - Accessibility label (required)
 * @param {boolean} disabled - Whether button is disabled
 * @param {string} className - Additional CSS classes
 * 
 * @example
 * <IconButton 
 *   icon={<TrashIcon />} 
 *   onClick={handleDelete}
 *   ariaLabel="Delete item"
 *   variant="danger"
 * />
 */
function IconButton({ 
  icon, 
  onClick, 
  variant = 'ghost', 
  size = 'md', 
  ariaLabel,
  disabled = false,
  className = ''
}) {
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800',
    secondary: 'bg-stone-200 text-stone-800 hover:bg-stone-300 active:bg-stone-400',
    ghost: 'text-stone-700 hover:bg-stone-100 active:bg-stone-200',
    danger: 'bg-danger-500 text-white hover:bg-danger-600 active:bg-danger-700',
  }

  const sizes = {
    sm: 'p-1.5 min-w-8 min-h-8',
    md: 'p-2.5 min-w-11 min-h-11',
    lg: 'p-3 min-w-12 min-h-12',
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        inline-flex items-center justify-center rounded-lg font-medium
        transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
    >
      <span className={iconSizes[size]}>{icon}</span>
    </motion.button>
  )
}

export default IconButton



