/**
 * Guest middleware - Clean implementation
 * Redirects authenticated users away from auth pages
 */

export default defineNuxtRouteMiddleware((to, from) => {
  // Only run on client side
  if (import.meta.server) return
  
  const { isAuthenticated } = usePocketbase()
  
  // If authenticated, redirect to dashboard
  if (isAuthenticated.value) {
    return navigateTo('/dashboard')
  }
})
