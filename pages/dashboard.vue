<template>
  <div class="min-h-screen" :style="{ backgroundColor: 'var(--color-surface-secondary)' }">
    <div class="container mx-auto px-4 py-8">
      <!-- Page header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2" 
            :style="{ color: 'var(--color-content-primary)' }">
          Dashboard
        </h1>
        <p :style="{ color: 'var(--color-content-secondary)' }">
          Manage your digital business card
        </p>
      </div>

      <!-- Loading state -->
      <div v-if="cardLoading" class="text-center py-12">
        <div class="spinner mx-auto mb-4"></div>
        <p :style="{ color: 'var(--color-content-secondary)' }">
          Loading your card...
        </p>
      </div>

      <!-- Main content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Card Editor -->
        <div class="space-y-6">
          <CardEditor 
            :card-data="cardData"
            :is-loading="saveLoading"
            @save="handleSaveCard"
            @image-upload="handleImageUpload"
          />
        </div>

        <!-- Card Preview -->
        <div class="space-y-6">
          <div class="card">
            <div class="card-header">
              <h2 class="card-title">Preview</h2>
              <p class="card-subtitle">How your card will look to others</p>
            </div>
            
            <div class="preview-container" 
                 :style="{ backgroundColor: 'var(--color-surface-secondary)' }">
              <BusinessCard 
                v-if="cardData.first_name || cardData.last_name"
                :card="previewCardData"
                :is-preview="true"
                @show-qr="showQRModal = true"
              />
              <div v-else class="text-center py-12">
                <UserIcon class="w-16 h-16 mx-auto mb-4" 
                          :style="{ color: 'var(--color-content-tertiary)' }" />
                <p :style="{ color: 'var(--color-content-secondary)' }">
                  Fill out your information to see a preview
                </p>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Quick Actions</h3>
            </div>
            
            <div class="space-y-3">
              <NuxtLink 
                v-if="user?.username"
                :to="`/users/${user.username}`"
                target="_blank"
                class="btn btn-outlined w-full"
              >
                <ExternalLinkIcon class="w-4 h-4 mr-2" />
                View Public Card
              </NuxtLink>
              
              <button 
                @click="showQRModal = true"
                class="btn btn-ghost w-full"
                :disabled="!hasCardData"
              >
                <QrCodeIcon class="w-4 h-4 mr-2" />
                Generate QR Code
              </button>
              
              <button 
                @click="downloadVCard"
                class="btn btn-ghost w-full"
                :disabled="!hasCardData"
              >
                <ArrowDownTrayIcon class="w-4 h-4 mr-2" />
                Download vCard
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- QR Code Modal -->
      <QRCodeModal 
        :show="showQRModal"
        :card-url="cardShareUrl"
        :card-title="`${cardData.first_name} ${cardData.last_name} - ${cardData.company}`"
        @close="showQRModal = false"
      />

      <!-- Success/Error Messages -->
      <div v-if="successMessage" 
           class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
        {{ successMessage }}
      </div>
      
      <div v-if="errorMessage" 
           class="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Dashboard page for managing user's business card
 * Provides card editing interface and preview
 */

// Define page meta
definePageMeta({
  middleware: 'auth'
})

// Import Heroicons
import { 
  UserIcon, 
  ExternalLinkIcon, 
  QrCodeIcon, 
  ArrowDownTrayIcon 
} from '@heroicons/vue/24/outline'

// Use composables
const { user } = useAuth()
const { getUserCard, saveCard, generateVCardDownloadUrl, getCardShareUrl } = useCard()
const { loadColorsFromCard, getColorsForCard } = useTheme()

// State
const cardData = ref({
  first_name: '',
  last_name: '',
  company: '',
  title: '',
  note: '',
  mobile: '',
  office: '',
  email: '',
  website: '',
  calendar: '',
  profile_image: null
})

const cardLoading = ref(true)
const saveLoading = ref(false)
const showQRModal = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// Computed properties
const hasCardData = computed(() => {
  return cardData.value.first_name && cardData.value.last_name && cardData.value.company
})

const previewCardData = computed(() => {
  return {
    ...cardData.value,
    id: 'preview',
    user_id: user.value?.id,
    expand: {
      user_id: user.value
    }
  }
})

const cardShareUrl = computed(() => {
  if (!user.value?.username) return ''
  return getCardShareUrl(user.value.username)
})

/**
 * Load user's existing card data
 */
const loadCardData = async () => {
  cardLoading.value = true
  try {
    const existingCard = await getUserCard()
    if (existingCard) {
      // Populate form with existing data
      Object.keys(cardData.value).forEach(key => {
        if (existingCard[key] !== undefined) {
          cardData.value[key] = existingCard[key]
        }
      })
      
      // Load theme colors from card
      loadColorsFromCard(existingCard)
    }
  } catch (error) {
    console.error('Error loading card:', error)
    showError('Failed to load your card data')
  } finally {
    cardLoading.value = false
  }
}

/**
 * Handle card save
 */
const handleSaveCard = async (formData) => {
  saveLoading.value = true
  try {
    // Merge theme colors
    const saveData = {
      ...formData,
      ...getColorsForCard()
    }
    
    const result = await saveCard(saveData)
    if (result) {
      // Update local data
      Object.assign(cardData.value, formData)
      showSuccess('Card saved successfully!')
    } else {
      showError('Failed to save card')
    }
  } catch (error) {
    console.error('Save error:', error)
    showError('Failed to save card')
  } finally {
    saveLoading.value = false
  }
}

/**
 * Handle image upload
 */
const handleImageUpload = async (file) => {
  try {
    const { uploadProfileImage } = useCard()
    const imageUrl = await uploadProfileImage(file)
    if (imageUrl) {
      cardData.value.profile_image = imageUrl
      showSuccess('Image uploaded successfully!')
    } else {
      showError('Failed to upload image')
    }
  } catch (error) {
    console.error('Image upload error:', error)
    showError('Failed to upload image')
  }
}

/**
 * Download vCard
 */
const downloadVCard = () => {
  if (!hasCardData.value) return
  
  try {
    const downloadUrl = generateVCardDownloadUrl(cardData.value)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = `${cardData.value.first_name}_${cardData.value.last_name}.vcf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(downloadUrl)
    
    showSuccess('vCard downloaded!')
  } catch (error) {
    console.error('Download error:', error)
    showError('Failed to download vCard')
  }
}

/**
 * Show success message
 */
const showSuccess = (message) => {
  successMessage.value = message
  setTimeout(() => {
    successMessage.value = ''
  }, 3000)
}

/**
 * Show error message
 */
const showError = (message) => {
  errorMessage.value = message
  setTimeout(() => {
    errorMessage.value = ''
  }, 5000)
}

// Load card data on mount
onMounted(() => {
  loadCardData()
})

// SEO
useSeoMeta({
  title: 'Dashboard - Hivecard',
  description: 'Manage your digital business card',
  robots: 'noindex, nofollow'
})
</script>

<style scoped>
.container {
  max-width: 1280px;
}

.preview-container {
  border-radius: 0.5rem;
  padding: 2rem;
  border: 1px solid var(--color-border-primary);
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

/* Notification animations */
.fixed {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
