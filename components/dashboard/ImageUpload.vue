<template>
  <div class="image-upload">
    <!-- Current Image Display -->
    <div class="current-image">
      <div v-if="currentImageUrl" class="image-container">
        <img 
          :src="currentImageUrl" 
          :alt="altText"
          class="profile-image" 
          @error="handleImageError"
          @load="handleImageLoad"
        />
        <button 
          @click="removeImage"
          class="remove-btn"
          :disabled="disabled || uploading"
          aria-label="Remove image"
        >
          <XMarkIcon class="w-4 h-4" />
        </button>
      </div>
      
      <div v-else class="placeholder-container">
        <UserIcon class="w-16 h-16 placeholder-icon" />
        <p class="placeholder-text">No image uploaded</p>
      </div>
    </div>

    <!-- Upload Interface -->
    <div class="upload-interface">
      <!-- File Input (Hidden) -->
      <input 
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileSelect"
        :disabled="disabled || uploading"
      />

      <!-- Upload Button -->
      <button 
        @click="triggerFileSelect"
        class="upload-btn"
        :disabled="disabled || uploading"
      >
        <span v-if="uploading" class="spinner"></span>
        <PhotoIcon v-else class="w-4 h-4 mr-2" />
        {{ uploading ? 'Uploading...' : (currentImageUrl ? 'Change Image' : 'Upload Image') }}
      </button>

      <!-- Upload Guidelines -->
      <div class="upload-guidelines">
        <p class="guideline-text">
          Recommended: Square image, at least 400x400px. Max size: 5MB.
        </p>
        <p class="guideline-text">
          Supported formats: JPG, PNG, WebP
        </p>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Image upload component - Fixed URL generation
 * Properly handles card objects and generates correct PocketBase URLs
 */

import { 
  UserIcon, 
  PhotoIcon, 
  XMarkIcon 
} from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  currentImage: {
    type: [String, Object], // Can be filename string or full card object
    default: null
  },
  cardId: {
    type: String,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  },
  altText: {
    type: String,
    default: 'Profile image'
  }
})

// Emits
const emit = defineEmits(['upload', 'remove'])

// Composables
const { getProfileImageUrl } = useCard()

// State
const fileInput = ref(null)
const uploading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const previewUrl = ref(null)

// Computed properties
const currentImageUrl = computed(() => {
  console.log('ImageUpload: Computing image URL for:', {
    currentImage: props.currentImage,
    cardId: props.cardId,
    previewUrl: previewUrl.value
  })
  
  // Priority: 1. Local preview, 2. Constructed PocketBase URL
  if (previewUrl.value) {
    return previewUrl.value
  }
  
  // If currentImage is a card object with profile_image
  if (props.currentImage && typeof props.currentImage === 'object') {
    return getProfileImageUrl(props.currentImage)
  }
  
  // If currentImage is a filename string and we have cardId
  if (typeof props.currentImage === 'string' && props.cardId) {
    const cardData = {
      id: props.cardId,
      profile_image: props.currentImage
    }
    return getProfileImageUrl(cardData)
  }
  
  // If currentImage is already a full URL
  if (typeof props.currentImage === 'string' && props.currentImage.startsWith('http')) {
    return props.currentImage
  }
  
  console.log('ImageUpload: No valid image URL found')
  return null
})

/**
 * Trigger file input click
 */
const triggerFileSelect = () => {
  if (fileInput.value && !disabled && !uploading.value) {
    fileInput.value.click()
  }
}

/**
 * Handle file selection
 */
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Clear previous messages
  clearMessages()

  // Validate file
  const validation = validateFile(file)
  if (!validation.valid) {
    errorMessage.value = validation.error
    return
  }

  // Create preview
  createPreview(file)

  // Start upload process
  uploadFile(file)
}

/**
 * Validate selected file
 */
const validateFile = (file) => {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Please select a valid image file (JPG, PNG, or WebP)'
    }
  }

  // Check file size (5MB max)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Image size must be less than 5MB'
    }
  }

  return { valid: true }
}

/**
 * Create image preview
 */
const createPreview = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    previewUrl.value = e.target.result
  }
  reader.onerror = () => {
    errorMessage.value = 'Failed to create image preview'
  }
  reader.readAsDataURL(file)
}

/**
 * Upload file
 */
const uploadFile = async (file) => {
  uploading.value = true

  try {
    // Emit upload event to parent component
    emit('upload', file)

    // Show success message
    successMessage.value = 'Image uploaded successfully!'
    setTimeout(() => {
      successMessage.value = ''
      previewUrl.value = null // Clear preview after success
    }, 2000)

  } catch (error) {
    console.error('Upload error:', error)
    errorMessage.value = 'Failed to upload image. Please try again.'
    previewUrl.value = null
  } finally {
    uploading.value = false
  }
}

/**
 * Remove current image
 */
const removeImage = () => {
  previewUrl.value = null
  clearMessages()
  emit('remove')
  
  // Clear file input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

/**
 * Clear all messages
 */
const clearMessages = () => {
  errorMessage.value = ''
  successMessage.value = ''
}

/**
 * Handle image loading errors
 */
const handleImageError = (event) => {
  console.error('Failed to load image:', event.target.src)
  // Hide broken image
  event.target.style.display = 'none'
}

/**
 * Handle successful image loading
 */
const handleImageLoad = (event) => {
  console.log('Image loaded successfully:', event.target.src)
  event.target.style.display = 'block'
}

// Watch for currentImage changes
watch(() => props.currentImage, () => {
  if (!props.currentImage) {
    previewUrl.value = null
  }
})
</script>

<style scoped>
.image-upload {
  max-width: 300px;
}

.current-image {
  margin-bottom: 1rem;
}

.image-container {
  position: relative;
  display: inline-block;
}

.profile-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--color-border-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.remove-btn {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: var(--color-error);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  transform: scale(1.1);
}

.remove-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.placeholder-container {
  width: 120px;
  height: 120px;
  border: 2px dashed var(--color-border-secondary);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--color-surface-secondary);
}

.placeholder-icon {
  color: var(--color-content-tertiary);
  margin-bottom: 0.5rem;
}

.placeholder-text {
  font-size: 0.75rem;
  color: var(--color-content-secondary);
  text-align: center;
  margin: 0;
}

.upload-interface {
  space-y: 1rem;
}

.upload-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  background-color: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-btn:hover:not(:disabled) {
  background-color: var(--color-primary);
  color: white;
}

.upload-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--color-border-primary);
  border-top: 2px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.upload-guidelines {
  margin-top: 0.75rem;
}

.guideline-text {
  font-size: 0.75rem;
  color: var(--color-content-tertiary);
  margin: 0.25rem 0;
  line-height: 1.3;
}

.error-message {
  padding: 0.5rem;
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 0.375rem;
  color: var(--color-error);
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.success-message {
  padding: 0.5rem;
  background-color: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 0.375rem;
  color: var(--color-success);
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.hidden {
  display: none;
}
</style>
