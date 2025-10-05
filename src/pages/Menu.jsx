import { motion } from 'framer-motion'
import { UtensilsCrossed, Plus } from 'lucide-react'

/**
 * Menu Page
 * Manage restaurant menu items and categories
 */
function Menu() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Menu</h1>
          <p className="text-stone-600 mt-1">Manage your menu items and categories</p>
        </div>
        
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Menu Item
        </button>
      </motion.div>

      {/* TODO: Add menu management features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-elevated p-12 text-center"
      >
        <UtensilsCrossed className="w-16 h-16 text-stone-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-stone-900 mb-2">Menu Management</h2>
        <p className="text-stone-600">
          Menu items and category management features coming soon...
        </p>
      </motion.div>
    </div>
  )
}

export default Menu



