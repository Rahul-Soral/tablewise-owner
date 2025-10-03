import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * DataTable Component
 * Responsive table that switches to card layout on mobile
 * 
 * @param {Array} data - Array of data objects
 * @param {Array} columns - Column definitions [{ key, label, render?, sortable? }]
 * @param {function} onRowClick - Optional row click handler
 * @param {string} emptyMessage - Message when no data
 * @param {boolean} loading - Loading state
 * @param {string} className - Additional CSS classes
 * 
 * @example
 * const columns = [
 *   { key: 'id', label: 'ID', sortable: true },
 *   { key: 'name', label: 'Name', sortable: true },
 *   { 
 *     key: 'status', 
 *     label: 'Status',
 *     render: (row) => <StatusChip status={row.status} />
 *   }
 * ]
 * 
 * <DataTable
 *   data={orders}
 *   columns={columns}
 *   onRowClick={(row) => handleSelect(row)}
 * />
 */
function DataTable({ 
  data, 
  columns, 
  onRowClick,
  emptyMessage = 'No data available',
  loading = false,
  className = ''
}) {
  const [sortKey, setSortKey] = useState(null)
  const [sortDirection, setSortDirection] = useState('asc')

  const handleSort = (key) => {
    const column = columns.find(col => col.key === key)
    if (!column?.sortable) return

    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0

    const aVal = a[sortKey]
    const bVal = b[sortKey]

    if (aVal === bVal) return 0
    
    const comparison = aVal < bVal ? -1 : 1
    return sortDirection === 'asc' ? comparison : -comparison
  })

  if (loading) {
    return (
      <div className="card-elevated p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="card-elevated p-6">
        <p className="text-center text-stone-600 py-12">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className={`hidden md:block card-elevated overflow-x-auto ${className}`}>
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-200">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`text-left py-3 px-4 font-semibold text-sm text-stone-700 ${
                    column.sortable ? 'cursor-pointer hover:text-stone-900' : ''
                  }`}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && sortKey === column.key && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="w-4 h-4" /> : 
                        <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => onRowClick?.(row)}
                className={`border-b border-stone-100 hover:bg-stone-50 transition-colors ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
              >
                {columns.map((column) => (
                  <td key={column.key} className="py-3 px-4 text-sm text-stone-700">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {sortedData.map((row, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onRowClick?.(row)}
            className={`card-elevated p-4 ${onRowClick ? 'cursor-pointer active:scale-98' : ''}`}
          >
            {columns.map((column) => (
              <div key={column.key} className="flex justify-between items-center py-2 border-b border-stone-100 last:border-0">
                <span className="text-sm font-medium text-stone-600">
                  {column.label}
                </span>
                <span className="text-sm text-stone-900">
                  {column.render ? column.render(row) : row[column.key]}
                </span>
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </>
  )
}

export default DataTable


