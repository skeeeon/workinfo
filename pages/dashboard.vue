<template>
  <div class="dashboard">
    <div class="container">
      <!-- Loading State -->
      <div v-if="cardLoading" class="loading-state">
        <div class="spinner"></div>
        <p class="loading-text">Loading your card...</p>
      </div>

      <!-- Main Content -->
      <div v-else class="dashboard-content">
        <!-- Card Editor (Left Column - Scrollable) -->
        <div class="editor-column">
          <!-- Compact Header in Editor -->
          <div class="editor-header">
            <h1 class="editor-title">Edit Your Card</h1>
            <p class="editor-subtitle">Make changes and see them instantly</p>
          </div>
          
          <CardEditor 
            :card-data="cardData"
            :is-loading="saveLoading"
            @save="handleSaveCard"
            @image-upload="handleImageUpload"
          />
        </div>

        <!-- Live Preview (Right Column - Fixed on Desktop) -->
        <div class="preview-column">
          <div class="preview-sticky-container">
            <!-- Live Card Preview -->
            <div class="preview-section">
              <div class="section-header">
                <h2 class="section-title">Live Preview</h2>
                <p class="section-subtitle">Your card as others will see it</p>
              </div>
              
              <div class="preview-container">
                <CompactBusinessCard 
                  v-if="hasValidData"
                  :card="previewCardData"
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

            <!-- Additional Actions - Now more compact -->
            <div class="additional-actions">
              <NuxtLink 
                v-if="currentUser?.username"
                :to="`/users/${currentUser.username}`"
                target="_blank"
                class="action-btn action-btn-primary"
              >
                <ArrowTopRightOnSquareIcon class="w-4 h-4" />
                <span class="btn-text">View Public</span>
              </NuxtLink>
              
              <button 
                @click="downloadVCard"
                class="action-btn action-btn-secondary"
                :disabled="!hasValidData"
              >
                <ArrowDownTrayIcon class="w-4 h-4" />
                <span class="btn-text">Download</span>
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
 * Dashboard page - COMPLETE VERSION with all fixes implemented
 * Main interface for managing business cards with optimized layout
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
  ArrowDownTrayIcon 
} from '@heroicons/vue/24/outline'

// Composables
const authComposable = useAuth()
const cardComposable = useCard()
const themeComposable = useTheme()

// Extract methods and data
const { user: currentUser } = authComposable
const { 
  getUserCard, 
  saveCard, 
  uploadProfileImage,
  generateVCardDownloadUrl, 
  getCardShareUrl 
} = cardComposable
const { loadColorsFromCard, getColorsForCard } = themeComposable

// State
const cardData = ref({
  first_name: '',
  last_name: '',
  company: '',
  address: '',
  title: '',
  note: '',
  mobile: '',
  office: '',
  email: '',
  website: '',
  calendar: '',
  profile_image: null,
  tracking_script: ''
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
      user_id: currentUser.value
    },
    profile_image: actualCardRecord.value?.profile_image || cardData.value.profile_image
  }
})

const cardShareUrl = computed(() => {
  if (!currentUser.value?.username) return ''
  return getCardShareUrl(currentUser.value.username)
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
 * Handle image upload - FIXED: Proper async error handling and user feedback
 */
const handleImageUpload = async (file) => {
  // Validate file client-side first
  if (!file) {
    showNotification('No file selected', 'error')
    return
  }
  
  if (!file.type.startsWith('image/')) {
    showNotification('Please select a valid image file', 'error')
    return
  }
  
  if (file.size > 5 * 1024 * 1024) { // 5MB limit
    showNotification('Image size must be less than 5MB', 'error')
    return
  }
  
  try {
    console.log('Dashboard: Starting image upload for file:', file.name, 'Size:', file.size)
    
    // Show loading state in the ImageUpload component by not showing success yet
    
    // Call the upload function and wait for it
    const result = await uploadProfileImage(file)
    
    if (result) {
      console.log('Dashboard: Image upload successful, result:', result.id)
      
      // Update local card data immediately to show the new image
      actualCardRecord.value = result
      
      // Also reload full card data to ensure consistency
      await loadCardData()
      
      showNotification('Image uploaded successfully!', 'success')
    } else {
      console.error('Dashboard: Image upload returned null/false')
      showNotification('Failed to upload image - please try again', 'error')
    }
  } catch (error) {
    console.error('Dashboard: Image upload error:', error)
    
    // Provide more specific error messages
    let errorMessage = 'Failed to upload image'
    
    if (error.message) {
      if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = 'Network error - please check your connection'
      } else if (error.message.includes('size') || error.message.includes('large')) {
        errorMessage = 'Image file is too large'
      } else if (error.message.includes('format') || error.message.includes('type')) {
        errorMessage = 'Invalid image format'
      } else {
        errorMessage = `Upload failed: ${error.message}`
      }
    }
    
    showNotification(errorMessage, 'error')
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
  title: 'Edit Your Card - WorkInfo',
  description: 'Edit and customize your professional contact card with live preview',
  robots: 'noindex, nofollow'
})
</script>

<style scoped>
/* Main dashboard container */
.dashboard {
  min-height: 100vh;
  background-color: var(--color-surface-secondary);
  padding: 0.75rem 0 2rem; /* Reduced top padding */
}

.container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Editor header (compact) */
.editor-header {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: var(--color-surface-primary);
  border: 1px solid var(--color-border-primary);
  border-radius: 0.5rem;
}

.editor-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-content-primary);
  margin-bottom: 0.25rem;
}

