import { useState, useCallback } from 'react'
import { useToast } from '../components/Toast'

/**
 * useOptimisticUpdate Hook
 * Handles optimistic UI updates with rollback on failure
 * 
 * @param {function} updateFn - Async function that performs the update
 * @param {function} onSuccess - Optional success callback
 * @param {function} onError - Optional error callback
 * 
 * @example
 * const { execute, isLoading } = useOptimisticUpdate(
 *   async (orderId, status) => {
 *     return await updateOrderStatus(orderId, status)
 *   },
 *   () => console.log('Success!'),
 *   (error) => console.error('Failed:', error)
 * )
 * 
 * // In your component:
 * const handleStatusChange = (orderId, newStatus) => {
 *   // Optimistic update
 *   updateStoreStatus(orderId, newStatus)
 *   
 *   // Call API with rollback
 *   execute(orderId, newStatus, () => {
 *     // Rollback function if API fails
 *     updateStoreStatus(orderId, oldStatus)
 *   })
 * }
 */
export function useOptimisticUpdate(updateFn, onSuccess, onError) {
  const [isLoading, setIsLoading] = useState(false)
  const { showToast } = useToast()

  const execute = useCallback(
    async (rollbackFn, ...args) => {
      setIsLoading(true)

      try {
        // Execute the update
        const result = await updateFn(...args)
        
        // Success
        showToast('Update successful', 'success', 3000)
        onSuccess?.(result)
        
        return result
      } catch (error) {
        console.error('Optimistic update failed:', error)
        
        // Rollback
        if (typeof rollbackFn === 'function') {
          rollbackFn()
        }
        
        // Show error toast
        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'Update failed. Please try again.'
        showToast(errorMessage, 'error', 5000)
        
        onError?.(error)
        
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [updateFn, onSuccess, onError, showToast]
  )

  return { execute, isLoading }
}

/**
 * Example usage in a component:
 * 
 * ```jsx
 * import { useOptimisticUpdate } from '../hooks/useOptimisticUpdate'
 * import { updateOrderStatus } from '../config/api'
 * import useStore from '../store/useStore'
 * 
 * function OrderCard({ order }) {
 *   const { updateOrderStatus: updateStoreStatus } = useStore()
 *   
 *   const { execute, isLoading } = useOptimisticUpdate(
 *     updateOrderStatus,
 *     () => console.log('Order updated successfully'),
 *     (error) => console.error('Failed to update order:', error)
 *   )
 *   
 *   const handleStatusChange = (newStatus) => {
 *     const oldStatus = order.status
 *     
 *     // Optimistic update - update UI immediately
 *     updateStoreStatus(order.id, newStatus)
 *     
 *     // Call API with rollback function
 *     execute(
 *       // Rollback function
 *       () => updateStoreStatus(order.id, oldStatus),
 *       // API call args
 *       order.id,
 *       newStatus
 *     )
 *   }
 *   
 *   return (
 *     <div>
 *       <button 
 *         onClick={() => handleStatusChange('accepted')}
 *         disabled={isLoading}
 *       >
 *         Accept Order
 *       </button>
 *     </div>
 *   )
 * }
 * ```
 */


