import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Pagination Component
 * Handles pagination controls
 * 
 * @param {number} currentPage - Current page (1-indexed)
 * @param {number} totalPages - Total number of pages
 * @param {function} onPageChange - Page change handler
 * @param {number} maxVisible - Maximum visible page buttons - default: 5
 * @param {string} className - Additional CSS classes
 * 
 * @example
 * <Pagination
 *   currentPage={2}
 *   totalPages={10}
 *   onPageChange={(page) => setCurrentPage(page)}
 * />
 */
function Pagination({ currentPage, totalPages, onPageChange, maxVisible = 5, className = '' }) {
  if (totalPages <= 1) return null

  const getVisiblePages = () => {
    const pages = []
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    return pages
  }

  const visiblePages = getVisiblePages()

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn-icon disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* First page if not visible */}
      {visiblePages[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="btn-ghost min-w-10 min-h-10"
          >
            1
          </button>
          {visiblePages[0] > 2 && (
            <span className="text-stone-500">...</span>
          )}
        </>
      )}

      {/* Page Numbers */}
      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`min-w-10 min-h-10 rounded-lg font-medium text-sm transition-colors ${
            page === currentPage
              ? 'bg-primary-600 text-white'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
          aria-label={`Page ${page}`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      {/* Last page if not visible */}
      {visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
            <span className="text-stone-500">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="btn-ghost min-w-10 min-h-10"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn-icon disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}

export default Pagination



