<template>
  <div class="image-upload">
    <!-- Current Image Display -->
    <div class="current-image mb-4">
      <div v-if="currentImageUrl" class="image-container">
        <img :src="currentImageUrl" 
             :alt="altText"
             class="profile-image" />
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
        <UserIcon class="w-16 h-16" 
                  :style="{ color: 'var(--color-content-tertiary)' }" />
        <p class="text-sm mt-2" 
           :style="{ color: 'var(--color-content-secondary)' }">
          No image uploaded
        </p>
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
        class="btn btn-outlined w-full"
        :disabled="disabled || uploading"
      >
        <span v-if="uploading" class="spinner mr-2"></span>
        <PhotoIcon v-else class="w-4 h-4 mr-2" />
        {{ uploading ? 'Uploading...' : (currentImageUrl ? 'Change Image' : 'Upload Image') }}
      </button>

      <!-- Upload Progress -->
      <div v-if="uploadProgress > 0 && uploadProgress < 100" 
           class="progress-bar mt-3">
        <div class="progress-fill" 
             :style="{ width: uploadProgress + '%' }">
        </div>
      </div>

      <!-- Upload Guidelines -->
      <div class="upload-guidelines mt-3">
        <p class="text-xs" 
           :style="{ color: 'var(--color-content-tertiary)' }">
          Recommended: Square image, at least 400x400px. Max size: 5MB.
        </p>
        <p class="text-xs mt-1" 
           :style="{ color: 'var(--color-content-tertiary)' }">
          Supported formats: JPG, PNG, WebP
        </p>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="error-message mt-3">
        {{ errorMessage }}
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="success-message mt-3">
        {{ successMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Image upload component for profile pictures
 * Handles file selection, validation, upload, and preview
 */

// Import Heroicons
import { 
  UserIcon, 
  PhotoIcon, 
  XMarkIcon 
} from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  currentImage: {
    type: [String, File],
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

// State
const fileInput = ref(null)
const uploading = ref(false)
const uploadProgress = ref(0)
const errorMessage = ref('')
const successMessage = ref('')
const previewUrl = ref(null)

// Computed properties
const currentImageUrl = computed(() => {
  if (previewUrl.value) return previewUrl.value
  if (typeof props.currentImage === 'string') return props.currentImage
  return null
})

/**
 * Trigger file input click
 */
const triggerFileSelect = () => {
  if (fileInput.value) {
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

  // Upload file
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
  const maxSize = 5 * 1024 * 1024 // 5MB in bytes
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
  reader.readAsDataURL(file)
}

/**
 * Upload file
 */
const uploadFile = async (file) => {
  uploading.value = true
  uploadProgress.value = 0

  try {
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10
      }
    }, 100)

    // Emit upload event
    emit('upload', file)

    // Complete progress
    clearInterval(progressInterval)
    uploadProgress.value = 100

    // Show success message
    successMessage.value = 'Image uploaded successfully!'
    setTimeout(() => {
      successMessage.value = ''
      uploadProgress.value = 0
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

// Clear preview when current image prop changes
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
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
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

.progress-bar {
  width: 100%;
  height: 4px;
  background-color: var(--color-surface-tertiary);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--color-primary);
  transition: width 0.3s ease;
  border-radius: 2px;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--color-border-primary);
  border-top: 2px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  padding: 0.5rem;
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 0.375rem;
  color: var(--color-error);
  font-size: 0.875rem;
}

.success-message {
  padding: 0.5rem;
  background-color: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 0.375rem;
  color: var(--color-success);
  font-size: 0.875rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn:disabled:hover {
  transform: none;
}
</style>
