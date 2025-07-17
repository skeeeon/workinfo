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
      
      // Validate username format
      if (!validateUsername(userData.username)) {
        throw new Error('Username must be 3-20 characters, letters, numbers, and underscores only')
      }
      
      // Try to register - Pocketbase will handle username uniqueness validation
      await register(userData)
      
      // Redirect to dashboard after successful registration
      await navigateTo('/dashboard')
      return true
      
    } catch (err) {
      // Handle specific Pocketbase errors
      if (err.message.includes('username')) {
        error.value = 'Username is already taken. Please choose a different one.'
      } else if (err.message.includes('email')) {
        error.value = 'Email is already registered. Please use a different email or try logging in.'
      } else {
        error.value = err.message
      }
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * Check if username is available (simplified version)
   * This now only validates format, not availability
   * Actual availability is checked server-side during registration
   * @param {string} username - Username to check
   * @returns {Promise<boolean>} True if format is valid
   */
  const checkUsernameAvailability = async (username) => {
    // Only validate format client-side
    // Actual availability will be checked during registration
    return validateUsername(username)
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
