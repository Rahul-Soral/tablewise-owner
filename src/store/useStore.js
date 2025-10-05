import { create } from 'zustand'

/**
 * Global state store using Zustand
 * Manages application-wide state including orders, user data, and UI state
 */
const useStore = create((set) => ({
  // Orders state
  orders: [],
  isLoadingOrders: false,
  ordersError: null,
  
  // User state
  user: null,
  
  // UI state
  sidebarOpen: true,
  
  // Actions
  setOrders: (orders) => set({ orders }),
  setIsLoadingOrders: (isLoading) => set({ isLoadingOrders: isLoading }),
  setOrdersError: (error) => set({ ordersError: error }),
  
  setUser: (user) => set({ user }),
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen }),
  
  // Update specific order status
  updateOrderStatus: (orderId, newStatus) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ),
    })),
  
  // Reset store (useful for logout)
  reset: () => set({
    orders: [],
    isLoadingOrders: false,
    ordersError: null,
    user: null,
  }),
}))

export default useStore