.editor-subtitle {
  font-size: 0.875rem;
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

/* Dashboard content - OPTIMIZED LAYOUT */
.dashboard-content {
  display: grid;
  grid-template-columns: 1fr 480px; /* Slightly smaller right column */
  gap: 1.25rem; /* Reduced gap */
  align-items: start;
  min-height: calc(100vh - 100px); /* Reduced min-height */
}

.editor-column {
  min-width: 0;
  max-height: calc(100vh - 100px); /* Adjusted for smaller header */
  overflow-y: auto;
  padding-right: 0.5rem;
  position: relative;
}

/* Subtle scroll fade effect */
.editor-column::before {
  content: '';
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  height: 8px;
  background: linear-gradient(to bottom, var(--color-surface-secondary), transparent);
  z-index: 1;
  pointer-events: none;
}

/* Custom scrollbar for editor column */
.editor-column::-webkit-scrollbar {
  width: 6px;
}

.editor-column::-webkit-scrollbar-track {
  background: var(--color-surface-secondary);
  border-radius: 3px;
}

.editor-column::-webkit-scrollbar-thumb {
  background: var(--color-border-secondary);
  border-radius: 3px;
}

.editor-column::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary);
}

.preview-column {
  min-width: 0;
  width: 480px; /* Fixed width */
}

/* FIXED: Better sticky container sizing */
.preview-sticky-container {
  position: sticky;
  top: 1rem; /* Reduced from 2rem */
  max-height: calc(100vh - 2rem); /* Better height calculation */
  overflow: hidden; /* Changed from overflow-y: auto */
  border-radius: 0.75rem;
  background-color: transparent;
  display: flex;
  flex-direction: column;
}

/* Section styling - OPTIMIZED */
.preview-section {
  background-color: var(--color-surface-primary);
  border: 1px solid var(--color-border-primary);
  border-radius: 0.5rem;
  padding: 0.75rem; /* Reduced padding */
  margin-bottom: 0.75rem; /* Reduced margin */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  flex: 1;
  min-height: 0; /* Allow flexbox to shrink */
  overflow: hidden;
}

.section-header {
  margin-bottom: 0.75rem; /* Reduced */
}

.section-title {
  font-size: 1rem; /* Smaller */
  font-weight: 600;
  color: var(--color-content-primary);
  margin-bottom: 0.25rem;
}

.section-subtitle {
  font-size: 0.75rem; /* Smaller */
  color: var(--color-content-secondary);
}

/* Preview container - COMPACT */
.preview-container {
  background-color: var(--color-surface-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: 0.5rem;
  padding: 0.25rem; /* Minimal padding */
  min-height: 300px; /* Reduced from 400px */
  overflow: hidden;
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
  width: 3rem; /* Smaller */
  height: 3rem;
  color: var(--color-content-tertiary);
  margin-bottom: 0.75rem;
}

.placeholder-text {
  color: var(--color-content-secondary);
  font-size: 0.875rem;
}

/* COMPACT ACTION BUTTONS */
.additional-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0; /* No top margin */
  flex-shrink: 0; /* Don't shrink */
}

.action-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 0.5rem; /* Vertical layout */
  border: 1px solid var(--color-border-primary);
  border-radius: 0.375rem;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.75rem; /* Smaller text */
  font-weight: 500;
  min-height: 60px; /* Fixed height */
}

.action-btn-primary {
  background-color: var(--color-surface-secondary);
  color: var(--color-content-primary);
}

.action-btn-primary:hover {
  background-color: var(--color-surface-hover);
  border-color: var(--color-primary);
  transform: translateY(-1px);
}

.action-btn-secondary {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.action-btn-secondary:hover:not(:disabled) {
  background-color: var(--color-primary-darker);
  transform: translateY(-1px);
}

.action-btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-text {
  margin-top: 0.25rem;
  font-size: 0.6875rem; /* Very small */
  text-align: center;
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
@media (min-width: 1400px) {
  .dashboard-content {
    grid-template-columns: 1fr 500px;
    gap: 1.5rem;
  }
  
  .preview-column {
    width: 500px;
  }
}

@media (max-width: 1024px) {
  .dashboard-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .editor-column {
    max-height: none;
    overflow-y: visible;
    padding-right: 0;
    order: 1;
  }
  
  .editor-column::before {
    display: none;
  }
  
  .preview-column {
    width: 100%;
    order: 2;
  }
  
  .preview-sticky-container {
    position: static;
    max-height: none;
    overflow-y: visible;
  }
  
  .additional-actions {
    flex-direction: row;
  }
  
  .action-btn {
    flex-direction: row;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    min-height: auto;
  }
  
  .btn-text {
    margin-top: 0;
    font-size: 0.875rem;
  }
}

@media (max-width: 768px) {
  .dashboard {
    padding: 0.5rem 0 1rem;
  }
  
  .dashboard-content {
    gap: 1rem;
  }
  
  .editor-header {
    padding: 0.75rem;
    margin-bottom: 1rem;
  }
  
  .editor-title {
    font-size: 1.25rem;
  }
  
  .preview-container {
    min-height: 250px;
  }
}
</style>
