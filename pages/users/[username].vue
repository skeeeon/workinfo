<template>
  <div class="card-page">
    
    <!-- Loading state -->
    <div v-if="pending" class="min-h-[60vh] flex items-center justify-center">
      <div class="text-center">
        <div class="spinner mx-auto mb-4"></div>
        <p :style="{ color: 'var(--color-content-secondary)' }">
          Loading business card...
        </p>
      </div>
    </div>

    <!-- Error state (card not found) -->
    <div v-else-if="error || !cardData" class="min-h-[60vh] flex items-center justify-center">
      <div class="text-center max-w-md mx-auto px-4">
        <div class="error-icon mx-auto mb-6" 
             :style="{ 
               color: 'var(--color-warning)',
               backgroundColor: 'var(--color-warning)' + '15'
             }">
          <MagnifyingGlassIcon class="w-12 h-12" />
        </div>
        <h1 class="text-2xl font-bold mb-4" 
            :style="{ color: 'var(--color-content-primary)' }">
          Card Not Found
        </h1>
        <p class="text-base mb-8" 
           :style="{ color: 'var(--color-content-secondary)' }">
          The business card you're looking for doesn't exist or may have been moved.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/" class="btn btn-primary">
            Visit Hivecard
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Card content -->
    <div v-else class="card-content">
      <!-- Main card content -->
      <div class="py-8">
        <BusinessCard 
          :card="cardData" 
          @show-qr="showQRModal = true" 
        />
      </div>

      <!-- QR Code Modal -->
      <QRCodeModal 
        :show="showQRModal"
        :card-url="cardShareUrl"
        :card-title="`${cardData.first_name} ${cardData.last_name} - ${cardData.company}`"
        @close="showQRModal = false"
      />
      
      <!-- Powered by Hivecard -->
      <div class="text-center py-8 border-t" 
           :style="{ borderColor: 'var(--color-border-primary)' }">
        <p class="text-sm" 
           :style="{ color: 'var(--color-content-tertiary)' }">
          Powered by 
          <NuxtLink to="/" 
                    class="font-medium hover:underline"
                    :style="{ color: 'var(--color-primary)' }">
            Hivecard
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Public business card page
 * Displays a single user's business card accessible to anyone
 */

// Define layout
definePageMeta({
  layout: 'card'
})

// Import Heroicons
import {
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'

// Use composables
const { getCardByUsername, getCardShareUrl } = useCard()
const { loadColorsFromCard } = useTheme()
const route = useRoute()

// Get username from route
const username = route.params.username

// Modal state
const showQRModal = ref(false)

// Fetch card data
const { data: cardData, pending, error } = await useLazyAsyncData(
  `card-${username}`,
  () => getCardByUsername(username),
  {
    // SSG compatibility: return null for unknown cards to trigger 404
    default: () => null
  }
)

// Computed properties
const cardShareUrl = computed(() => {
  if (!cardData.value) return ''
  return getCardShareUrl(username)
})

// Handle 404 for unknown cards
if (!pending.value && !cardData.value) {
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
      keywords: `${displayName}, ${cardData.value.company}, business card, contact, ${cardData.value.title || 'professional'}`,
      ogTitle: `${displayName} - Digital Business Card`,
      ogDescription: description,
      ogType: 'profile',
      ogUrl: cardShareUrl.value,
      ogImage: cardData.value.profile_image ? 
        (typeof cardData.value.profile_image === 'string' ? cardData.value.profile_image : null) : 
        null,
      twitterCard: 'summary',
      twitterTitle: `${displayName} - ${cardData.value.title || 'Professional'}`,
      twitterDescription: description,
      // Business card specific meta
      'profile:first_name': cardData.value.first_name,
      'profile:last_name': cardData.value.last_name,
      'business:contact_data:company_name': cardData.value.company
    })

    // Add structured data for person
    useHead({
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: displayName,
            jobTitle: cardData.value.title,
            worksFor: cardData.value.company ? {
              '@type': 'Organization',
              name: cardData.value.company
            } : undefined,
            description: cardData.value.note,
            contactPoint: [
              cardData.value.email && {
                '@type': 'ContactPoint',
                contactType: 'email',
                email: cardData.value.email
              },
              cardData.value.mobile && {
                '@type': 'ContactPoint',
                contactType: 'mobile',
                telephone: cardData.value.mobile
              },
              cardData.value.office && {
                '@type': 'ContactPoint',
                contactType: 'work',
                telephone: cardData.value.office
              }
            ].filter(Boolean),
            url: cardData.value.website,
            sameAs: [
              cardData.value.website,
              cardData.value.calendar
            ].filter(Boolean)
          })
        }
      ]
    })
  }
})

// Add specific meta tags for better card preview
useHead({
  meta: [
    { name: 'robots', content: 'index, follow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ]
})
</script>

<style scoped>
.container {
  max-width: 1280px;
}

.card-page {
  min-height: calc(100vh - 200px); /* Account for layout header/footer */
}

.error-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-border-primary);
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.btn {
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn-primary:hover {
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

/* Smooth card loading animation */
.card-content {
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
</style>
