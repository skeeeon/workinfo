/**
 * Pocketbase client plugin for Nuxt - Auth Persistence Fix
 * Initializes Pocketbase client and provides it globally with proper auth persistence
 */

import PocketBase from 'pocketbase'

export default defineNuxtPlugin({
  name: 'pocketbase',
  async setup() {
    const config = useRuntimeConfig()
    
    // Initialize Pocketbase client
    const pb = new PocketBase(config.public.pocketbaseUrl)
    
    // Disable auto cancellation to prevent request cancellation issues
    pb.autoCancellation(false)
    
    // Only load auth from storage on client side
    if (import.meta.client) {
      try {
        // Load the stored auth data from localStorage (Pocketbase default)
        pb.authStore.loadFromCookie(document.cookie)
        
        // If we have auth data, try to refresh it to ensure it's still valid
        if (pb.authStore.isValid && pb.authStore.token) {
          try {
            console.log('Attempting to refresh auth token...')
            await pb.collection('users').authRefresh()
            console.log('Auth token refreshed successfully')
          } catch (refreshError) {
            console.warn('Auth refresh failed, clearing auth store:', refreshError)
            pb.authStore.clear()
          }
        }
        
        // Set up auth store change listener to save to cookie
        pb.authStore.onChange((token, model) => {
          console.log('Auth state changed:', { hasToken: !!token, hasModel: !!model })
          
          // Save auth data to cookie for persistence across page loads
          if (typeof document !== 'undefined') {
            if (token && model) {
              // Set cookie with auth data
              const authCookie = pb.authStore.exportToCookie({ 
                secure: location.protocol === 'https:',
                sameSite: 'lax',
                httpOnly: false // Must be false for client access
              })
              document.cookie = authCookie
            } else {
              // Clear auth cookie
              document.cookie = 'pb_auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
            }
          }
        })
        
        console.log('Pocketbase auth initialized. Current auth state:', {
          isValid: pb.authStore.isValid,
          hasModel: !!pb.authStore.model,
          username: pb.authStore.model?.username
        })
        
      } catch (err) {
        console.error('Error initializing Pocketbase auth:', err)
        pb.authStore.clear()
      }
    }
    
    return {
      provide: {
        pb
      }
    }
  }
})
