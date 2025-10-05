/**
 * SmallSparkline Component
 * Minimal inline chart for showing trends
 * 
 * @param {Array} data - Array of numbers
 * @param {string} color - Line color (CSS color) - default: primary-600
 * @param {number} width - Width in pixels - default: 100
 * @param {number} height - Height in pixels - default: 30
 * @param {string} className - Additional CSS classes
 * 
 * @example
 * <SmallSparkline data={[10, 20, 15, 25, 30]} color="#3B82F6" />
 */
function SmallSparkline({ data, color = '#3B82F6', width = 100, height = 30, className = '' }) {
  if (!data || data.length === 0) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  // Generate SVG path
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width
    const y = height - ((value - min) / range) * height
    return `${x},${y}`
  }).join(' ')

  return (
    <svg
      width={width}
      height={height}
      className={`inline-block ${className}`}
      aria-label="Trend sparkline"
      role="img"
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default SmallSparkline



