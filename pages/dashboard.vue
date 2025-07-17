<template>
  <div class="dashboard">
    <div class="container">
      <!-- Page Header -->
      <div class="page-header">
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Manage your digital business card</p>
      </div>

      <!-- Loading State -->
      <div v-if="cardLoading" class="loading-state">
        <div class="spinner"></div>
        <p class="loading-text">Loading your card...</p>
      </div>

      <!-- Main Content -->
      <div v-else class="dashboard-content">
        <!-- Card Editor -->
        <div class="editor-column">
          <CardEditor 
            :card-data="cardData"
            :is-loading="saveLoading"
            @save="handleSaveCard"
            @image-upload="handleImageUpload"
          />
        </div>

        <!-- Preview and Actions -->
        <div class="preview-column">
          <!-- Card Preview -->
          <div class="preview-section">
            <div class="section-header">
              <h2 class="section-title">Preview</h2>
              <p class="section-subtitle">How your card will appear to others</p>
            </div>
            
            <div class="preview-container">
              <BusinessCard 
                v-if="hasValidData"
                :card="previewCardData"
                :is-preview="true"
                @show-qr="showQRModal = true"
              />
              <div v-else class="preview-placeholder">
                <UserIcon class="placeholder-icon" />
                <p class="placeholder-text">
                  Fill out your information to see a preview
                </p>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="actions-section">
            <div class="section-header">
              <h3 class="section-title">Quick Actions</h3>
            </div>
            
            <div class="actions-grid">
              <NuxtLink 
                v-if="user?.username"
                :to="`/users/${user.username}`"
                target="_blank"
                class="action-button"
              >
                <ArrowTopRightOnSquareIcon class="action-icon" />
                <span>View Public Card</span>
              </NuxtLink>
              
              <button 
                @click="showQRModal = true"
                class="action-button"
                :disabled="!hasValidData"
              >
                <QrCodeIcon class="action-icon" />
                <span>Generate QR Code</span>
              </button>
              
              <button 
                @click="downloadVCard"
                class="action-button"
                :disabled="!hasValidData"
              >
                <ArrowDownTrayIcon class="action-icon" />
                <span>Download vCard</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- QR Code Modal -->
      <QRCodeModal 
        :show="showQRModal"
        :card-url="cardShareUrl"
        :card-title="cardTitle"
        @close="showQRModal = false"
      />

      <!-- Notification Toast -->
      <div v-if="notification" class="notification" :class="notificationType">
        {{ notification }}
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Dashboard page - Clean implementation
 * Main interface for managing business cards
 */

// Define page meta
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// Import icons
import { 
  UserIcon, 
  ArrowTopRightOnSquareIcon, 
  QrCodeIcon, 
  ArrowDownTrayIcon 
} from '@heroicons/vue/24/outline'

// Composables
const { user } = useAuth()
const { 
  getUserCard, 
  saveCard, 
  uploadProfileImage,
  generateVCardDownloadUrl, 
  getCardShareUrl 
} = useCard()
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
const notification = ref('')
const notificationType = ref('success')

// Store actual card record for image URL generation
const actualCardRecord = ref(null)

// Computed properties
const hasValidData = computed(() => {
  return cardData.value.first_name && 
         cardData.value.last_name && 
         cardData.value.company
})

const previewCardData = computed(() => {
  return {
    ...cardData.value,
    id: actualCardRecord.value?.id || 'preview',
    expand: {
      user_id: user.value
    },
    profile_image: actualCardRecord.value?.profile_image || cardData.value.profile_image
  }
})

const cardShareUrl = computed(() => {
  if (!user.value?.username) return ''
  return getCardShareUrl(user.value.username)
})

const cardTitle = computed(() => {
  const name = `${cardData.value.first_name} ${cardData.value.last_name}`.trim()
  return `${name} - ${cardData.value.company || 'Business Card'}`
})

/**
 * Load user's card data
 */
