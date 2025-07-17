<template>
  <!-- Modal backdrop -->
  <div 
    v-if="show" 
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    @click="handleBackdropClick"
  >
    <!-- Modal content -->
    <div 
      class="modal-content rounded-2xl shadow-xl max-w-md w-full p-6 relative"
      :style="{ backgroundColor: 'var(--color-surface-primary)' }"
      @click.stop
    >
      <!-- Close button -->
      <button 
        @click="handleCloseClick"
        class="absolute top-4 right-4 p-2 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
        :style="{ 
          backgroundColor: 'var(--color-surface-secondary)',
          color: 'var(--color-content-primary)'
        }"
        aria-label="Close QR code modal"
      >
        <XMarkIcon class="w-5 h-5" />
      </button>

      <!-- Modal header -->
      <div class="text-center mb-6">
        <h3 class="text-xl font-semibold mb-2" 
            :style="{ color: 'var(--color-content-primary)' }">
          Scan QR Code
        </h3>
        <p class="text-sm" 
           :style="{ color: 'var(--color-content-secondary)' }">
          Share this card by scanning with any QR code reader
        </p>
      </div>

      <!-- Debug info -->
      <div v-if="debugMode" class="mb-4 p-2 bg-gray-100 rounded text-xs">
        <p>Card URL: {{ cardUrl }}</p>
        <p>QR URL: {{ qrUrl }}</p>
        <p>Generating: {{ generating }}</p>
        <p>Error: {{ error }}</p>
      </div>

      <!-- QR Code container -->
      <div class="qr-container text-center mb-6">
        <div 
          ref="qrCodeContainer"
          class="qr-code-wrapper inline-block p-4 rounded-lg"
          :style="{ backgroundColor: 'white' }"
        >
          <!-- Loading state -->
          <div v-if="generating" class="flex items-center justify-center" style="width: 200px; height: 200px;">
            <div class="spinner"></div>
          </div>
          
          <!-- Error state -->
          <div v-else-if="error" class="flex items-center justify-center flex-col" style="width: 200px; height: 200px;">
            <ExclamationTriangleIcon class="w-12 h-12 text-red-500 mb-2" />
            <p class="text-sm text-red-600">Failed to generate QR code</p>
            <button @click="retryGeneration" class="text-xs text-blue-500 mt-1">Retry</button>
          </div>
        </div>
      </div>

      <!-- Share options -->
      <div class="flex flex-col sm:flex-row gap-3">
        <button 
          @click="copyCardUrl"
          class="btn btn-outlined flex-1 inline-flex items-center justify-center">
          <ClipboardIcon class="w-4 h-4 mr-2" />
          Copy URL
        </button>
        
        <button 
          v-if="canShare"
          @click="shareCard"
          class="btn btn-primary flex-1 inline-flex items-center justify-center">
          <ShareIcon class="w-4 h-4 mr-2" />
          Share
        </button>
      </div>

      <!-- Toggle debug mode -->
      <div class="mt-4 text-center">
        <button @click="debugMode = !debugMode" class="text-xs text-gray-500">
          {{ debugMode ? 'Hide' : 'Show' }} Debug Info
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * QR Code modal component for sharing business cards
 * Generates QR codes using QR Server API with debugging
 */

// Import Heroicons
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

// Template refs
const qrCodeContainer = ref(null)

// State
const generating = ref(false)
const error = ref(false)
const debugMode = ref(false)

// Computed properties
const canShare = computed(() => {
  return import.meta.client && 'share' in navigator
})

const qrUrl = computed(() => {
  if (!props.cardUrl) return ''
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(props.cardUrl)}`
})

/**
 * Handle backdrop click to close modal
 */
const handleBackdropClick = (event) => {
  // Only close if clicking the backdrop, not the modal content
  if (event.target === event.currentTarget) {
    console.log('QR Modal: Backdrop clicked, closing modal')
    emit('close')
  }
}

/**
 * Handle close button click
 */
const handleCloseClick = () => {
  console.log('QR Modal: Close button clicked')
  emit('close')
}

/**
 * Generate QR code using QR Server API
 */
const generateQRCode = async () => {
  if (!qrCodeContainer.value || !props.cardUrl) {
    console.log('Missing container or card URL')
    return
  }
  
  generating.value = true
  error.value = false
  
  try {
    console.log('Generating QR code for:', props.cardUrl)
    
    // Clear existing content
    qrCodeContainer.value.innerHTML = ''
    
    // Create QR code image using QR Server API
    const qrImageUrl = qrUrl.value
    console.log('QR image URL:', qrImageUrl)
    
    // Create image element
    const img = document.createElement('img')
    img.src = qrImageUrl
    img.alt = 'QR Code for business card'
    img.style.width = '200px'
    img.style.height = '200px'
    img.style.display = 'block'
    img.crossOrigin = 'anonymous' // Add this for CORS
    
    // Handle image load/error
    img.onload = () => {
      console.log('QR code loaded successfully')
      generating.value = false
    }
    
    img.onerror = (err) => {
      console.error('QR code failed to load:', err)
      generating.value = false
      error.value = true
    }
    
    // Append to container
    qrCodeContainer.value.appendChild(img)
    
  } catch (err) {
    console.error('QR code generation error:', err)
    generating.value = false
    error.value = true
  }
}

/**
 * Retry QR code generation
 */
const retryGeneration = () => {
  error.value = false
  nextTick(() => {
    generateQRCode()
  })
}

/**
 * Copy card URL to clipboard
 */
const copyCardUrl = async () => {
  if (!import.meta.client || !navigator.clipboard) return
  
  try {
    await navigator.clipboard.writeText(props.cardUrl)
    
    // Could add toast notification here
    console.log('URL copied to clipboard')
  } catch (error) {
    console.error('Failed to copy URL:', error)
  }
}

/**
 * Share card using Web Share API
 */
const shareCard = async () => {
  if (!import.meta.client || !navigator.share) return
  
  try {
    await navigator.share({
      title: props.cardTitle,
      text: `View this digital business card`,
      url: props.cardUrl
    })
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Share failed:', error)
    }
  }
}

// Watch for show prop changes to generate QR code
watch(() => props.show, (newShow) => {
  if (newShow) {
    console.log('Modal opened, generating QR code...')
    // Wait for DOM update
    nextTick(() => {
      generateQRCode()
    })
  }
})

// Watch for card URL changes
watch(() => props.cardUrl, (newUrl) => {
  if (props.show && newUrl) {
    console.log('Card URL changed, regenerating QR code...')
    nextTick(() => {
      generateQRCode()
    })
  }
})

// Handle escape key
const handleEscKey = (event) => {
  if (event.key === 'Escape' && props.show) {
    emit('close')
  }
}

// Setup event listeners
onMounted(() => {
  if (import.meta.client) {
    document.addEventListener('keydown', handleEscKey)
  }
})

// Clean up event listeners
onUnmounted(() => {
  if (import.meta.client) {
    document.removeEventListener('keydown', handleEscKey)
  }
})
</script>

<style scoped>
.modal-content {
  border: 1px solid var(--color-border-primary);
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

.qr-code-wrapper {
  border: 1px solid var(--color-border-primary);
  max-width: 240px;
  margin: 0 auto;
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

.btn {
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn-primary:hover {
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

.btn-outlined:hover {
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.15);
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .modal-content {
    margin: 1rem;
    max-width: calc(100vw - 2rem);
  }
  
  .qr-code-wrapper {
    max-width: 200px;
  }
}
</style>
