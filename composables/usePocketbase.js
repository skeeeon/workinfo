/**
 * Pocketbase composable for consistent API access
 * Provides reactive access to Pocketbase client and auth state
 */

export const usePocketbase = () => {
  const { $pb } = useNuxtApp()
  
  // Reactive auth state
  const user = ref($pb.authStore.model)
  const isAuthenticated = computed(() => $pb.authStore.isValid)
  
  // Update user state when auth changes
  $pb.authStore.onChange(() => {
    user.value = $pb.authStore.model
  })
  
  /**
   * Login with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User data
   */
  const login = async (email, password) => {
    try {
      const authData = await $pb.collection('users').authWithPassword(email, password)
      user.value = authData.record
      return authData.record
    } catch (error) {
      throw new Error(error.message || 'Login failed')
    }
  }
  
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} User data
   */
  const register = async (userData) => {
    try {
      // Create the user
      const record = await $pb.collection('users').create(userData)
      
      // Auto-login after registration
      const authData = await $pb.collection('users').authWithPassword(userData.email, userData.password)
      user.value = authData.record
      
      return authData.record
    } catch (error) {
      throw new Error(error.message || 'Registration failed')
    }
  }
  
  /**
   * Logout current user
   */
  const logout = () => {
    $pb.authStore.clear()
    user.value = null
    navigateTo('/login')
  }
  
  /**
   * Get current user data
   * @returns {Object|null} Current user or null
   */
  const getCurrentUser = () => {
    return $pb.authStore.model
  }
  
  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  const checkAuth = () => {
    return $pb.authStore.isValid
  }
  
  /**
   * Refresh authentication
   * @returns {Promise<boolean>} Success status
   */
  const refreshAuth = async () => {
    try {
      if ($pb.authStore.isValid) {
        await $pb.collection('users').authRefresh()
        return true
      }
      return false
    } catch (error) {
      console.error('Auth refresh failed:', error)
      return false
    }
  }
  
  return {
    // Pocketbase client
    pb: $pb,
    
    // Reactive state
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
