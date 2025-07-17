/**
 * Pocketbase composable for consistent API access - Lifecycle Safe
 * Provides reactive access to Pocketbase client and auth state
 */

// Global reactive auth state that persists across page loads
const globalUser = ref(null)
const globalAuthState = ref(false)
let isInitialized = false

export const usePocketbase = () => {
  // Get Nuxt app context safely
  const nuxtApp = useNuxtApp()
  
  // Check if we're on client side and have the plugin
  const pb = import.meta.client && nuxtApp.$pb ? nuxtApp.$pb : null
  
  // Use global state for auth persistence
  const user = globalUser
  const isAuthenticated = computed(() => globalAuthState.value && globalUser.value !== null)
  
  // Initialize auth state from Pocketbase on client (only once)
  if (import.meta.client && pb && !isInitialized) {
    isInitialized = true
    
    // Set initial state from Pocketbase auth store
    globalUser.value = pb.authStore.model
    globalAuthState.value = pb.authStore.isValid
    
    console.log('Initializing global auth state:', {
      hasUser: !!globalUser.value,
      isValid: globalAuthState.value,
      username: globalUser.value?.username
    })
    
    // Listen for auth changes and update global state
    pb.authStore.onChange((token, model) => {
      console.log('Auth store changed, updating global state:', {
        hasToken: !!token,
        hasModel: !!model,
        username: model?.username
      })
      
      globalUser.value = model
      globalAuthState.value = pb.authStore.isValid
    })
  }
  
  /**
   * Login with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User data
   */
  const login = async (email, password) => {
    if (!pb) {
      throw new Error('Pocketbase client not available')
    }
    
    try {
      console.log('Attempting login for:', email)
      const authData = await pb.collection('users').authWithPassword(email, password)
      
      // Update global state
      globalUser.value = authData.record
      globalAuthState.value = true
      
      console.log('Login successful:', {
        username: authData.record.username,
        id: authData.record.id
      })
      
      return authData.record
    } catch (error) {
      console.error('Login failed:', error)
      throw new Error(error.message || 'Login failed')
    }
  }
  
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} User data
   */
  const register = async (userData) => {
    if (!pb) {
      throw new Error('Pocketbase client not available')
    }
    
    try {
      console.log('Attempting registration for:', userData.username)
      
      // Create the user
      const record = await pb.collection('users').create(userData)
      
      // Auto-login after registration
      const authData = await pb.collection('users').authWithPassword(userData.email, userData.password)
      
      // Update global state
      globalUser.value = authData.record
      globalAuthState.value = true
      
      console.log('Registration and login successful:', {
        username: authData.record.username,
        id: authData.record.id
      })
      
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
    
    console.log('Logging out user:', globalUser.value?.username)
    
    pb.authStore.clear()
    
    // Clear global state
    globalUser.value = null
    globalAuthState.value = false
    
    // Navigate to login only on client
    if (import.meta.client) {
      navigateTo('/login')
    }
  }
  
  /**
   * Get current user data
   * @returns {Object|null} Current user or null
   */
  const getCurrentUser = () => {
    if (!pb) return globalUser.value
    return pb.authStore.model || globalUser.value
  }
  
  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  const checkAuth = () => {
    if (!pb) return globalAuthState.value
    return pb.authStore.isValid
  }
  
  /**
   * Refresh authentication
   * @returns {Promise<boolean>} Success status
   */
  const refreshAuth = async () => {
    if (!pb) return false
    
    try {
      if (pb.authStore.isValid) {
        console.log('Refreshing auth token...')
        await pb.collection('users').authRefresh()
        
        // Update global state
        globalUser.value = pb.authStore.model
        globalAuthState.value = pb.authStore.isValid
        
        console.log('Auth refresh successful')
        return true
      }
      return false
    } catch (error) {
      console.error('Auth refresh failed:', error)
      
      // Clear invalid auth
      pb.authStore.clear()
      globalUser.value = null
      globalAuthState.value = false
      
      return false
    }
  }
  
  return {
    // Pocketbase client (can be null on server)
    pb,
    
    // Reactive state (global, persists across page loads)
    user: readonly(user),
    isAuthenticated,
    
    // Authentication methods
    login,
    register,
    logout,
    getCurrentUser,
    checkAuth,
    refreshAuth
  }
}
