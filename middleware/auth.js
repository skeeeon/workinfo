/**
 * Authentication middleware - Clean version
 * Protects routes that require authentication
 */

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only run on client side after hydration
  if (import.meta.server) return
  
  const { isAuthenticated, pb, refreshAuth } = usePocketbase()
  
  console.log('Auth middleware checking:', {
    route: to.path,
    isAuthenticated: isAuthenticated.value,
    hasPb: !!pb
  })
  
  // If we have a Pocketbase client, try to refresh auth if needed
  if (pb && pb.authStore.isValid) {
    try {
      await refreshAuth()
    } catch (error) {
      console.warn('Auth refresh failed in middleware:', error)
    }
  }
  
  // Check authentication after potential refresh
  if (!isAuthenticated.value) {
    console.log('User not authenticated, redirecting to login')
    return navigateTo('/login')
  }
  
  console.log('User authenticated, allowing access to:', to.path)
})
