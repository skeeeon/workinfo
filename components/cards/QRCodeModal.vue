<template>
  <!-- Modal backdrop -->
  <div 
    v-if="show" 
    class="modal-backdrop"
    @click="handleBackdropClick"
  >
    <!-- Modal content -->
    <div class="modal-content" @click.stop>
      <!-- Close button -->
      <button 
        @click="$emit('close')"
        class="close-btn"
        aria-label="Close modal"
      >
        <XMarkIcon class="w-5 h-5" />
      </button>

      <!-- Header -->
      <div class="modal-header">
        <h3 class="modal-title">Scan QR Code</h3>
        <p class="modal-subtitle">
          Share this card by scanning with any QR code reader
        </p>
      </div>

      <!-- QR Code -->
      <div class="qr-section">
        <div class="qr-container">
          <!-- Loading state -->
          <div v-if="loading" class="qr-loading">
            <div class="spinner"></div>
          </div>
          
          <!-- Error state -->
          <div v-else-if="error" class="qr-error">
            <ExclamationTriangleIcon class="w-12 h-12 text-red-500 mb-2" />
            <p class="text-sm text-red-600">Failed to generate QR code</p>
            <button @click="generateQRCode" class="retry-btn">
              Retry
            </button>
          </div>
          
          <!-- QR Code image -->
          <div v-else class="qr-image-container">
            <img 
              :src="qrImageUrl" 
              alt="QR Code"
              class="qr-image"
              @load="handleImageLoad"
              @error="handleImageError"
            />
          </div>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="modal-actions">
        <button 
          @click="copyCardUrl"
          class="btn btn-outlined"
        >
          <ClipboardIcon class="w-4 h-4 mr-2" />
          Copy URL
        </button>
        
        <button 
          v-if="canShare"
          @click="shareCard"
          class="btn btn-primary"
        >
          <ShareIcon class="w-4 h-4 mr-2" />
          Share
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * QR Code Modal component - Clean implementation
 * Displays QR code for business card sharing
 */

import {
  XMarkIcon,
  ClipboardIcon,
  ShareIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  cardUrl: {
    type: String,
    required: true
  },
  cardTitle: {
    type: String,
    default: 'Business Card'
  }
})

// Emits
const emit = defineEmits(['close'])

// State
const loading = ref(false)
const error = ref(false)
const qrImageUrl = ref('')

// Computed properties
const canShare = computed(() => {
  return import.meta.client && 'share' in navigator
})

/**
 * Generate QR code image URL
 */
const generateQRCode = () => {
  if (!props.cardUrl) return
  
  loading.value = true
  error.value = false
  
  try {
    // Use QR Server API for QR code generation
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(props.cardUrl)}`
    qrImageUrl.value = qrUrl
  } catch (err) {
    console.error('QR code generation error:', err)
    error.value = true
    loading.value = false
  }
}

/**
 * Handle QR image load success
 */
const handleImageLoad = () => {
  loading.value = false
  error.value = false
}

/**
 * Handle QR image load error
 */
const handleImageError = () => {
  loading.value = false
  error.value = true
}

/**
 * Handle backdrop click
 */
const handleBackdropClick = (event) => {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}

/**
 * Copy card URL to clipboard
 */
const copyCardUrl = async () => {
  if (!import.meta.client || !navigator.clipboard) return
  
  try {
    await navigator.clipboard.writeText(props.cardUrl)
    // Could add toast notification here
  } catch (error) {
    console.error('Failed to copy URL:', error)
  }
}

/**
 * Share card using Web Share API
 */
const shareCard = async () => {
  if (!canShare.value) return
  
  try {
    await navigator.share({
      title: props.cardTitle,
      text: 'View this digital business card',
      url: props.cardUrl
    })
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Share failed:', error)
    }
  }
}

/**
 * Handle escape key
 */
const handleEscapeKey = (event) => {
  if (event.key === 'Escape' && props.show) {
    emit('close')
  }
}

// Watch for show prop changes
watch(() => props.show, (newShow) => {
  if (newShow) {
    generateQRCode()
  }
})

// Setup event listeners
onMounted(() => {
  if (import.meta.client) {
    document.addEventListener('keydown', handleEscapeKey)
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    document.removeEventListener('keydown', handleEscapeKey)
  }
})
</script>

<style scoped>
/* Modal backdrop */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

/* Modal content */
.modal-content {
  background-color: var(--color-surface-primary);
  border: 1px solid var(--color-border-primary);
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  max-width: 28rem;
  width: 100%;
  padding: 1.5rem;
  position: relative;
  animation: modal-appear 0.2s ease-out;
}

@keyframes modal-appear {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Close button */
.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--color-surface-secondary);
  color: var(--color-content-primary);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background-color: var(--color-surface-hover);
}

/* Header */
.modal-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-content-primary);
  margin-bottom: 0.5rem;
}

.modal-subtitle {
  font-size: 0.875rem;
  color: var(--color-content-secondary);
}

/* QR Section */
.qr-section {
  text-align: center;
  margin-bottom: 1.5rem;
}

.qr-container {
  display: inline-block;
  padding: 1rem;
  background-color: white;
  border: 1px solid var(--color-border-primary);
  border-radius: 0.5rem;
}

.qr-loading,
.qr-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
}

.qr-image-container {
  width: 200px;
  height: 200px;
}

.qr-image {
  width: 100%;
  height: 100%;
  display: block;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.retry-btn {
  margin-top: 0.5rem;
  padding: 0.25rem 0.75rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  background-color: var(--color-primary-darker);
}

/* Action buttons */
.modal-actions {
  display: flex;
  gap: 0.75rem;
}

.btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  border: none;
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
@media (max-width: 640px) {
  .modal-content {
    margin: 1rem;
    max-width: calc(100vw - 2rem);
  }
  
  .qr-container {
    padding: 0.75rem;
  }
  
  .qr-loading,
  .qr-error,
  .qr-image-container {
    width: 160px;
    height: 160px;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style>
