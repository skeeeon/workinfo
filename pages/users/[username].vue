<template>
  <div class="public-card-page">
    <!-- Loading state -->
    <div v-if="pending" class="loading-state">
      <div class="spinner"></div>
      <p class="loading-text">Loading business card...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="!cardData || !isValidCard" class="error-state">
      <div class="error-icon">
        <MagnifyingGlassIcon class="w-12 h-12" />
      </div>
      <h1 class="error-title">Card Not Found</h1>
      <p class="error-message">
        The business card for "{{ username }}" doesn't exist or may have been removed.
      </p>
      <div class="error-actions">
        <NuxtLink to="/" class="btn btn-primary">
          Visit Hivecard
        </NuxtLink>
        <NuxtLink to="/register" class="btn btn-outlined">
          Create Your Card
        </NuxtLink>
      </div>
    </div>

    <!-- Card content -->
    <div v-else class="card-content">
      <div class="card-container">
        <BusinessCard 
          :card="cardData" 
          :is-preview="false"
          @show-qr="showQRModal = true" 
        />
      </div>

      <!-- QR Code Modal -->
      <QRCodeModal 
        :show="showQRModal"
        :card-url="cardShareUrl"
        :card-title="cardTitle"
        @close="showQRModal = false"
      />
      
      <!-- Powered by footer -->
      <div class="powered-by">
        <p class="powered-text">
          Powered by 
          <NuxtLink to="/" class="powered-link">
            Hivecard
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Public business card page - Fixed with better error handling
 * Uses optimized single-query approach for better performance
 */

// Define layout
definePageMeta({
  layout: 'card'
})

// Import icons
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

// Composables
const { fetchPublicCard, getPublicShareUrl, isValidPublicCard } = usePublicCard()
const { loadColorsFromCard } = useTheme()
const route = useRoute()

// Get username from route
const username = computed(() => route.params.username)

// State
const showQRModal = ref(false)

// Fetch card data with better error handling
const { data: cardData, pending, error, refresh } = await useLazyAsyncData(
  `public-card-${username.value}`,
  async () => {
    try {
      console.log('Fetching card for username:', username.value)
      
      if (!username.value || typeof username.value !== 'string') {
        console.error('Invalid username:', username.value)
        return null
      }
      
      const result = await fetchPublicCard(username.value)
      console.log('Fetch result:', result)
      
      return result
    } catch (fetchError) {
      console.error('Error in fetch function:', fetchError)
      // Return null instead of throwing to prevent 500 error
      return null
    }
  },
  {
    default: () => null,
    server: true, // Enable SSR
    transform: (data) => {
      console.log('Transform received data:', data)
      return data
    }
  }
)

// Validation
const isValidCard = computed(() => {
  const isValid = isValidPublicCard(cardData.value)
  console.log('Card validation result:', isValid, cardData.value)
  return isValid
})

// Computed properties
const cardShareUrl = computed(() => {
  if (!cardData.value || !username.value) return ''
  return getPublicShareUrl(username.value)
})

const cardTitle = computed(() => {
  if (!cardData.value) return 'Business Card'
  const name = `${cardData.value.first_name} ${cardData.value.last_name}`.trim()
  return `${name} - ${cardData.value.company || 'Business Card'}`
})

const displayName = computed(() => {
  if (!cardData.value) return ''
  return `${cardData.value.first_name} ${cardData.value.last_name}`.trim()
})

// Handle 404 for unknown cards after data is loaded
watchEffect(() => {
  // Only throw 404 after loading is complete and we have no valid card
  if (!pending.value && !error.value && !isValidCard.value && cardData.value !== undefined) {
    console.log('Card not found, throwing 404 for username:', username.value)
    throw createError({
      statusCode: 404,
      statusMessage: `Business card not found for username: ${username.value}`
    })
  }
})

// Apply custom theme colors when card loads
watchEffect(() => {
  if (cardData.value && isValidCard.value) {
    console.log('Loading colors from card')
    loadColorsFromCard(cardData.value)
  }
})

// Dynamic SEO based on card data
watchEffect(() => {
  if (cardData.value && isValidCard.value) {
    const description = cardData.value.note || 
      `Connect with ${displayName.value}, ${cardData.value.title || 'Professional'} at ${cardData.value.company || 'their company'}.`
    
    const title = `${displayName.value} - ${cardData.value.title || 'Professional'} | Hivecard`
    
    useSeoMeta({
      title,
      description,
      ogTitle: `${displayName.value} - Digital Business Card`,
      ogDescription: description,
      ogType: 'profile',
      ogUrl: cardShareUrl.value,
      twitterCard: 'summary_large_image',
      twitterTitle: title,
      twitterDescription: description,
      // Add structured data using script tag instead
      script: [{
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: displayName.value,
          jobTitle: cardData.value.title,
          worksFor: cardData.value.company ? {
            '@type': 'Organization',
            name: cardData.value.company
          } : undefined,
          description: cardData.value.note,
          email: cardData.value.email,
          telephone: cardData.value.mobile || cardData.value.office,
          url: cardData.value.website
        })
      }]
    })
  } else {
    // Default SEO for loading/error states
    useSeoMeta({
      title: `@${username.value} - Hivecard`,
      description: `View ${username.value}'s digital business card on Hivecard.`,
      robots: 'noindex, nofollow'
    })
  }
})

// Debug logging
onMounted(() => {
  console.log('=== PUBLIC CARD PAGE DEBUG ===')
  console.log('Username:', username.value)
  console.log('Pending:', pending.value)
  console.log('Error:', error.value)
  console.log('Card data:', cardData.value)
  console.log('Is valid card:', isValidCard.value)
  console.log('Runtime config:', useRuntimeConfig().public)
  console.log('================================')
  
  // Test direct API call
  if (import.meta.client) {
    testDirectFetch()
  }
})

// Test function to verify API access
const testDirectFetch = async () => {
  try {
    const config = useRuntimeConfig()
    const testUrl = `${config.public.pocketbaseUrl}/api/collections/cards/records?filter=username='${username.value}'%26%26is_active=true`
    console.log('Testing direct fetch to:', testUrl)
    
    const response = await fetch(testUrl)
    const data = await response.json()
    console.log('Direct fetch result:', { status: response.status, data })
  } catch (err) {
    console.error('Direct fetch failed:', err)
  }
}
</script>

<style scoped>
/* Main container */
.public-card-page {
  min-height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
}

/* Loading state */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-border-primary);
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: var(--color-content-secondary);
}

/* Error state */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 500px;
}

.error-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: rgba(245, 158, 11, 0.1);
  color: var(--color-warning);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-content-primary);
  margin-bottom: 1rem;
}

.error-message {
  color: var(--color-content-secondary);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

/* Card content */
.card-content {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-container {
  width: 100%;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Powered by footer */
.powered-by {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border-primary);
  text-align: center;
}

.powered-text {
  font-size: 0.875rem;
  color: var(--color-content-tertiary);
}

.powered-link {
  color: var(--color-primary);
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease;
}

.powered-link:hover {
  color: var(--color-primary-darker);
  text-decoration: underline;
}

/* Button styling */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--color-primary-darker);
  transform: translateY(-1px);
}

.btn-outlined {
  background-color: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.btn-outlined:hover {
  background-color: var(--color-primary);
  color: white;
  transform: translateY(-1px);
}

/* Responsive design */
@media (max-width: 768px) {
  .public-card-page {
    padding: 1rem;
  }
  
  .error-state {
    max-width: 350px;
  }
  
  .error-title {
    font-size: 1.25rem;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
