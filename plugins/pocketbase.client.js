/**
 * PocketBase client plugin - Clean implementation
 * Initializes PocketBase client with proper auth persistence
 */

import PocketBase from 'pocketbase'

export default defineNuxtPlugin({
  name: 'pocketbase',
  setup() {
    const config = useRuntimeConfig()
    
    // Initialize PocketBase client
    const pb = new PocketBase(config.public.pocketbaseUrl)
    
    // Disable auto cancellation to prevent request issues
    pb.autoCancellation(false)
    
    // Only run on client side
    if (import.meta.client) {
      try {
        // Load stored auth data
        pb.authStore.loadFromCookie(document.cookie)
        
        // Set up auth persistence
        pb.authStore.onChange((token, model) => {
          if (token && model) {
            // Save auth data to cookie
            const authCookie = pb.authStore.exportToCookie({
              secure: location.protocol === 'https:',
              sameSite: 'lax',
              httpOnly: false
            })
            document.cookie = authCookie
          } else {
            // Clear auth cookie
            document.cookie = 'pb_auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
          }
        })
        
        // Try to refresh auth if valid
        if (pb.authStore.isValid) {
          pb.collection('users').authRefresh().catch(() => {
            // Clear invalid auth
            pb.authStore.clear()
          })
        }
        
      } catch (error) {
        console.error('Error initializing PocketBase auth:', error)
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
