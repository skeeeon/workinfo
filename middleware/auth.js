/**
 * Authentication middleware - Clean implementation
 * Protects routes that require authentication
 */

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only run on client side
  if (import.meta.server) return
  
  const { isAuthenticated, refreshAuth } = usePocketbase()
  
  // Try to refresh auth if needed
  if (!isAuthenticated.value) {
    try {
      await refreshAuth()
    } catch (error) {
      // Refresh failed, proceed with redirect
    }
  }
  
  // Check authentication status
  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }
})
