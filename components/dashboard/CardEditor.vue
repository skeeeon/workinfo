<template>
  <div class="space-y-6">
    <!-- Personal Information -->
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Personal Information</h2>
        <p class="card-subtitle">Basic details for your business card</p>
      </div>
      
      <form @submit.prevent="handleSave" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- First Name -->
          <div>
            <label for="first_name" class="form-label">
              First Name <span class="text-red-500">*</span>
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
          </div>

          <!-- Last Name -->
          <div>
            <label for="last_name" class="form-label">
              Last Name <span class="text-red-500">*</span>
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
          </div>
        </div>

        <!-- Company -->
        <div>
          <label for="company" class="form-label">
            Company <span class="text-red-500">*</span>
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
        </div>

        <!-- Title -->
        <div>
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

        <!-- Note -->
        <div>
          <label for="note" class="form-label">About</label>
          <textarea
            id="note"
            v-model="formData.note"
            class="form-input"
            rows="3"
            placeholder="Brief description about yourself or your role"
            :disabled="isLoading"
          ></textarea>
          <p class="form-helper">Optional short description (max 200 characters)</p>
        </div>
      </form>
    </div>

    <!-- Contact Information -->
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Contact Information</h2>
        <p class="card-subtitle">How people can reach you</p>
      </div>
      
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Mobile -->
          <div>
            <label for="mobile" class="form-label">Mobile Phone</label>
            <input
              id="mobile"
              v-model="formData.mobile"
              type="tel"
              class="form-input"
              placeholder="+1 (555) 123-4567"
              :disabled="isLoading"
            />
          </div>

          <!-- Office -->
          <div>
            <label for="office" class="form-label">Office Phone</label>
            <input
              id="office"
              v-model="formData.office"
              type="tel"
              class="form-input"
              placeholder="+1 (555) 987-6543"
              :disabled="isLoading"
            />
          </div>
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="form-label">Email Address</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            class="form-input"
            placeholder="john.doe@company.com"
            :disabled="isLoading"
          />
        </div>

        <!-- Website -->
        <div>
          <label for="website" class="form-label">Website</label>
          <input
            id="website"
            v-model="formData.website"
            type="url"
            class="form-input"
            placeholder="https://company.com"
            :disabled="isLoading"
          />
        </div>

        <!-- Calendar -->
        <div>
          <label for="calendar" class="form-label">Calendar Link</label>
          <input
            id="calendar"
            v-model="formData.calendar"
            type="url"
            class="form-input"
            placeholder="https://cal.com/johndoe"
            :disabled="isLoading"
          />
          <p class="form-helper">Link to your booking page (Calendly, Cal.com, etc.)</p>
        </div>
      </div>
    </div>

    <!-- Profile Image -->
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Profile Image</h2>
        <p class="card-subtitle">Upload your professional photo</p>
      </div>
      
      <ImageUpload 
        :current-image="cardData.profile_image"
        @upload="handleImageUpload"
        :disabled="isLoading"
      />
    </div>

    <!-- Theme Customization -->
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Theme Colors</h2>
        <p class="card-subtitle">Customize your card's appearance</p>
      </div>
      
      <ThemeCustomizer />
    </div>

    <!-- Validation Errors -->
    <div v-if="validationErrors.length > 0" class="card border-red-200">
      <div class="card-header">
        <h3 class="text-red-700 font-semibold">Please fix the following errors:</h3>
      </div>
      <ul class="list-disc list-inside space-y-1 text-red-600 text-sm">
        <li v-for="error in validationErrors" :key="error">{{ error }}</li>
      </ul>
    </div>

    <!-- Save Button -->
    <div class="flex justify-end">
      <button
        @click="handleSave"
        class="btn btn-primary"
        :disabled="isLoading || !isFormValid"
      >
        <span v-if="isLoading" class="spinner mr-2"></span>
        {{ isLoading ? 'Saving...' : 'Save Card' }}
      </button>
    </div>
  </div>
</template>

<script setup>
/**
 * Card editor component for dashboard
 * Handles all card information editing with validation
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

// Use card validation
const { validateCard } = useCard()

// Form data - reactive copy of card data
const formData = ref({
  first_name: '',
  last_name: '',
  company: '',
  title: '',
  note: '',
  mobile: '',
  office: '',
  email: '',
  website: '',
  calendar: ''
})

// Validation state
const validationErrors = ref([])

// Watch for card data changes and update form
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
  validationErrors.value = Object.values(validation.errors)
  return validation.isValid
})

/**
 * Handle form save
 */
const handleSave = () => {
  if (!isFormValid.value) {
    return
  }
  
  // Clean up data before saving
  const cleanData = { ...formData.value }
  
  // Trim whitespace
  Object.keys(cleanData).forEach(key => {
    if (typeof cleanData[key] === 'string') {
      cleanData[key] = cleanData[key].trim()
    }
  })
  
  // Format URLs
  if (cleanData.website && !cleanData.website.startsWith('http')) {
    cleanData.website = `https://${cleanData.website}`
  }
  
  if (cleanData.calendar && !cleanData.calendar.startsWith('http')) {
    cleanData.calendar = `https://${cleanData.calendar}`
  }
  
  emit('save', cleanData)
}

/**
 * Handle image upload
 */
const handleImageUpload = (file) => {
  emit('image-upload', file)
}

// Auto-save on form changes (debounced)
let saveTimeout = null
watch(formData, () => {
  if (!isFormValid.value) return
  
  clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => {
    handleSave()
  }, 2000) // Auto-save after 2 seconds of no changes
}, { deep: true })
</script>

<style scoped>
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.form-input {
  transition: border-color 0.2s ease;
}

.form-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 1px var(--color-primary);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn:disabled:hover {
  transform: none;
}

/* Required field styling */
.text-red-500 {
  color: #ef4444;
}

.text-red-600 {
  color: #dc2626;
}

.text-red-700 {
  color: #b91c1c;
}

.border-red-200 {
  border-color: #fecaca;
}
</style>
