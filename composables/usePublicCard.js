/**
 * Public card composable - SIMPLE: Just normalize to lowercase
 * Assumes usernames are stored in lowercase (from registration fix)
 */

export const usePublicCard = () => {
  /**
   * Fetch public card by username - SIMPLE: Normalize incoming username
   * @param {string} username - Username to lookup
   * @returns {Promise<Object|null>} Card data
   */
  const fetchPublicCard = async (username) => {
    try {
      const config = useRuntimeConfig()
      const baseUrl = config.public.pocketbaseUrl
      
      // SIMPLE FIX: Just normalize to lowercase before query
      const normalizedUsername = username.toLowerCase()
      
      console.log('Fetching public card for username:', username, '-> normalized:', normalizedUsername)
      
      const cardResponse = await $fetch(`${baseUrl}/api/collections/cards/records`, {
        query: {
          filter: `username='${normalizedUsername}' && is_active=true`,
          expand: 'user_id',
          perPage: 1
        }
      })
      
      console.log('Card API response:', cardResponse)
      
      if (!cardResponse.items || cardResponse.items.length === 0) {
        console.log('No active card found for username:', normalizedUsername)
        return null
      }
      
      const card = cardResponse.items[0]
      console.log('Found card:', card.id)
      
      // Create expand structure for compatibility with existing components
      if (!card.expand) {
        card.expand = {}
      }
      
      // If user_id expansion failed, create a minimal user object from card data
      if (!card.expand.user_id) {
        card.expand.user_id = {
          id: card.user_id,
          username: card.username
        }
      }
      
      return card
      
    } catch (error) {
      console.error('Error fetching public card:', error)
      
      // Log the specific error for debugging
      if (error.status === 400) {
        console.error('Filter error - check PocketBase permissions and filter syntax')
      } else if (error.status === 403) {
        console.error('Permission denied - check cards collection list rules')
      } else if (error.status === 404) {
        console.error('Collection not found - check PocketBase URL and collection name')
      }
      
      return null
    }
  }
  
  /**
   * Generate public card image URL
   * @param {Object} cardData - Card data
   * @returns {string} Image URL
   */
  const getPublicImageUrl = (cardData) => {
    if (!cardData?.profile_image || !cardData.id) {
      return ''
    }
    
    try {
      const config = useRuntimeConfig()
      const baseUrl = config.public.pocketbaseUrl
      
      // Construct proper PocketBase file URL
      const imageUrl = `${baseUrl}/api/files/cards/${cardData.id}/${cardData.profile_image}`
      console.log('Generated public image URL:', imageUrl)
      return imageUrl
    } catch (error) {
      console.error('Error generating public image URL:', error)
      return ''
    }
  }
  
  /**
   * Get public card share URL
   * @param {string} username - Username
   * @returns {string} Share URL
   */
  const getPublicShareUrl = (username) => {
    const config = useRuntimeConfig()
    return `${config.public.siteUrl}/users/${username}`
  }
  
  /**
   * Validate if a card is publicly accessible
   * @param {Object} cardData - Card data to validate
   * @returns {boolean} Is valid for public display
   */
  const isValidPublicCard = (cardData) => {
    if (!cardData) return false
    
    // Must have required fields
    const hasRequiredFields = cardData.first_name && 
                             cardData.last_name && 
                             cardData.is_active &&
                             cardData.username
    
    return hasRequiredFields
  }
  
  return {
    fetchPublicCard,
    getPublicImageUrl,
    getPublicShareUrl,
    isValidPublicCard
  }
}
