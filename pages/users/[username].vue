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
 * Public business card page - Secure version using public_profiles
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
const { loadColorsFromCard } = useTheme()
const route = useRoute()

// Get username from route
const username = route.params.username

// Modal state
const showQRModal = ref(false)

/**
 * Fetch public card using the secure public_profiles collection
 * This function works on both client and server
 */
const fetchPublicCard = async (username) => {
  try {
    console.log('Fetching public card for username:', username)
    
    // Create a fresh Pocketbase client for this request
    // This ensures it works on both client and server
    const config = useRuntimeConfig()
    
    // Use $fetch for SSR-compatible requests
    const response = await $fetch(`${config.public.pocketbaseUrl}/api/collections/public_profiles/records`, {
      query: {
        filter: `username="${username}" && is_active=true`,
        perPage: 1
      }
    })
    
    if (!response.items || response.items.length === 0) {
      console.log('No public profile found for username:', username)
      return null
    }
    
    const profile = response.items[0]
    console.log('Found public profile:', profile.id)
    
    // Add mock expand for compatibility with BusinessCard component
    profile.expand = {
      user_id: {
        username: profile.username
      }
    }
    
    // Set the collection name for proper image URL generation
    profile.collectionName = 'public_profiles'
    
    return profile
    
  } catch (err) {
    console.error('Error fetching public card:', err)
    return null
  }
}

// Fetch card data with SSR support
const { data: cardData, pending, error } = await useLazyAsyncData(
  `public-card-${username}`,
  () => fetchPublicCard(username),
  {
    default: () => null,
    server: true, // Enable SSR
    transform: (data) => {
      // Ensure we have proper data structure
      if (data && !data.expand) {
        data.expand = {
          user_id: {
            username: data.username || username
          }
        }
      }
      return data
    }
  }
)

// Computed properties
const cardShareUrl = computed(() => {
  if (!cardData.value) return ''
  const config = useRuntimeConfig()
  return `${config.public.siteUrl}/users/${username}`
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
