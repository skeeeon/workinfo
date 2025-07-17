/**
 * Authentication composable
 * Handles user authentication flows and validation
 */

export const useAuth = () => {
  const { login, register, logout, user, isAuthenticated, pb } = usePocketbase()
  
  // Loading states
  const isLoading = ref(false)
  const error = ref(null)
  
  /**
   * Login user with validation
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<boolean>} Success status
   */
  const loginUser = async (credentials) => {
    isLoading.value = true
    error.value = null
    
    try {
      // Validate input
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required')
      }
      
      await login(credentials.email, credentials.password)
      
      // Redirect to dashboard after successful login
      await navigateTo('/dashboard')
      return true
      
    } catch (err) {
      error.value = err.message
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * Register new user with validation
   * @param {Object} userData - Registration data
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @param {string} userData.passwordConfirm - Password confirmation
   * @param {string} userData.username - Unique username
   * @returns {Promise<boolean>} Success status
   */
  const registerUser = async (userData) => {
    isLoading.value = true
    error.value = null
    
    try {
      // Validate input
      if (!userData.email || !userData.password || !userData.username) {
        throw new Error('Email, password, and username are required')
      }
      
      if (userData.password !== userData.passwordConfirm) {
        throw new Error('Passwords do not match')
      }
      
      if (userData.password.length < 8) {
        throw new Error('Password must be at least 8 characters long')
      }
      
      // Check if username is available
      const existingUser = await checkUsernameAvailability(userData.username)
      if (!existingUser) {
        throw new Error('Username is already taken')
      }
      
      await register(userData)
      
      // Redirect to dashboard after successful registration
      await navigateTo('/dashboard')
      return true
      
    } catch (err) {
      error.value = err.message
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * Check if username is available
   * @param {string} username - Username to check
   * @returns {Promise<boolean>} True if available
   */
  const checkUsernameAvailability = async (username) => {
    try {
      const records = await pb.collection('users').getList(1, 1, {
        filter: `username = "${username}"`
      })
      return records.items.length === 0
    } catch (error) {
      console.error('Username check failed:', error)
      return false
    }
  }
  
  /**
   * Logout user
   */
  const logoutUser = () => {
    logout()
    error.value = null
  }
  
  /**
   * Clear any authentication errors
   */
  const clearError = () => {
    error.value = null
  }
  
  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} Valid email format
   */
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  
  /**
   * Validate username format
   * @param {string} username - Username to validate
   * @returns {boolean} Valid username format
   */
  const validateUsername = (username) => {
    // Username must be 3-20 characters, alphanumeric and underscores only
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
    return usernameRegex.test(username)
  }
  
  return {
    // State
    user,
    isAuthenticated,
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // Actions
    loginUser,
    registerUser,
    logoutUser,
    clearError,
    checkUsernameAvailability,
    
    // Validation
    validateEmail,
    validateUsername
  }
}
