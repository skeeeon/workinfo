<template>
  <div class="offline-page">
    <div class="container">
      <div class="offline-content">
        <!-- Logo -->
        <div class="logo">
          <Logo />
        </div>

        <!-- Offline Icon -->
        <div class="offline-icon">
          <WifiSlashIcon class="w-16 h-16" />
        </div>

        <!-- Main Message -->
        <div class="offline-message">
          <h1 class="offline-title">You're Offline</h1>
          <p class="offline-description">
            It looks like you've lost your internet connection. Don't worry - 
            WorkInfo works offline too!
          </p>
        </div>

        <!-- Available Actions -->
        <div class="offline-actions">
          <div class="action-grid">
            <div class="action-card">
              <UserIcon class="action-icon" />
              <h3 class="action-title">Cached Cards</h3>
              <p class="action-description">
                Recently viewed business cards are still available
              </p>
            </div>

            <div class="action-card">
              <DocumentDuplicateIcon class="action-icon" />
              <h3 class="action-title">Your Dashboard</h3>
              <p class="action-description">
                Access your saved card information offline
              </p>
            </div>
          </div>
        </div>

        <!-- Connection Status -->
        <div class="connection-status">
          <div class="status-indicator" :class="{ 'online': isOnline, 'offline': !isOnline }">
            <div class="status-dot"></div>
            <span class="status-text">
              {{ isOnline ? 'Back Online!' : 'No Connection' }}
            </span>
          </div>
          
          <button @click="retryConnection" class="retry-button" :disabled="isRetrying">
            <ArrowPathIcon :class="['w-4 h-4', { 'animate-spin': isRetrying }]" />
            {{ isRetrying ? 'Checking...' : 'Try Again' }}
          </button>
        </div>

        <!-- Navigation Options -->
        <div class="navigation-options">
          <NuxtLink to="/" class="nav-btn primary">
            <HomeIcon class="w-4 h-4" />
            Go Home
          </NuxtLink>
          
          <NuxtLink to="/dashboard" class="nav-btn secondary">
            <UserIcon class="w-4 h-4" />
            Dashboard
          </NuxtLink>
        </div>

        <!-- Features Available Offline -->
        <div class="offline-features">
          <h3 class="features-title">Available offline:</h3>
          <div class="features-grid">
            <div class="feature-item">
              <CheckCircleIcon class="w-5 h-5 text-green-600" />
              <span>View cached business cards</span>
            </div>
            <div class="feature-item">
              <CheckCircleIcon class="w-5 h-5 text-green-600" />
              <span>Generate QR codes</span>
            </div>
            <div class="feature-item">
              <CheckCircleIcon class="w-5 h-5 text-green-600" />
              <span>Download vCard files</span>
            </div>
            <div class="feature-item">
              <CheckCircleIcon class="w-5 h-5 text-green-600" />
              <span>Access your profile</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Offline page for PWA
 * Proper Nuxt page that can be prerendered and cached
 */

// Define page meta
definePageMeta({
  layout: 'default'
})

// Import icons
import {
  WifiSlashIcon,
  UserIcon,
  DocumentDuplicateIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  HomeIcon
} from '@heroicons/vue/24/outline'

// State
const isOnline = ref(false)
const isRetrying = ref(false)

// Initialize online status
onMounted(() => {
  if (import.meta.client) {
    isOnline.value = navigator.onLine
    
    // Listen for online/offline events
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }
})

/**
 * Handle online status changes
 */
const handleOnline = () => {
  isOnline.value = true
  // Show success message or auto-redirect
  setTimeout(() => {
    navigateTo('/')
  }, 1500)
}

const handleOffline = () => {
  isOnline.value = false
}

/**
 * Retry connection
 */
const retryConnection = async () => {
  isRetrying.value = true
  
  try {
    // Try to fetch a small resource to test connectivity
    const response = await fetch('/manifest.webmanifest', {
      method: 'HEAD',
      cache: 'no-cache'
    })
    
    if (response.ok) {
      isOnline.value = true
      navigateTo('/')
    }
  } catch (error) {
    console.log('Still offline')
  } finally {
    isRetrying.value = false
  }
}

// SEO
useSeoMeta({
  title: 'Offline - WorkInfo',
  description: 'WorkInfo works offline! Access your business cards without an internet connection.',
  robots: 'noindex, nofollow'
})
</script>

<style scoped>
.offline-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-surface-primary) 0%, var(--color-surface-secondary) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.container {
  max-width: 600px;
  width: 100%;
}

.offline-content {
  text-align: center;
  background-color: var(--color-surface-primary);
  border-radius: 1rem;
  padding: 3rem 2rem;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-border-primary);
}

.logo {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
}

.offline-icon {
  color: var(--color-content-secondary);
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
}

.offline-message {
  margin-bottom: 3rem;
}

.offline-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-content-primary);
  margin-bottom: 1rem;
}

.offline-description {
  font-size: 1.125rem;
  color: var(--color-content-secondary);
  line-height: 1.6;
  max-width: 400px;
  margin: 0 auto;
}

.offline-actions {
  margin-bottom: 3rem;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.action-card {
  background-color: var(--color-surface-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: 0.75rem;
  padding: 1.5rem 1rem;
  text-align: center;
  transition: all 0.2s ease;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.action-icon {
  width: 2.5rem;
  height: 2.5rem;
  color: var(--color-primary);
  margin: 0 auto 1rem;
}

.action-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-content-primary);
  margin-bottom: 0.5rem;
}

.action-description {
  font-size: 0.875rem;
  color: var(--color-content-secondary);
  line-height: 1.4;
}

.connection-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: var(--color-surface-secondary);
  border-radius: 0.5rem;
  border: 1px solid var(--color-border-primary);
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--color-error);
  transition: background-color 0.3s ease;
}

.status-indicator.online .status-dot {
  background-color: var(--color-success);
}

.status-text {
  font-weight: 500;
  color: var(--color-content-secondary);
  font-size: 0.875rem;
}

.status-indicator.online .status-text {
  color: var(--color-success);
}

.retry-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-button:hover:not(:disabled) {
  background-color: var(--color-primary-darker);
}

.retry-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.navigation-options {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.nav-btn.primary {
  background-color: var(--color-primary);
  color: white;
}

.nav-btn.primary:hover {
  background-color: var(--color-primary-darker);
  transform: translateY(-1px);
}

.nav-btn.secondary {
  background-color: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.nav-btn.secondary:hover {
  background-color: var(--color-primary);
  color: white;
  transform: translateY(-1px);
}

.offline-features {
  border-top: 1px solid var(--color-border-primary);
  padding-top: 2rem;
}

.features-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-content-primary);
  margin-bottom: 1rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-content-secondary);
  text-align: left;
}

@media (max-width: 768px) {
  .offline-content {
    padding: 2rem 1.5rem;
  }
  
  .offline-title {
    font-size: 1.5rem;
  }
  
  .offline-description {
    font-size: 1rem;
  }
  
  .action-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .connection-status {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .navigation-options {
    flex-direction: column;
    align-items: stretch;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
}
</style>
