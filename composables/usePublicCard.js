/**
 * Public card composable - SSR-compatible data fetching
 * Uses direct HTTP calls to PocketBase REST API for public data
 */

export const usePublicCard = () => {
  /**
   * Fetch public card by username - SSR compatible
   * @param {string} username - Username to lookup
   * @returns {Promise<Object|null>} Card data
   */
  const fetchPublicCard = async (username) => {
    try {
      const config = useRuntimeConfig()
      const baseUrl = config.public.pocketbaseUrl
      
      console.log('Fetching public card for username:', username)
      
      // Step 1: Get user by username using direct API call
      const userResponse = await $fetch(`${baseUrl}/api/collections/users/records`, {
        query: {
          filter: `username="${username}"`,
          perPage: 1
        }
      })
      
      console.log('User API response:', userResponse)
      
      if (!userResponse.items || userResponse.items.length === 0) {
        console.log('No user found with username:', username)
        return null
      }
      
      const user = userResponse.items[0]
      console.log('Found user:', user.id)
      
      // Step 2: Get user's active card using direct API call
      const cardResponse = await $fetch(`${baseUrl}/api/collections/cards/records`, {
        query: {
          filter: `user_id="${user.id}" && is_active=true`,
          expand: 'user_id',
          perPage: 1
        }
      })
      
      console.log('Card API response:', cardResponse)
      
      if (!cardResponse.items || cardResponse.items.length === 0) {
        console.log('No active card found for user:', user.id)
        return null
      }
      
      const card = cardResponse.items[0]
      console.log('Found card:', card.id)
      
      // Ensure proper expand structure
      if (!card.expand) {
        card.expand = { user_id: user }
      }
      
      return card
      
    } catch (error) {
      console.error('Error fetching public card:', error)
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
  
  return {
    fetchPublicCard,
    getPublicImageUrl,
    getPublicShareUrl
  }
}
