import { Calendar } from 'lucide-react'
import { useState } from 'react'

/**
 * DateRangePicker Component
 * Simple date range picker
 * 
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {function} onChange - Change handler { startDate, endDate }
 * @param {Array} presets - Optional preset ranges [{ label, getValue: () => { start, end } }]
 * @param {string} className - Additional CSS classes
 * 
 * @example
 * <DateRangePicker
 *   startDate={startDate}
 *   endDate={endDate}
 *   onChange={({ startDate, endDate }) => {
 *     setStartDate(startDate)
 *     setEndDate(endDate)
 *   }}
 * />
 */
function DateRangePicker({ startDate, endDate, onChange, presets, className = '' }) {
  const [showPresets, setShowPresets] = useState(false)

  const defaultPresets = [
    {
      label: 'Today',
      getValue: () => {
        const now = new Date()
        now.setHours(0, 0, 0, 0)
        return { startDate: now, endDate: new Date() }
      }
    },
    {
      label: 'Last 7 Days',
      getValue: () => {
        const end = new Date()
        const start = new Date()
        start.setDate(start.getDate() - 7)
        return { startDate: start, endDate: end }
      }
    },
    {
      label: 'Last 30 Days',
      getValue: () => {
        const end = new Date()
        const start = new Date()
        start.setDate(start.getDate() - 30)
        return { startDate: start, endDate: end }
      }
    },
    {
      label: 'This Month',
      getValue: () => {
        const now = new Date()
        const start = new Date(now.getFullYear(), now.getMonth(), 1)
        return { startDate: start, endDate: now }
      }
    },
  ]

  const activePresets = presets || defaultPresets

  const formatDate = (date) => {
    if (!date) return ''
    return date.toISOString().split('T')[0]
  }

  return (
    <div className={`relative ${className}`}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
          <input
            type="date"
            value={formatDate(startDate)}
            onChange={(e) => onChange({ 
              startDate: e.target.value ? new Date(e.target.value) : null, 
              endDate 
            })}
            className="input pl-10 w-full"
            aria-label="Start date"
          />
        </div>
        <span className="flex items-center text-stone-500">to</span>
        <div className="relative flex-1">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
          <input
            type="date"
            value={formatDate(endDate)}
            onChange={(e) => onChange({ 
              startDate, 
              endDate: e.target.value ? new Date(e.target.value) : null 
            })}
            className="input pl-10 w-full"
            aria-label="End date"
          />
        </div>
      </div>

      {/* Presets */}
      {activePresets && (
        <div className="mt-2 flex flex-wrap gap-2">
          {activePresets.map((preset, index) => (
            <button
              key={index}
              onClick={() => {
                const dates = preset.getValue()
                onChange(dates)
              }}
              className="px-3 py-1.5 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default DateRangePicker



