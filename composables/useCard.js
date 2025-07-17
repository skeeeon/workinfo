/**
 * Card management composable
 * Handles business card CRUD operations and utilities
 */

export const useCard = () => {
  const { pb, user } = usePocketbase()
  
  // Loading and error states
  const isLoading = ref(false)
  const error = ref(null)
  
  /**
   * Get user's card
   * @param {string} userId - User ID (optional, defaults to current user)
   * @returns {Promise<Object|null>} Card data or null
   */
  const getUserCard = async (userId = null) => {
    try {
      const targetUserId = userId || user.value?.id
      if (!targetUserId) return null
      
      const records = await pb.collection('cards').getList(1, 1, {
        filter: `user_id = "${targetUserId}" && is_active = true`,
        expand: 'user_id'
      })
      
      return records.items[0] || null
    } catch (err) {
      console.error('Error fetching user card:', err)
      return null
    }
  }
  
  /**
   * Get card by username
   * @param {string} username - Username to lookup
   * @returns {Promise<Object|null>} Card data or null
   */
  const getCardByUsername = async (username) => {
    try {
      // First get the user by username
      const userRecords = await pb.collection('users').getList(1, 1, {
        filter: `username = "${username}"`
      })
      
      if (userRecords.items.length === 0) return null
      
      const targetUser = userRecords.items[0]
      
      // Then get their card
      const cardRecords = await pb.collection('cards').getList(1, 1, {
        filter: `user_id = "${targetUser.id}" && is_active = true`,
        expand: 'user_id'
      })
      
      return cardRecords.items[0] || null
    } catch (err) {
      console.error('Error fetching card by username:', err)
      return null
    }
  }
  
  /**
   * Create or update user's card
   * @param {Object} cardData - Card data
   * @returns {Promise<Object|null>} Updated card data
   */
  const saveCard = async (cardData) => {
    isLoading.value = true
    error.value = null
    
    try {
      if (!user.value) {
        throw new Error('User not authenticated')
      }
      
      // Get existing card
      const existingCard = await getUserCard()
      
      // Prepare data for save
      const saveData = {
        user_id: user.value.id,
        ...cardData,
        is_active: true
      }
      
      let result
      if (existingCard) {
        // Update existing card
        result = await pb.collection('cards').update(existingCard.id, saveData)
      } else {
        // Create new card
        result = await pb.collection('cards').create(saveData)
      }
      
      return result
      
    } catch (err) {
      error.value = err.message
      console.error('Error saving card:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * Upload profile image
   * @param {File} file - Image file
   * @returns {Promise<string|null>} File URL or null
   */
  const uploadProfileImage = async (file) => {
    if (!user.value) return null
    
    try {
      // Get or create card first
      let card = await getUserCard()
      
      if (!card) {
        // Create minimal card if doesn't exist
        card = await pb.collection('cards').create({
          user_id: user.value.id,
          first_name: '',
          last_name: '',
          company: '',
          is_active: true
        })
      }
      
      // Update with image
      const formData = new FormData()
      formData.append('profile_image', file)
      
      const result = await pb.collection('cards').update(card.id, formData)
      
      // Return the image URL
      return pb.files.getUrl(result, result.profile_image)
      
    } catch (err) {
      console.error('Error uploading image:', err)
      return null
    }
  }
  
  /**
   * Delete card
   * @returns {Promise<boolean>} Success status
   */
  const deleteCard = async () => {
    try {
      if (!user.value) return false
      
      const card = await getUserCard()
      if (!card) return false
      
      await pb.collection('cards').delete(card.id)
      return true
      
    } catch (err) {
      console.error('Error deleting card:', err)
      return false
    }
  }
  
  /**
   * Generate vCard content
   * @param {Object} cardData - Card data
   * @returns {string} vCard formatted string
   */
  const generateVCard = (cardData) => {
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${cardData.first_name} ${cardData.last_name}`,
      `N:${cardData.last_name};${cardData.first_name};;;`,
      cardData.company ? `ORG:${cardData.company}` : '',
      cardData.title ? `TITLE:${cardData.title}` : '',
      cardData.email ? `EMAIL:${cardData.email}` : '',
      cardData.mobile ? `TEL;TYPE=CELL:${cardData.mobile}` : '',
      cardData.office ? `TEL;TYPE=WORK:${cardData.office}` : '',
      cardData.website ? `URL:${cardData.website}` : '',
      cardData.note ? `NOTE:${cardData.note}` : '',
      'END:VCARD'
    ].filter(Boolean).join('\n')
    
    return vcard
  }
  
  /**
   * Generate download link for vCard
   * @param {Object} cardData - Card data
   * @returns {string} Data URL for vCard download
   */
  const generateVCardDownloadUrl = (cardData) => {
    const vcard = generateVCard(cardData)
    const blob = new Blob([vcard], { type: 'text/vcard' })
    return URL.createObjectURL(blob)
  }
  
  /**
   * Get card share URL
   * @param {string} username - Username
   * @returns {string} Public card URL
   */
  const getCardShareUrl = (username) => {
    const config = useRuntimeConfig()
    return `${config.public.siteUrl}/users/${username}`
  }
  
  /**
   * Get profile image URL
   * @param {Object} cardData - Card data
   * @returns {string} Image URL or empty string
   */
  const getProfileImageUrl = (cardData) => {
    if (!cardData?.profile_image) return ''
    return pb.files.getUrl(cardData, cardData.profile_image)
  }
  
  /**
   * Validate card data
   * @param {Object} cardData - Card data to validate
   * @returns {Object} Validation result
   */
  const validateCard = (cardData) => {
    const errors = {}
    
    if (!cardData.first_name?.trim()) {
      errors.first_name = 'First name is required'
    }
    
    if (!cardData.last_name?.trim()) {
      errors.last_name = 'Last name is required'
    }
    
    if (!cardData.company?.trim()) {
      errors.company = 'Company is required'
    }
    
    if (cardData.email && !validateEmail(cardData.email)) {
      errors.email = 'Invalid email format'
    }
    
    if (cardData.mobile && !validatePhone(cardData.mobile)) {
      errors.mobile = 'Invalid phone format'
    }
    
    if (cardData.office && !validatePhone(cardData.office)) {
      errors.office = 'Invalid phone format'
    }
    
    if (cardData.website && !validateURL(cardData.website)) {
      errors.website = 'Invalid URL format'
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
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
   * Validate phone format
   * @param {string} phone - Phone to validate
   * @returns {boolean} Valid phone format
   */
  const validatePhone = (phone) => {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/
    return phoneRegex.test(phone)
  }
  
  /**
   * Validate URL format
   * @param {string} url - URL to validate
   * @returns {boolean} Valid URL format
   */
  const validateURL = (url) => {
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`)
      return true
    } catch {
      return false
    }
  }
  
  return {
    // State
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // Card operations
    getUserCard,
    getCardByUsername,
    saveCard,
    deleteCard,
    uploadProfileImage,
    
    // Utilities
    generateVCard,
    generateVCardDownloadUrl,
    getCardShareUrl,
    getProfileImageUrl,
    validateCard,
    
    // Validation helpers
    validateEmail,
    validatePhone,
    validateURL
  }
}
