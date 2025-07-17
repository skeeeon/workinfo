/**
 * Authentication composable - Clean implementation
 * Handles user authentication with proper validation
 */

import { ref, readonly } from 'vue'

export const useAuth = () => {
  const { login, register, logout, user, isAuthenticated } = usePocketbase()
  
  // Loading and error state
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
      if (!credentials.email?.trim() || !credentials.password?.trim()) {
        throw new Error('Email and password are required')
      }
      
      // Perform login
      await login(credentials.email, credentials.password)
      
      // Navigate to dashboard on success
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
   * @returns {Promise<boolean>} Success status
   */
  const registerUser = async (userData) => {
    isLoading.value = true
    error.value = null
    
    try {
      // Validate required fields
      const { email, password, passwordConfirm, username } = userData
      
      if (!email?.trim() || !password?.trim() || !username?.trim()) {
        throw new Error('All fields are required')
      }
      
      if (password !== passwordConfirm) {
        throw new Error('Passwords do not match')
      }
      
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters')
      }
      
      if (!isValidUsername(username)) {
        throw new Error('Username must be 3-20 characters, alphanumeric and underscores only')
      }
      
      if (!isValidEmail(email)) {
        throw new Error('Invalid email format')
      }
      
      // Perform registration
      await register(userData)
      
      // Navigate to dashboard on success
      await navigateTo('/dashboard')
      return true
      
    } catch (err) {
      // Handle specific PocketBase errors
      if (err.message.includes('username')) {
        error.value = 'Username already taken'
      } else if (err.message.includes('email')) {
        error.value = 'Email already registered'
      } else {
        error.value = err.message
      }
      return false
    } finally {
      isLoading.value = false
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
   * Clear error state
   */
  const clearError = () => {
    error.value = null
  }
  
  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} Is valid email
   */
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  
  /**
   * Validate username format
   * @param {string} username - Username to validate
   * @returns {boolean} Is valid username
   */
  const isValidUsername = (username) => {
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
    
    // Validation
    isValidEmail,
    isValidUsername
  }
}
