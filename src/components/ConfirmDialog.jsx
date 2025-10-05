import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'

/**
 * ConfirmDialog Component
 * Accessible confirmation dialog for critical actions
 */
function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false 
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-overlay"
            aria-hidden="true"
          />

          {/* Dialog */}
          <div className="fixed inset-0 flex items-center justify-center z-modal p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-xl shadow-elevation-xl max-w-md w-full"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="dialog-title"
              aria-describedby="dialog-description"
              onKeyDown={handleKeyDown}
            >
              {/* Header */}
              <div className="flex items-start justify-between p-6 pb-4">
                <div className="flex items-center gap-3">
                  {isDanger && (
                    <div className="p-2 bg-danger-100 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-danger-600" />
                    </div>
                  )}
                  <h2 id="dialog-title" className="text-xl font-bold text-stone-900">
                    {title}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="btn-icon -mr-2"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 pb-6">
                <p id="dialog-description" className="text-stone-600">
                  {message}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 p-6 pt-0">
                <button
                  onClick={onClose}
                  className="btn-secondary flex-1"
                  autoFocus
                >
                  {cancelText}
                </button>
                <button
                  onClick={handleConfirm}
                  className={isDanger ? 'bg-danger-500 hover:bg-danger-600 text-white px-6 py-2 rounded-lg font-medium flex-1 transition-colors' : 'btn-primary flex-1'}
                >
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ConfirmDialog



