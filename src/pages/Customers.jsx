import { motion } from 'framer-motion'
import { Users, UserPlus } from 'lucide-react'

/**
 * Customers Page
 * Manage and view customer information
 */
function Customers() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Customers</h1>
          <p className="text-stone-600 mt-1">View and manage your customer base</p>
        </div>
        
        <button className="btn-primary flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Add Customer
        </button>
      </motion.div>

      {/* TODO: Add customer list and management features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-elevated p-12 text-center"
      >
        <Users className="w-16 h-16 text-stone-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-stone-900 mb-2">Customer Management</h2>
        <p className="text-stone-600">
          Customer list and management features coming soon...
        </p>
      </motion.div>
    </div>
  )
}

export default Customers


