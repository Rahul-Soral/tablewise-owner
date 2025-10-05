import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Users, UserPlus, Search, Phone, Mail, MapPin, ShoppingBag, DollarSign, RefreshCw } from 'lucide-react'
import { getCustomers } from '../config/api'
import { useToast } from '../components/Toast'

/**
 * Customers Page
 * Manage and view customer information from live API
 */
function Customers() {
  const { showToast } = useToast()
  const [customers, setCustomers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')

  // Fetch customers from API
  const fetchCustomersData = async () => {
    try {
      setIsLoading(true)
      const data = await getCustomers()
      setCustomers(data)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching customers:', error)
      showToast('Failed to fetch customers', 'error')
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomersData()
  }, [])

  // Filter and sort customers
  const filteredCustomers = useMemo(() => {
    let filtered = [...customers]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(customer =>
        customer.name?.toLowerCase().includes(query) ||
        customer.email?.toLowerCase().includes(query) ||
        customer.phone?.includes(query)
      )
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '')
        case 'orders':
          return (b.total_orders || 0) - (a.total_orders || 0)
        case 'revenue':
          return (b.total_spent || 0) - (a.total_spent || 0)
        default:
          return 0
      }
    })

    return filtered
  }, [customers, searchQuery, sortBy])

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
          <p className="text-stone-600 mt-1">
            {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <button 
          onClick={fetchCustomersData}
          className="btn-ghost flex items-center gap-2"
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </motion.div>

      {/* Search and Sort Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-elevated p-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              type="search"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 w-full"
              aria-label="Search customers by name, email, or phone"
            />
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input w-full"
              aria-label="Sort customers"
            >
              <option value="name">Sort by Name</option>
              <option value="orders">Sort by Orders</option>
              <option value="revenue">Sort by Revenue</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Customers List */}
      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card-elevated p-12 text-center"
        >
          <RefreshCw className="w-12 h-12 text-primary-600 mx-auto mb-4 animate-spin" />
          <p className="text-stone-600">Loading customers...</p>
        </motion.div>
      ) : filteredCustomers.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {filteredCustomers.map((customer, index) => (
            <motion.div
              key={customer.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card-elevated p-6 hover:shadow-lg transition-shadow"
            >
              {/* Customer Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900">{customer.name || 'Unknown'}</h3>
                    {customer.is_repeat && (
                      <span className="inline-block px-2 py-0.5 bg-success-100 text-success-700 text-xs font-medium rounded-full">
                        Repeat Customer
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div className="space-y-2 text-sm">
                {customer.phone && (
                  <div className="flex items-center gap-2 text-stone-600">
                    <Phone className="w-4 h-4" />
                    <span>{customer.phone}</span>
                  </div>
                )}
                {customer.email && (
                  <div className="flex items-center gap-2 text-stone-600">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                )}
                {customer.address && (
                  <div className="flex items-center gap-2 text-stone-600">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{customer.address}</span>
                  </div>
                )}
              </div>

              {/* Customer Stats */}
              <div className="mt-4 pt-4 border-t border-stone-200 grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-1 text-stone-500 text-xs mb-1">
                    <ShoppingBag className="w-3 h-3" />
                    <span>Orders</span>
                  </div>
                  <p className="text-lg font-semibold text-stone-900">{customer.total_orders || 0}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-stone-500 text-xs mb-1">
                    <DollarSign className="w-3 h-3" />
                    <span>Spent</span>
                  </div>
                  <p className="text-lg font-semibold text-stone-900">
                    ${(customer.total_spent || 0).toFixed(2)}
                  </p>
                </div>
              </div>

              {customer.last_order_date && (
                <div className="mt-3 text-xs text-stone-500">
                  Last order: {new Date(customer.last_order_date).toLocaleDateString()}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card-elevated p-12 text-center"
        >
          <Users className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-stone-900 mb-2">No customers found</h2>
          <p className="text-stone-600">
            {searchQuery ? 'Try adjusting your search query' : 'Customers will appear here once orders are placed'}
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default Customers



