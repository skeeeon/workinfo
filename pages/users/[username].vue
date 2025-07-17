<template>
  <div class="public-card-page">
    <!-- Loading state -->
    <div v-if="pending" class="loading-state">
      <div class="spinner"></div>
      <p class="loading-text">Loading business card...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error || !cardData" class="error-state">
      <div class="error-icon">
        <MagnifyingGlassIcon class="w-12 h-12" />
      </div>
      <h1 class="error-title">Card Not Found</h1>
      <p class="error-message">
        The business card you're looking for doesn't exist or may have been moved.
      </p>
      <div class="error-actions">
        <NuxtLink to="/" class="btn btn-primary">
          Visit Hivecard
        </NuxtLink>
      </div>
    </div>

    <!-- Card content -->
    <div v-else class="card-content">
      <div class="card-container">
        <BusinessCard 
          :card="cardData" 
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
 * Public business card page - Clean implementation
 * Displays a user's business card accessible to anyone
 */

// Define layout
definePageMeta({
  layout: 'card'
})

// Import icons
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

// Composables
const { getCardByUsername, getCardShareUrl } = useCard()
const { loadColorsFromCard } = useTheme()
const route = useRoute()

// Get username from route
const username = route.params.username

// State
const showQRModal = ref(false)

// Fetch card data with SSR support
const { data: cardData, pending, error } = await useLazyAsyncData(
  `card-${username}`,
  () => getCardByUsername(username),
  {
    default: () => null,
    server: true
  }
)

// Computed properties
const cardShareUrl = computed(() => {
  if (!cardData.value) return ''
  const config = useRuntimeConfig()
  return `${config.public.siteUrl}/users/${username}`
})

const cardTitle = computed(() => {
  if (!cardData.value) return 'Business Card'
  const name = `${cardData.value.first_name} ${cardData.value.last_name}`.trim()
  return `${name} - ${cardData.value.company || 'Business Card'}`
})

// Handle 404 for unknown cards
if (!pending.value && !cardData.value && !error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Business card not found'
  })
}

// Apply custom theme colors when card loads
watchEffect(() => {
  if (cardData.value) {
    loadColorsFromCard(cardData.value)
  }
})

// Dynamic SEO based on card data
watchEffect(() => {
  if (cardData.value) {
    const displayName = `${cardData.value.first_name} ${cardData.value.last_name}`.trim()
    const description = cardData.value.note || 
      `Connect with ${displayName}, ${cardData.value.title || 'Professional'} at ${cardData.value.company || 'their company'}.`
    
    useSeoMeta({
      title: `${displayName} - ${cardData.value.title || 'Professional'} | Hivecard`,
      description: description,
      ogTitle: `${displayName} - Digital Business Card`,
      ogDescription: description,
      ogType: 'profile',
      ogUrl: cardShareUrl.value
    })
  }
})
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
  max-width: 400px;
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

/* Responsive design */
@media (max-width: 768px) {
  .public-card-page {
    padding: 1rem;
  }
  
  .error-state {
    max-width: 300px;
  }
  
  .error-title {
    font-size: 1.25rem;
  }
}
</style>
