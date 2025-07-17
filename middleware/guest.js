/**
 * Guest middleware - Clean version
 * Redirects authenticated users away from auth pages
 */

export default defineNuxtRouteMiddleware((to, from) => {
  // Only run on client side after hydration
  if (import.meta.server) return
  
  const { isAuthenticated } = usePocketbase()
  
  console.log('Guest middleware checking:', {
    route: to.path,
    isAuthenticated: isAuthenticated.value
  })
  
  // If authenticated, redirect to dashboard
  if (isAuthenticated.value) {
    console.log('User is authenticated, redirecting to dashboard')
    return navigateTo('/dashboard')
  }
  
  console.log('User not authenticated, allowing access to:', to.path)
})
