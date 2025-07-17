<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <!-- Logo -->
        <div class="logo-section">
          <NuxtLink to="/" class="logo-link">
            <Logo />
          </NuxtLink>
        </div>

        <!-- Navigation -->
        <nav class="nav-section">
          <NuxtLink to="/" class="nav-link">
            Home
          </NuxtLink>
          
          <!-- Client-only auth navigation to prevent hydration issues -->
          <ClientOnly>
            <template v-if="isAuthenticated">
              <NuxtLink to="/dashboard" class="nav-link">
                Dashboard
              </NuxtLink>
              <button @click="handleLogout" class="nav-link nav-button">
                Logout
              </button>
            </template>
            <template v-else>
              <NuxtLink to="/login" class="nav-link">
                Login
              </NuxtLink>
              <NuxtLink to="/register" class="btn btn-primary">
                Sign Up
              </NuxtLink>
            </template>
          </ClientOnly>
          
          <ThemeToggle />
        </nav>

        <!-- Mobile menu button -->
        <div class="mobile-menu-section">
          <ThemeToggle />
          <button @click="toggleMobileMenu" class="mobile-menu-button">
            <XMarkIcon v-if="showMobileMenu" class="w-5 h-5" />
            <Bars3Icon v-else class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="showMobileMenu" class="mobile-menu">
        <nav class="mobile-nav">
          <NuxtLink to="/" @click="closeMobileMenu" class="mobile-nav-link">
            Home
          </NuxtLink>
          
          <ClientOnly>
            <template v-if="isAuthenticated">
              <NuxtLink to="/dashboard" @click="closeMobileMenu" class="mobile-nav-link">
                Dashboard
              </NuxtLink>
              <button @click="handleLogout" class="mobile-nav-link mobile-nav-button">
                Logout
              </button>
            </template>
            <template v-else>
              <NuxtLink to="/login" @click="closeMobileMenu" class="mobile-nav-link">
                Login
              </NuxtLink>
              <NuxtLink to="/register" @click="closeMobileMenu" class="mobile-nav-link">
                Sign Up
              </NuxtLink>
            </template>
          </ClientOnly>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
/**
 * Header component - Fixed with proper spacing and no hydration issues
 */

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

// Close mobile menu on escape key
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
/* Header with proper spacing */
.header {
  position: sticky;
  top: 0;
  z-index: 30;
  background-color: var(--color-surface-primary);
  border-bottom: 1px solid var(--color-border-primary);
  box-shadow: var(--shadow-sm);
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 80px; /* Increased from default for better spacing */
  padding: 1rem 0;
}

.logo-section {
  display: flex;
  align-items: center;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.logo-link:hover {
  opacity: 0.8;
}

/* Navigation */
.nav-section {
  display: none;
  align-items: center;
  gap: 2rem;
}

@media (min-width: 768px) {
  .nav-section {
    display: flex;
  }
}

.nav-link {
  color: var(--color-content-primary);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.nav-link:hover {
  color: var(--color-primary);
  background-color: var(--color-surface-hover);
}

.nav-button {
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
}

/* Mobile menu */
.mobile-menu-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

@media (min-width: 768px) {
  .mobile-menu-section {
    display: none;
  }
}

.mobile-menu-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 0.375rem;
  background-color: var(--color-surface-secondary);
  border: 1px solid var(--color-border-primary);
  color: var(--color-content-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.mobile-menu-button:hover {
  background-color: var(--color-surface-hover);
}

.mobile-menu {
  border-top: 1px solid var(--color-border-primary);
  padding: 1rem 0;
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-nav-link {
  color: var(--color-content-primary);
  text-decoration: none;
  font-weight: 500;
  padding: 0.75rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}

.mobile-nav-link:hover {
  color: var(--color-primary);
  background-color: var(--color-surface-hover);
}

.mobile-nav-button {
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  text-align: left;
}

/* Button styling */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 600;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--color-primary-darker);
  transform: translateY(-1px);
}
</style>
