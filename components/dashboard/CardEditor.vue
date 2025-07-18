<template>
  <div class="card-editor">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      
      <!-- Personal Information Section -->
      <div class="editor-section">
        <div class="section-header">
          <h2 class="section-title">Personal Information</h2>
          <p class="section-subtitle">Basic details for your contact card</p>
        </div>
        
        <div class="form-grid">
          <!-- First Name -->
          <div class="form-group">
            <label for="first_name" class="form-label">
              First Name <span class="required">*</span>
            </label>
            <input
              id="first_name"
              v-model="formData.first_name"
              type="text"
              class="form-input"
              placeholder="John"
              required
              :disabled="isLoading"
            />
            <div v-if="errors.first_name" class="form-error">
              {{ errors.first_name }}
            </div>
          </div>

          <!-- Last Name -->
          <div class="form-group">
            <label for="last_name" class="form-label">
              Last Name <span class="required">*</span>
            </label>
            <input
              id="last_name"
              v-model="formData.last_name"
              type="text"
              class="form-input"
              placeholder="Doe"
              required
              :disabled="isLoading"
            />
            <div v-if="errors.last_name" class="form-error">
              {{ errors.last_name }}
            </div>
          </div>
        </div>

        <!-- Company -->
        <div class="form-group">
          <label for="company" class="form-label">
            Company <span class="required">*</span>
          </label>
          <input
            id="company"
            v-model="formData.company"
            type="text"
            class="form-input"
            placeholder="Acme Corporation"
            required
            :disabled="isLoading"
          />
          <div v-if="errors.company" class="form-error">
            {{ errors.company }}
          </div>
        </div>

        <!-- Address -->
        <div class="form-group">
          <label for="address" class="form-label">Address</label>
          <input
            id="address"
            v-model="formData.address"
            type="text"
            class="form-input"
            placeholder="123 Main St, City, State 12345"
            :disabled="isLoading"
          />
          <div class="form-helper">
            Optional business or office address
          </div>
        </div>

        <!-- Job Title -->
        <div class="form-group">
          <label for="title" class="form-label">Job Title</label>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            class="form-input"
            placeholder="Software Engineer"
            :disabled="isLoading"
          />
        </div>

        <!-- About -->
        <div class="form-group">
          <label for="note" class="form-label">About</label>
          <textarea
            id="note"
            v-model="formData.note"
            class="form-input"
            rows="3"
            placeholder="Brief description about yourself or your role"
            :disabled="isLoading"
          ></textarea>
          <div class="form-helper">
            Optional short description (max 200 characters)
          </div>
        </div>
      </div>

      <!-- Contact Information Section -->
      <div class="editor-section">
        <div class="section-header">
          <h2 class="section-title">Contact Information</h2>
          <p class="section-subtitle">How people can reach you</p>
        </div>
        
        <div class="form-grid">
          <!-- Mobile Phone -->
          <div class="form-group">
            <label for="mobile" class="form-label">Mobile Phone</label>
            <input
              id="mobile"
              v-model="formData.mobile"
              type="tel"
              class="form-input"
              placeholder="+1 (555) 123-4567"
              :disabled="isLoading"
            />
            <div v-if="errors.mobile" class="form-error">
              {{ errors.mobile }}
            </div>
          </div>

          <!-- Office Phone -->
          <div class="form-group">
            <label for="office" class="form-label">Office Phone</label>
            <input
              id="office"
              v-model="formData.office"
              type="tel"
              class="form-input"
              placeholder="+1 (555) 987-6543"
              :disabled="isLoading"
            />
            <div v-if="errors.office" class="form-error">
              {{ errors.office }}
            </div>
          </div>
        </div>

        <!-- Email -->
        <div class="form-group">
          <label for="email" class="form-label">Email Address</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            class="form-input"
            placeholder="john.doe@company.com"
            :disabled="isLoading"
          />
          <div v-if="errors.email" class="form-error">
            {{ errors.email }}
          </div>
        </div>

        <!-- Website -->
        <div class="form-group">
          <label for="website" class="form-label">Website</label>
          <input
            id="website"
            v-model="formData.website"
            type="url"
            class="form-input"
            placeholder="https://company.com"
            :disabled="isLoading"
          />
          <div v-if="errors.website" class="form-error">
            {{ errors.website }}
          </div>
        </div>

        <!-- Calendar -->
        <div class="form-group">
          <label for="calendar" class="form-label">Calendar Link</label>
          <input
            id="calendar"
            v-model="formData.calendar"
            type="url"
            class="form-input"
            placeholder="https://cal.com/johndoe"
            :disabled="isLoading"
          />
          <div class="form-helper">
            Link to your booking page (Calendly, Cal.com, etc.)
          </div>
        </div>
      </div>

      <!-- Profile Image Section -->
      <div class="editor-section">
        <div class="section-header">
          <h2 class="section-title">Profile Image</h2>
          <p class="section-subtitle">Upload your professional photo</p>
        </div>
        
        <ImageUpload 
          :current-image="cardData.profile_image"
          @upload="handleImageUpload"
          :disabled="isLoading"
        />
      </div>

      <!-- Theme Section -->
      <div class="editor-section">
        <div class="section-header">
          <h2 class="section-title">Theme Colors</h2>
          <p class="section-subtitle">Customize your card's appearance</p>
        </div>
        
        <ThemeCustomizer />
      </div>

      <!-- Analytics Section -->
      <div class="editor-section">
        <div class="section-header">
          <h2 class="section-title">Analytics Tracking</h2>
          <p class="section-subtitle">Optional analytics script for tracking card views</p>
        </div>
        
        <div class="form-group">
          <label for="tracking_script" class="form-label">Tracking Script</label>
          <textarea
            id="tracking_script"
            v-model="formData.tracking_script"
            class="form-input"
            rows="3"
            placeholder='<script defer src="https://cloud.umami.is/script.js" data-website-id="your-id"></script>'
            :disabled="isLoading"
          ></textarea>
          <div class="form-helper">
            <p>Paste your analytics tracking script here (Umami, Google Analytics, etc.)</p>
            <p class="text-xs mt-1"><strong>Supported providers:</strong> Umami, Google Analytics, Plausible, Simple Analytics</p>
          </div>
          <div v-if="trackingScriptError" class="form-error">
            {{ trackingScriptError }}
          </div>
          <div v-else-if="trackingScriptValid && formData.tracking_script" class="form-success">
            ✓ Valid tracking script detected
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="submit-section">
        <button
          type="submit"
          class="submit-btn"
          :disabled="isLoading || !isFormValid"
        >
          <span v-if="isLoading" class="spinner"></span>
          {{ isLoading ? 'Saving...' : 'Save Card' }}
        </button>
      </div>
    </form>

    <!-- Auto-save indicator -->
    <div v-if="autoSaving" class="auto-save-indicator">
      Auto-saving...
    </div>
  </div>
