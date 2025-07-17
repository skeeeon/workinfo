<template>
  <div class="card">
    <div class="card-header text-center">
      <h1 class="card-title">Welcome Back</h1>
      <p class="card-subtitle">Sign in to your Hivecard account</p>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-6">
      <!-- Email field -->
      <div>
        <label for="email" class="form-label">Email Address</label>
        <input
          id="email"
          v-model="credentials.email"
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
          v-model="credentials.password"
          type="password"
          class="form-input"
          placeholder="Enter your password"
          required
          :disabled="isLoading"
        />
      </div>

      <!-- Error message -->
      <div v-if="error" class="form-error">
        {{ error }}
      </div>

      <!-- Submit button -->
      <button
        type="submit"
        class="btn btn-primary w-full"
        :disabled="isLoading"
      >
        <span v-if="isLoading" class="spinner mr-2"></span>
        {{ isLoading ? 'Signing In...' : 'Sign In' }}
      </button>
    </form>

    <!-- Footer links -->
    <div class="mt-6 text-center">
      <p class="text-sm" 
         :style="{ color: 'var(--color-content-secondary)' }">
        Don't have an account?
        <NuxtLink to="/register" 
                  class="font-medium"
                  :style="{ color: 'var(--color-primary)' }">
          Sign up here
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
/**
 * Login page for Hivecard
 * Handles user authentication with email and password
 */

// Define layout
definePageMeta({
  layout: 'auth',
  middleware: 'guest' // Redirect authenticated users
})

// Use auth composable
const { loginUser, isLoading, error, clearError } = useAuth()

// Form data
const credentials = ref({
  email: '',
  password: ''
})

// Handle form submission
const handleLogin = async () => {
  clearError()
  await loginUser(credentials.value)
}

// Clear error when user starts typing
watch(credentials, () => {
  if (error.value) {
    clearError()
  }
}, { deep: true })

// SEO
useSeoMeta({
  title: 'Login - Hivecard',
  description: 'Sign in to your Hivecard account to manage your digital business card.',
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

/* Enhanced form styling */
.form-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 1px var(--color-primary);
}

.form-error {
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: var(--color-error);
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

/* Hover effects */
a:hover {
  text-decoration: underline;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn:disabled:hover {
  transform: none;
}
</style>
