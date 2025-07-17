<template>
  <header class="sticky top-0 z-30 shadow-sm border-b" 
          :style="{ 
            backgroundColor: 'var(--color-surface-primary)',
            borderColor: 'var(--color-border-primary)'
          }">
    <div class="container mx-auto px-4 py-4 md:py-5">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center transition-colors" 
                    aria-label="Hivecard - Return to home">
            <Logo />
          </NuxtLink>
        </div>

        <!-- Navigation -->
        <nav class="hidden md:flex items-center space-x-6">
          <NuxtLink to="/" 
                    class="text-base font-medium py-2 px-3 rounded-md transition-colors duration-200"
                    :style="{ color: 'var(--color-content-primary)' }">
            Home
          </NuxtLink>
          
          <template v-if="!isAuthenticated">
            <NuxtLink to="/login" 
                      class="text-base font-medium py-2 px-3 rounded-md transition-colors duration-200"
                      :style="{ color: 'var(--color-content-primary)' }">
              Login
            </NuxtLink>
            <NuxtLink to="/register" 
                      class="btn btn-primary">
              Sign Up
            </NuxtLink>
          </template>
          
          <template v-else>
            <NuxtLink to="/dashboard" 
                      class="text-base font-medium py-2 px-3 rounded-md transition-colors duration-200"
                      :style="{ color: 'var(--color-content-primary)' }">
              Dashboard
            </NuxtLink>
            <button @click="handleLogout" 
                    class="text-base font-medium py-2 px-3 rounded-md transition-colors duration-200"
                    :style="{ color: 'var(--color-content-primary)' }">
              Logout
            </button>
          </template>
          
          <ThemeToggle />
        </nav>

        <!-- Mobile menu button -->
        <div class="flex items-center space-x-3 md:hidden">
          <ThemeToggle />
          <button @click="toggleMobileMenu"
                  class="p-2 rounded-full h-10 w-10 flex items-center justify-center transition-colors"
                  :style="{ 
                    backgroundColor: showMobileMenu ? 'var(--color-surface-secondary)' : 'transparent',
                    color: 'var(--color-content-primary)'
                  }"
                  :aria-expanded="showMobileMenu">
            <XMarkIcon v-if="showMobileMenu" class="w-5 h-5" />
            <Bars3Icon v-else class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="showMobileMenu" 
           class="md:hidden mt-4 py-4 border-t"
           :style="{ borderColor: 'var(--color-border-primary)' }">
        <nav class="flex flex-col space-y-2">
          <NuxtLink to="/" 
                    @click="closeMobileMenu"
                    class="py-2 px-3 rounded-md transition-colors"
                    :style="{ color: 'var(--color-content-primary)' }">
            Home
          </NuxtLink>
          
          <template v-if="!isAuthenticated">
            <NuxtLink to="/login" 
                      @click="closeMobileMenu"
                      class="py-2 px-3 rounded-md transition-colors"
                      :style="{ color: 'var(--color-content-primary)' }">
              Login
            </NuxtLink>
            <NuxtLink to="/register" 
                      @click="closeMobileMenu"
                      class="py-2 px-3 rounded-md transition-colors"
                      :style="{ color: 'var(--color-content-primary)' }">
              Sign Up
            </NuxtLink>
          </template>
          
          <template v-else>
            <NuxtLink to="/dashboard" 
                      @click="closeMobileMenu"
                      class="py-2 px-3 rounded-md transition-colors"
                      :style="{ color: 'var(--color-content-primary)' }">
              Dashboard
            </NuxtLink>
            <button @click="handleLogout" 
                    class="py-2 px-3 rounded-md transition-colors text-left"
                    :style="{ color: 'var(--color-content-primary)' }">
              Logout
            </button>
          </template>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
/**
 * Main header component for Hivecard
 * Provides navigation and user authentication status
 */

// Import Heroicons
import { XMarkIcon, Bars3Icon } from '@heroicons/vue/24/outline'

// Use composables
const { isAuthenticated, logoutUser } = useAuth()

// Mobile menu state
const showMobileMenu = ref(false)

/**
 * Toggle mobile menu
 */
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

/**
 * Close mobile menu
 */
const closeMobileMenu = () => {
  showMobileMenu.value = false
}

/**
 * Handle logout
 */
const handleLogout = () => {
  logoutUser()
  closeMobileMenu()
}

// Close mobile menu when clicking outside
const handleEscKey = (event) => {
  if (event.key === 'Escape' && showMobileMenu.value) {
    closeMobileMenu()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscKey)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey)
})
</script>

<style scoped>
.container {
  max-width: 1280px;
}

/* Hover effects */
a:hover {
  color: var(--color-primary) !important;
}

nav button:hover {
  color: var(--color-primary) !important;
}
</style>
