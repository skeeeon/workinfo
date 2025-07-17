<template>
  <div class="card">
    <div class="card-header text-center">
      <h1 class="card-title">Create Your Account</h1>
      <p class="card-subtitle">Join Hivecard and create your digital business card</p>
    </div>

    <form @submit.prevent="handleRegister" class="space-y-6">
      <!-- Username field -->
      <div>
        <label for="username" class="form-label">Username</label>
        <input
          id="username"
          v-model="formData.username"
          type="text"
          class="form-input"
          placeholder="Choose a unique username"
          required
          :disabled="isLoading"
          @input="checkUsernameDebounced"
        />
        <div v-if="usernameError" class="form-error">
          {{ usernameError }}
        </div>
        <div v-else-if="usernameChecking" class="form-helper">
          Checking availability...
        </div>
        <div v-else-if="usernameAvailable && formData.username" class="text-green-600 text-sm mt-1">
          ✓ Username available
        </div>
        <p class="form-helper">
          Your username will be used in your card URL: hivecard.me/users/{{ formData.username || 'username' }}
        </p>
      </div>

      <!-- Email field -->
      <div>
        <label for="email" class="form-label">Email Address</label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          class="form-input"
          placeholder="Enter your email"
          required
          :disabled="isLoading"
        />
      </div>

      <!-- Password field -->
      <div>
        <label for="password" class="form-label">Password</label>
        <input
          id="password"
          v-model="formData.password"
          type="password"
          class="form-input"
          placeholder="Choose a strong password"
          required
          :disabled="isLoading"
        />
        <p class="form-helper">Must be at least 8 characters long</p>
      </div>

      <!-- Password confirmation field -->
      <div>
        <label for="passwordConfirm" class="form-label">Confirm Password</label>
        <input
          id="passwordConfirm"
          v-model="formData.passwordConfirm"
          type="password"
          class="form-input"
          placeholder="Confirm your password"
          required
          :disabled="isLoading"
        />
        <div v-if="passwordMismatch && formData.passwordConfirm" class="form-error">
          Passwords do not match
        </div>
      </div>

      <!-- Error message -->
      <div v-if="error" class="form-error">
        {{ error }}
      </div>

      <!-- Submit button -->
      <button
        type="submit"
        class="btn btn-primary w-full"
        :disabled="isLoading || !isFormValid"
      >
        <span v-if="isLoading" class="spinner mr-2"></span>
        {{ isLoading ? 'Creating Account...' : 'Create Account' }}
      </button>
    </form>

    <!-- Footer links -->
    <div class="mt-6 text-center">
      <p class="text-sm" 
         :style="{ color: 'var(--color-content-secondary)' }">
        Already have an account?
        <NuxtLink to="/login" 
                  class="font-medium"
                  :style="{ color: 'var(--color-primary)' }">
          Sign in here
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
/**
 * Registration page for Hivecard
 * Handles user registration with username availability checking
 */

// Define layout
definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

// Use auth composable
const { registerUser, isLoading, error, clearError, checkUsernameAvailability, validateUsername, validateEmail } = useAuth()

// Form data
const formData = ref({
  username: '',
  email: '',
  password: '',
  passwordConfirm: ''
})

// Username checking state
const usernameChecking = ref(false)
const usernameAvailable = ref(false)
const usernameError = ref('')

// Computed properties
const passwordMismatch = computed(() => {
  return formData.value.password !== formData.value.passwordConfirm && formData.value.passwordConfirm.length > 0
})

const isFormValid = computed(() => {
  return formData.value.username &&
         formData.value.email &&
         formData.value.password &&
         formData.value.passwordConfirm &&
         !passwordMismatch.value &&
         !usernameError.value &&
         usernameAvailable.value
})

// Username availability checking with debounce
let usernameTimeout = null
const checkUsernameDebounced = () => {
  clearTimeout(usernameTimeout)
  usernameError.value = ''
  usernameAvailable.value = false
  
  if (!formData.value.username) return
  
  // Validate username format first
  if (!validateUsername(formData.value.username)) {
    usernameError.value = 'Username must be 3-20 characters, letters, numbers, and underscores only'
    return
  }
  
  usernameTimeout = setTimeout(async () => {
    usernameChecking.value = true
    try {
      const available = await checkUsernameAvailability(formData.value.username)
      usernameAvailable.value = available
      if (!available) {
        usernameError.value = 'Username is already taken'
      }
    } catch (err) {
      usernameError.value = 'Error checking username availability'
    } finally {
      usernameChecking.value = false
    }
  }, 500)
}

// Handle form submission
const handleRegister = async () => {
  clearError()
  
  // Final validation
  if (!validateEmail(formData.value.email)) {
    error.value = 'Please enter a valid email address'
    return
  }
  
  if (formData.value.password.length < 8) {
    error.value = 'Password must be at least 8 characters long'
    return
  }
  
  if (passwordMismatch.value) {
    error.value = 'Passwords do not match'
    return
  }
  
  await registerUser(formData.value)
}

// Clear error when user starts typing
watch(formData, () => {
  if (error.value) {
    clearError()
  }
}, { deep: true })

// SEO
useSeoMeta({
  title: 'Sign Up - Hivecard',
  description: 'Create your Hivecard account and start building your digital business card.',
  robots: 'noindex, nofollow'
})
</script>

<style scoped>
.card {
  max-width: 400px;
  margin: 0 auto;
}

.spinner {
  display: inline-block;
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

.form-error {
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: var(--color-error);
  padding: 0.75rem;
  border-radius: 0.375rem;
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
