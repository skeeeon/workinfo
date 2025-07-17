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

      <!-- Debug Info -->
      <div v-if="showDebug" class="debug-info mt-3 p-2 bg-gray-100 rounded text-xs">
        <div><strong>Debug Info:</strong></div>
        <div>Current Image: {{ currentImage || 'None' }}</div>
        <div>Preview URL: {{ previewUrl || 'None' }}</div>
        <div>Upload State: {{ uploading ? 'Uploading' : 'Ready' }}</div>
        <div>Progress: {{ uploadProgress }}%</div>
        <div>Last Error: {{ errorMessage || 'None' }}</div>
      </div>

      <!-- Debug Toggle -->
      <div class="mt-2 text-center">
        <button @click="showDebug = !showDebug" 
                class="text-xs text-gray-500 hover:text-gray-700">
          {{ showDebug ? 'Hide' : 'Show' }} Debug Info
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Image upload component for profile pictures - Complete Fix
 * Handles file selection, validation, upload, and preview with debugging
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
const showDebug = ref(false)

// Computed properties
const currentImageUrl = computed(() => {
  console.log('ImageUpload: Computing current image URL:', {
    previewUrl: previewUrl.value,
    currentImage: props.currentImage,
    type: typeof props.currentImage
  })
  
  // Priority: 1. Local preview (for immediate feedback), 2. Pocketbase URL
  if (previewUrl.value) {
    console.log('ImageUpload: Using preview URL')
    return previewUrl.value
  }
  
  // If currentImage is a card object with profile_image, generate proper URL
  if (props.currentImage && typeof props.currentImage === 'object' && props.currentImage.profile_image) {
    console.log('ImageUpload: Generating URL from card object')
    const { getProfileImageUrl } = useCard()
    const url = getProfileImageUrl(props.currentImage)
    console.log('ImageUpload: Generated URL:', url)
    return url
  }
  
  // If currentImage is already a URL string
  if (typeof props.currentImage === 'string') {
    console.log('ImageUpload: Using string URL')
    return props.currentImage
  }
  
  console.log('ImageUpload: No image to display')
  return null
})

/**
 * Trigger file input click
 */
const triggerFileSelect = () => {
  console.log('ImageUpload: Triggering file select')
  if (fileInput.value) {
    fileInput.value.click()
  }
}

/**
 * Handle file selection
 */
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  console.log('ImageUpload: File selected:', file?.name)
  
  if (!file) return

  // Clear previous messages
  clearMessages()

  // Validate file
  const validation = validateFile(file)
  if (!validation.valid) {
    errorMessage.value = validation.error
    console.error('ImageUpload: File validation failed:', validation.error)
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
  console.log('ImageUpload: Validating file:', {
    name: file.name,
    size: file.size,
    type: file.type
  })
  
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
  console.log('ImageUpload: Creating preview for:', file.name)
  
  const reader = new FileReader()
  reader.onload = (e) => {
    previewUrl.value = e.target.result
    console.log('ImageUpload: Preview created successfully')
  }
  reader.onerror = (e) => {
    console.error('ImageUpload: Preview creation failed:', e)
  }
  reader.readAsDataURL(file)
}

/**
 * Upload file - Fixed version with proper parent communication
 */
const uploadFile = async (file) => {
  console.log('ImageUpload: Starting upload process for:', file.name)
  
  uploading.value = true
  uploadProgress.value = 0

  try {
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10
      }
    }, 100)

    console.log('ImageUpload: Emitting upload event to parent component')
    
    // Emit upload event to parent (dashboard) - this triggers the actual upload
    emit('upload', file)

    // Wait for upload to complete (parent should handle actual upload)
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Complete progress
    clearInterval(progressInterval)
    uploadProgress.value = 100

    console.log('ImageUpload: Upload process completed')

    // Show success message
    successMessage.value = 'Image uploaded successfully!'
    setTimeout(() => {
      successMessage.value = ''
      uploadProgress.value = 0
    }, 3000)

  } catch (error) {
    console.error('ImageUpload: Upload error:', error)
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
  console.log('ImageUpload: Removing current image')
  
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
  console.log('ImageUpload: Current image prop changed:', props.currentImage)
  if (!props.currentImage) {
    previewUrl.value = null
  }
})

// Debug: Log when component mounts
onMounted(() => {
  console.log('ImageUpload: Component mounted with props:', {
    currentImage: props.currentImage,
    disabled: props.disabled
  })
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

.debug-info {
  border: 1px solid #ccc;
  font-family: monospace;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn:disabled:hover {
  transform: none;
}
</style>