const loadCardData = async () => {
  cardLoading.value = true
  
  try {
    const existingCard = await getUserCard()
    
    if (existingCard) {
      // Store actual card record
      actualCardRecord.value = existingCard
      
      // Populate form data
      Object.keys(cardData.value).forEach(key => {
        if (existingCard[key] !== undefined) {
          cardData.value[key] = existingCard[key]
        }
      })
      
      // Load theme colors
      loadColorsFromCard(existingCard)
    }
  } catch (error) {
    console.error('Error loading card:', error)
    showNotification('Failed to load card data', 'error')
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
    // Merge with theme colors
    const saveData = {
      ...formData,
      ...getColorsForCard()
    }
    
    const result = await saveCard(saveData)
    
    if (result) {
      // Update local data
      Object.assign(cardData.value, formData)
      actualCardRecord.value = result
      
      showNotification('Card saved successfully!', 'success')
    } else {
      showNotification('Failed to save card', 'error')
    }
  } catch (error) {
    console.error('Save error:', error)
    showNotification('Failed to save card', 'error')
  } finally {
    saveLoading.value = false
  }
}

/**
 * Handle image upload
 */
const handleImageUpload = async (file) => {
  try {
    const result = await uploadProfileImage(file)
    
    if (result) {
      // Reload card data to get updated image
      await loadCardData()
      showNotification('Image uploaded successfully!', 'success')
    } else {
      showNotification('Failed to upload image', 'error')
    }
  } catch (error) {
    console.error('Image upload error:', error)
    showNotification('Failed to upload image', 'error')
  }
}

/**
 * Download vCard
 */
const downloadVCard = () => {
  if (!hasValidData.value) return
  
  try {
    const downloadUrl = generateVCardDownloadUrl(cardData.value)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = `${cardData.value.first_name}_${cardData.value.last_name}.vcf`
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(downloadUrl)
    showNotification('vCard downloaded!', 'success')
  } catch (error) {
    console.error('Download error:', error)
    showNotification('Failed to download vCard', 'error')
  }
}

/**
 * Show notification toast
 */
const showNotification = (message, type = 'success') => {
  notification.value = message
  notificationType.value = type
  
  setTimeout(() => {
    notification.value = ''
  }, type === 'error' ? 5000 : 3000)
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
/* Main dashboard container */
.dashboard {
  min-height: 100vh;
  background-color: var(--color-surface-secondary);
  padding: 2rem 0;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Page header */
.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-content-primary);
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1rem;
  color: var(--color-content-secondary);
}

/* Loading state */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
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

/* Dashboard content */
.dashboard-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.editor-column {
  min-width: 0;
}

.preview-column {
  min-width: 0;
}

/* Section styling */
.preview-section,
.actions-section {
  background-color: var(--color-surface-primary);
  border: 1px solid var(--color-border-primary);
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.section-header {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-content-primary);
  margin-bottom: 0.5rem;
}

.section-subtitle {
  font-size: 0.875rem;
  color: var(--color-content-secondary);
}

/* Preview container */
.preview-container {
  background-color: var(--color-surface-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: 0.5rem;
  padding: 2rem;
  min-height: 400px;
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}

.placeholder-icon {
  width: 4rem;
  height: 4rem;
  color: var(--color-content-tertiary);
  margin-bottom: 1rem;
}

.placeholder-text {
  color: var(--color-content-secondary);
}

/* Actions grid */
.actions-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: var(--color-surface-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: 0.375rem;
  color: var(--color-content-primary);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-button:hover:not(:disabled) {
  background-color: var(--color-surface-hover);
  transform: translateY(-1px);
}

.action-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.action-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.75rem;
}

/* Notification toast */
.notification {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  color: white;
  font-weight: 500;
  z-index: 50;
  animation: slideIn 0.3s ease-out;
}

.notification.success {
  background-color: var(--color-success);
}

.notification.error {
  background-color: var(--color-error);
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

/* Responsive design */
@media (max-width: 1024px) {
  .dashboard-content {
    grid-template-columns: 1fr;
  }
  
  .preview-column {
    order: -1;
  }
}

@media (max-width: 768px) {
  .dashboard {
    padding: 1rem 0;
  }
  
  .page-header {
    margin-bottom: 1rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .preview-container {
    padding: 1rem;
  }
}
</style>