</template>

<script setup>
/**
 * Card Editor component - Clean implementation with address field
 * Handles card data editing with validation and auto-save
 */

// Props
const props = defineProps({
  cardData: {
    type: Object,
    default: () => ({})
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['save', 'image-upload'])

// Composables
const { validateCard } = useCard()
const { validateTrackingScript: validateScript } = useTrackingScript()

// Form data
const formData = ref({
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
  tracking_script: ''
})

// State
const errors = ref({})
const autoSaving = ref(false)
const trackingScriptError = ref('')
const trackingScriptValid = ref(false)
let saveTimeout = null

// Watch for card data changes
watch(() => props.cardData, (newData) => {
  Object.keys(formData.value).forEach(key => {
    if (newData[key] !== undefined) {
      formData.value[key] = newData[key] || ''
    }
  })
}, { immediate: true, deep: true })

// Computed properties
const isFormValid = computed(() => {
  const validation = validateCard(formData.value)
  errors.value = validation.errors
  
  // Also check tracking script validation
  const isTrackingValid = !formData.value.tracking_script || trackingScriptValid.value
  
  return validation.isValid && isTrackingValid
})

/**
 * Handle form submission
 */
const handleSubmit = () => {
  if (!isFormValid.value) return
  
  const cleanData = cleanFormData(formData.value)
  emit('save', cleanData)
}

/**
 * Validate tracking script for security
 */
const validateTrackingScript = (script) => {
  const result = validateScript(script)
  trackingScriptError.value = result.error || ''
  trackingScriptValid.value = result.isValid
  return result.isValid
}

// Watch for tracking script changes
watch(() => formData.value.tracking_script, (newScript) => {
  validateTrackingScript(newScript)
}, { immediate: true })

/**
 * Handle image upload
 */
const handleImageUpload = (file) => {
  emit('image-upload', file)
}

/**
 * Clean form data before submission
 */
const cleanFormData = (data) => {
  const cleaned = { ...data }
  
  // Trim whitespace
  Object.keys(cleaned).forEach(key => {
    if (typeof cleaned[key] === 'string') {
      cleaned[key] = cleaned[key].trim()
    }
  })
  
  // Format URLs
  if (cleaned.website && !cleaned.website.startsWith('http')) {
    cleaned.website = `https://${cleaned.website}`
  }
  
  if (cleaned.calendar && !cleaned.calendar.startsWith('http')) {
    cleaned.calendar = `https://${cleaned.calendar}`
  }
  
  return cleaned
}

// Auto-save functionality
watch(formData, () => {
  if (!isFormValid.value) return
  
  clearTimeout(saveTimeout)
  autoSaving.value = true
  
  saveTimeout = setTimeout(() => {
    handleSubmit()
    autoSaving.value = false
  }, 3000) // Auto-save after 3 seconds of inactivity
}, { deep: true })

// Clean up on unmount
onUnmounted(() => {
  clearTimeout(saveTimeout)
})
</script>

<style scoped>
/* Main container */
.card-editor {
  position: relative;
}

/* Editor sections */
.editor-section {
  background-color: var(--color-surface-primary);
  border: 1px solid var(--color-border-primary);
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.section-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border-primary);
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

/* Form styling */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-content-primary);
  margin-bottom: 0.5rem;
}

.required {
  color: var(--color-error);
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border-primary);
  border-radius: 0.375rem;
  background-color: var(--color-surface-primary);
  color: var(--color-content-primary);
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 1px var(--color-primary);
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-input::placeholder {
  color: var(--color-content-tertiary);
}

.form-error {
  color: var(--color-error);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-helper {
  color: var(--color-content-secondary);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-success {
  color: var(--color-success);
  font-size: 0.875rem;
  margin-top: 0.25rem;
  font-weight: 500;
}

/* Submit section */
.submit-section {
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
}

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
}

.submit-btn:hover:not(:disabled) {
  background-color: var(--color-primary-darker);
  transform: translateY(-1px);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Auto-save indicator */
.auto-save-indicator {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  background-color: var(--color-primary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive design */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .editor-section {
    padding: 1rem;
  }
  
  .submit-section {
    justify-content: stretch;
  }
  
  .submit-btn {
    width: 100%;
  }
}
</style>
