/**
 * Pocketbase client plugin for Nuxt
 * Initializes Pocketbase client and provides it globally
 */

import PocketBase from 'pocketbase'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  // Initialize Pocketbase client
  const pb = new PocketBase(config.public.pocketbaseUrl)
  
  // Enable auto cancellation for pending requests
  pb.autoCancellation(false)
  
  // Load the stored auth data from localStorage
  if (import.meta.client) {
    pb.authStore.loadFromCookie(document.cookie)
  }
  
  // Provide the client globally
  return {
    provide: {
      pb
    }
  }
})
