/**
 * Card management composable - Fixed image URL generation
 * Handles business card CRUD operations with proper PocketBase URLs
 */

import { ref, readonly } from 'vue'

export const useCard = () => {
  const { pb, user } = usePocketbase()
  
  // Loading state
  const isLoading = ref(false)
  const error = ref(null)
  
  /**
   * Get user's card
   * @param {string} userId - Optional user ID (defaults to current user)
   * @returns {Promise<Object|null>} Card data
   */
  const getUserCard = async (userId = null) => {
    if (!pb) return null
    
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
   * Save card (create or update)
   * @param {Object} cardData - Card data to save
   * @returns {Promise<Object|null>} Saved card data
   */
  const saveCard = async (cardData) => {
    if (!pb || !user.value) return null
    
    isLoading.value = true
    error.value = null
    
    try {
      // Get existing card
      const existingCard = await getUserCard()
      
      // Prepare data
      const saveData = {
        user_id: user.value.id,
        ...cardData,
        is_active: true
      }
      
      let result
      if (existingCard) {
        // Update existing
        result = await pb.collection('cards').update(existingCard.id, saveData)
      } else {
        // Create new
        result = await pb.collection('cards').create(saveData)
      }
      
      console.log('Card saved successfully:', result.id)
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
   * @returns {Promise<Object|null>} Updated card record
   */
  const uploadProfileImage = async (file) => {
    if (!pb || !user.value) return null
    
    try {
      console.log('Starting image upload for file:', file.name)
      
      // Get or create card
      let card = await getUserCard()
      
      if (!card) {
        console.log('No existing card, creating new one')
        // Create minimal card if doesn't exist
        card = await pb.collection('cards').create({
          user_id: user.value.id,
          first_name: '',
          last_name: '',
          company: '',
          is_active: true
        })
      }
      
      console.log('Uploading image to card:', card.id)
      
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('profile_image', file)
      
      // Update card with image
      const result = await pb.collection('cards').update(card.id, formData)
      
      console.log('Image uploaded successfully:', result.profile_image)
      return result
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
    if (!pb || !user.value) return false
    
    try {
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
   * Generate profile image URL - FIXED VERSION
   * @param {Object} cardData - Card data
   * @returns {string} Image URL
   */
  const getProfileImageUrl = (cardData) => {
    if (!cardData?.profile_image || !cardData.id) {
      // Return empty string if there's no image or card ID
      return '';
    }

    try {
      const config = useRuntimeConfig();
      // Correctly use the pocketbaseUrl defined in nuxt.config.ts
      const baseUrl = config.public.pocketbaseUrl;

      // Construct the full, valid URL for the Pocketbase file
      const imageUrl = `${baseUrl}/api/files/cards/${cardData.id}/${cardData.profile_image}`;
    
      return imageUrl;
    } catch (err) {
      console.error('Error generating image URL:', err);
      return '';
    }
  };

  /**
   * Generate vCard content
   * @param {Object} cardData - Card data
   * @returns {string} vCard content
   */
  const generateVCard = (cardData) => {
    const lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${cardData.first_name} ${cardData.last_name}`,
      `N:${cardData.last_name};${cardData.first_name};;;`
    ]
    
    // Add optional fields
    if (cardData.company) lines.push(`ORG:${cardData.company}`)
    if (cardData.title) lines.push(`TITLE:${cardData.title}`)
    if (cardData.email) lines.push(`EMAIL:${cardData.email}`)
    if (cardData.mobile) lines.push(`TEL;TYPE=CELL:${cardData.mobile}`)
    if (cardData.office) lines.push(`TEL;TYPE=WORK:${cardData.office}`)
    if (cardData.website) lines.push(`URL:${cardData.website}`)
    if (cardData.note) lines.push(`NOTE:${cardData.note}`)
    
    lines.push('END:VCARD')
    
    return lines.join('\n')
  }
  
  /**
   * Generate vCard download URL
   * @param {Object} cardData - Card data
   * @returns {string} Download URL
   */
  const generateVCardDownloadUrl = (cardData) => {
    const vcard = generateVCard(cardData)
    const blob = new Blob([vcard], { type: 'text/vcard' })
    return URL.createObjectURL(blob)
  }
  
  /**
   * Get card share URL
   * @param {string} username - Username
   * @returns {string} Share URL
   */
  const getCardShareUrl = (username) => {
    const config = useRuntimeConfig()
    return `${config.public.siteUrl}/users/${username}`
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
    
    if (cardData.email && !isValidEmail(cardData.email)) {
      errors.email = 'Invalid email format'
    }
    
    if (cardData.website && !isValidUrl(cardData.website)) {
      errors.website = 'Invalid website URL'
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }
  
  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} Is valid
   */
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  
  /**
   * Validate URL format
   * @param {string} url - URL to validate
   * @returns {boolean} Is valid
   */
  const isValidUrl = (url) => {
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
    saveCard,
    deleteCard,
    uploadProfileImage,
    
    // Utilities
    getProfileImageUrl,
    generateVCard,
    generateVCardDownloadUrl,
    getCardShareUrl,
    validateCard,
    
    // Validation
    isValidEmail,
    isValidUrl
  }
}
