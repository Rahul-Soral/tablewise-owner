/**
 * Badge Component
 * Displays a badge with different color variants
 * 
 * @param {React.ReactNode} children - Badge content
 * @param {string} variant - Color variant (primary, success, warning, danger, accent, gray)
 * @param {string} size - Size (sm, md, lg) - default: md
 * @param {boolean} pill - Whether to use pill style (fully rounded)
 * @param {React.ReactNode} icon - Optional icon to display before text
 * 
 * @example
 * <Badge variant="primary">New</Badge>
 * <Badge variant="success" icon={<CheckIcon />}>Verified</Badge>
 * <Badge variant="danger" pill>3</Badge>
 */
function Badge({ children, variant = 'primary', size = 'md', pill = false, icon }) {
  const variants = {
    primary: 'bg-primary-100 text-primary-700 border-primary-200',
    success: 'bg-success-100 text-success-700 border-success-200',
    warning: 'bg-warning-100 text-warning-700 border-warning-200',
    danger: 'bg-danger-100 text-danger-700 border-danger-200',
    accent: 'bg-accent-100 text-accent-700 border-accent-200',
    gray: 'bg-stone-100 text-stone-700 border-stone-200',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  }

  return (
    <span 
      className={`inline-flex items-center gap-1 font-medium border ${
        pill ? 'rounded-full' : 'rounded-md'
      } ${variants[variant]} ${sizes[size]}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  )
}

export default Badge


