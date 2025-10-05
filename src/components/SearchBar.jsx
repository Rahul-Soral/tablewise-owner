import { Search, X } from 'lucide-react'
import { useState } from 'react'

/**
 * SearchBar Component
 * Search input with clear button
 * 
 * @param {string} value - Current search value
 * @param {function} onChange - Change handler
 * @param {string} placeholder - Placeholder text
 * @param {function} onClear - Optional clear handler
 * @param {string} className - Additional CSS classes
 * 
 * @example
 * <SearchBar
 *   value={searchQuery}
 *   onChange={(value) => setSearchQuery(value)}
 *   placeholder="Search orders..."
 * />
 */
function SearchBar({ value, onChange, placeholder = 'Search...', onClear, className = '' }) {
  const handleClear = () => {
    onChange('')
    onClear?.()
  }

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 pointer-events-none" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input pl-10 pr-10 w-full"
        aria-label={placeholder}
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-stone-100 rounded-md transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4 text-stone-500" />
        </button>
      )}
    </div>
  )
}

export default SearchBar



