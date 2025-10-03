import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect } from 'react'

/**
 * SlideOver Component
 * Slide-over panel from the right side
 * 
 * @param {boolean} isOpen - Whether slide-over is open
 * @param {function} onClose - Close handler
 * @param {string} title - Panel title
 * @param {React.ReactNode} children - Panel content
 * @param {string} size - Size (sm, md, lg, xl) - default: md
 * @param {boolean} closeOnBackdrop - Close on backdrop click - default: true
 * @param {boolean} closeOnEscape - Close on Escape key - default: true
 * 
 * @example
 * <SlideOver
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   title="Order Details"
 *   size="lg"
 * >
 *   <OrderDetailContent order={selectedOrder} />
 * </SlideOver>
 */
function SlideOver({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true
}) {
  const sizes = {
    sm: 'w-full sm:w-96',
    md: 'w-full sm:w-[480px]',
    lg: 'w-full sm:w-[640px]',
    xl: 'w-full sm:w-[768px]',
  }

  // Handle Escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, closeOnEscape, onClose])

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnBackdrop ? onClose : undefined}
            className="fixed inset-0 bg-black/50 z-overlay"
            aria-hidden="true"
          />

          {/* Slide-over Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed right-0 top-0 h-full bg-white shadow-elevation-xl z-modal overflow-hidden flex flex-col ${sizes[size]}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="slideover-title"
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between p-6 border-b border-stone-200 flex-shrink-0">
                <h2 id="slideover-title" className="text-2xl font-bold text-stone-900">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="btn-icon"
                  aria-label="Close panel"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-custom">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default SlideOver


