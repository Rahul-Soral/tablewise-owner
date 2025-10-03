/**
 * LoadingSkeleton Component
 * Animated loading placeholder
 * 
 * @param {string} variant - Skeleton type (text, circle, rectangle, card)
 * @param {number} count - Number of skeletons to render - default: 1
 * @param {string} width - Width (CSS value)
 * @param {string} height - Height (CSS value)
 * @param {string} className - Additional CSS classes
 * 
 * @example
 * <LoadingSkeleton variant="text" count={3} />
 * <LoadingSkeleton variant="card" />
 * <LoadingSkeleton variant="circle" width="48px" height="48px" />
 */
function LoadingSkeleton({ variant = 'text', count = 1, width, height, className = '' }) {
  const baseClass = 'animate-pulse bg-stone-200 rounded'

  const variants = {
    text: 'h-4 rounded-md',
    circle: 'rounded-full',
    rectangle: 'rounded-lg',
    card: 'h-32 rounded-lg',
  }

  const variantClass = variants[variant] || variants.text

  const style = {
    ...(width && { width }),
    ...(height && { height }),
  }

  const Skeleton = () => (
    <div
      className={`${baseClass} ${variantClass} ${className}`}
      style={style}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )

  if (count === 1) {
    return <Skeleton />
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} />
      ))}
    </div>
  )
}

export default LoadingSkeleton


