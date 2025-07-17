/**
 * PocketBase composable - Fixed SSR hydration issues
 * Handles authentication with proper client-side initialization
 */

import { ref, computed, readonly } from 'vue'

// Global state for auth persistence
const globalUser = ref(null)
const globalAuthValid = ref(false)
const isClientReady = ref(false)

export const usePocketbase = () => {
  // Get PocketBase client from Nuxt plugin (client-side only)
  const nuxtApp = useNuxtApp()
  const pb = import.meta.client ? nuxtApp.$pb : null
  
  // Reactive auth state
  const user = globalUser
  const isAuthenticated = computed(() => {
    // Only return true if we're on client and have valid auth
    return import.meta.client && globalAuthValid.value && globalUser.value !== null
  })
  
  /**
   * Initialize auth state (client-side only)
   */
  const initializeAuth = () => {
    if (import.meta.client && pb && !isClientReady.value) {
      console.log('Initializing PocketBase auth state')
      
      // Set initial state from PocketBase auth store
      globalUser.value = pb.authStore.model
      globalAuthValid.value = pb.authStore.isValid
      isClientReady.value = true
      
      console.log('Auth state initialized:', {
        hasUser: !!globalUser.value,
        isValid: globalAuthValid.value
      })
      
      // Listen for auth changes
      pb.authStore.onChange((token, model) => {
        console.log('Auth state changed:', {
          hasToken: !!token,
          hasModel: !!model
        })
        
        globalUser.value = model
        globalAuthValid.value = pb.authStore.isValid
      })
      
      // Try to refresh auth if valid
      if (pb.authStore.isValid) {
        pb.collection('users').authRefresh().catch((error) => {
          console.warn('Auth refresh failed:', error)
          pb.authStore.clear()
        })
      }
    }
  }
  
  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Auth record
   */
  const login = async (email, password) => {
    if (!pb) throw new Error('PocketBase client not available')
    
    try {
      console.log('Logging in user:', email)
      const authData = await pb.collection('users').authWithPassword(email, password)
      console.log('Login successful')
      return authData.record
    } catch (error) {
      console.error('Login failed:', error)
      throw new Error(error.message || 'Login failed')
    }
  }
  
  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Auth record
   */
  const register = async (userData) => {
    if (!pb) throw new Error('PocketBase client not available')
    
    try {
      console.log('Registering user:', userData.username)
      
      // Create user
      await pb.collection('users').create(userData)
      
      // Auto-login after registration
      const authData = await pb.collection('users').authWithPassword(userData.email, userData.password)
      console.log('Registration and login successful')
      return authData.record
    } catch (error) {
      console.error('Registration failed:', error)
      throw new Error(error.message || 'Registration failed')
    }
  }
  
  /**
   * Logout current user
   */
  const logout = () => {
    if (!pb) return
    
    console.log('Logging out user')
    pb.authStore.clear()
    
    // Navigate to login if on client
    if (import.meta.client) {
      navigateTo('/login')
    }
  }
  
  /**
   * Refresh authentication token
   * @returns {Promise<boolean>} Success status
   */
  const refreshAuth = async () => {
    if (!pb || !pb.authStore.isValid) return false
    
    try {
      console.log('Refreshing auth token')
      await pb.collection('users').authRefresh()
      return true
    } catch (error) {
      console.warn('Auth refresh failed:', error)
      pb.authStore.clear()
      return false
    }
  }
  
  // Initialize auth when composable is used
  if (import.meta.client) {
    initializeAuth()
  }
  
  return {
    // Client and state
    pb,
    user: readonly(user),
    isAuthenticated,
    isClientReady: readonly(isClientReady),
    
    // Auth methods
    login,
    register,
    logout,
    refreshAuth,
    initializeAuth
  }
}
