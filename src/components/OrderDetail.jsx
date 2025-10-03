import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  User, 
  Phone, 
  MapPin, 
  Clock, 
  DollarSign,
  MessageCircle,
  RotateCcw,
  Package,
  FileText
} from 'lucide-react'
import { useTimer } from '../hooks/useTimer'

/**
 * OrderDetail Component
 * Slide-over panel showing complete order details
 * Includes customer contact, items with modifiers, timestamps, and quick actions
 */
function OrderDetail({ order, isOpen, onClose }) {
  const elapsed = useTimer(order?.createdAt)

  if (!order) return null

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hi ${order.customerName}, your order #${order.id} is ready for pickup! Thank you for your order.`
    )
    const phone = order.customerPhone.replace(/[^0-9]/g, '')
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
  }

  const handleRepeatOrder = () => {
    // TODO: Implement repeat order functionality
    console.log('Repeat order:', order.id)
    alert('Repeat order feature coming soon!')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose()
    }
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
            className="fixed inset-0 bg-black/50 z-overlay"
            aria-hidden="true"
          />

          {/* Slide-over Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white shadow-elevation-xl z-modal overflow-hidden flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-detail-title"
            onKeyDown={handleKeyDown}
          >
            {/* Header */}
            <div className="bg-primary-600 text-white p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 id="order-detail-title" className="text-2xl font-bold">
                    Order #{order.id}
                  </h2>
                  {order.table && (
                    <p className="text-primary-100 text-sm mt-1">
                      Table {order.table}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-primary-700 rounded-lg transition-colors"
                  aria-label="Close order details"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Timer */}
              <div className="flex items-center gap-2 text-primary-50">
                <Clock className="w-5 h-5" />
                <span className="text-lg font-semibold">{elapsed}</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-custom">
              {/* Customer Information */}
              <div className="p-6 border-b border-stone-200">
                <h3 className="text-lg font-semibold text-stone-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Customer Information
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-stone-600">Name</p>
                    <p className="text-base font-medium text-stone-900">
                      {order.customerName}
                    </p>
                  </div>

                  {order.customerPhone && (
                    <div>
                      <p className="text-sm text-stone-600">Phone</p>
                      <a
                        href={`tel:${order.customerPhone}`}
                        className="text-base font-medium text-primary-600 hover:text-primary-700 flex items-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        {order.customerPhone}
                      </a>
                    </div>
                  )}

                  {order.customerAddress && (
                    <div>
                      <p className="text-sm text-stone-600">Address</p>
                      <p className="text-base text-stone-900 flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                        <span>{order.customerAddress}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => window.location.href = `tel:${order.customerPhone}`}
                    className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm"
                    data-testid="call-button"
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </button>
                  <button
                    onClick={handleWhatsApp}
                    className="bg-success-500 hover:bg-success-600 text-white px-4 py-2 rounded-lg font-medium flex-1 flex items-center justify-center gap-2 text-sm transition-colors"
                    data-testid="whatsapp-button"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </button>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6 border-b border-stone-200">
                <h3 className="text-lg font-semibold text-stone-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Items
                </h3>

                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-stone-900">
                            {item.quantity}x
                          </span>
                          <span className="text-stone-900">{item.name}</span>
                        </div>
                        
                        {/* Modifiers */}
                        {item.modifiers && item.modifiers.length > 0 && (
                          <ul className="mt-1 ml-6 space-y-1">
                            {item.modifiers.map((modifier, modIndex) => (
                              <li key={modIndex} className="text-sm text-stone-600">
                                + {modifier}
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Special Instructions */}
                        {item.specialInstructions && (
                          <p className="mt-1 ml-6 text-sm text-stone-500 italic">
                            Note: {item.specialInstructions}
                          </p>
                        )}
                      </div>

                      <span className="font-semibold text-stone-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Totals */}
                <div className="mt-6 pt-4 border-t border-stone-200 space-y-2">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  {order.tax > 0 && (
                    <div className="flex justify-between text-stone-600">
                      <span>Tax</span>
                      <span>${order.tax.toFixed(2)}</span>
                    </div>
                  )}
                  {order.deliveryFee > 0 && (
                    <div className="flex justify-between text-stone-600">
                      <span>Delivery Fee</span>
                      <span>${order.deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold text-stone-900 pt-2 border-t border-stone-300">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                  {order.margin && (
                    <div className="flex justify-between text-sm text-success-600 font-semibold">
                      <span>Estimated Margin</span>
                      <span>${order.margin.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Timestamps */}
              <div className="p-6 border-b border-stone-200">
                <h3 className="text-lg font-semibold text-stone-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Timeline
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600">Order Placed</span>
                    <span className="font-medium text-stone-900">
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {order.acceptedAt && (
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-600">Accepted</span>
                      <span className="font-medium text-stone-900">
                        {new Date(order.acceptedAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {order.preparingAt && (
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-600">Started Preparing</span>
                      <span className="font-medium text-stone-900">
                        {new Date(order.preparingAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {order.readyAt && (
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-600">Ready</span>
                      <span className="font-medium text-stone-900">
                        {new Date(order.readyAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {order.servedAt && (
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-600">Served</span>
                      <span className="font-medium text-stone-900">
                        {new Date(order.servedAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="p-6 border-b border-stone-200">
                  <h3 className="text-lg font-semibold text-stone-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Order Notes
                  </h3>
                  <p className="text-stone-700 bg-stone-50 p-4 rounded-lg">
                    {order.notes}
                  </p>
                </div>
              )}

              {/* Repeat Order */}
              <div className="p-6">
                <button
                  onClick={handleRepeatOrder}
                  className="w-full btn-secondary flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Repeat This Order
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default OrderDetail

