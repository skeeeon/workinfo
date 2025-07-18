<template>
  <div class="offline-page">
    <div class="container">
      <div class="offline-content">
        <!-- Offline Icon -->
        <div class="offline-icon">
          <WifiIcon class="w-20 h-20" />
          <div class="offline-indicator"></div>
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
          <div class="action-card">
            <UserIcon class="action-icon" />
            <h3 class="action-title">View Your Card</h3>
            <p class="action-description">
              Your saved business card is still available to view and share
            </p>
            <NuxtLink to="/dashboard" class="action-button">
              Go to Dashboard
            </NuxtLink>
          </div>

          <div class="action-card">
            <DocumentDuplicateIcon class="action-icon" />
            <h3 class="action-title">Recently Viewed</h3>
            <p class="action-description">
              Access cards you've recently visited - they're cached locally
            </p>
            <button @click="showRecentCards" class="action-button secondary">
              View Recent
            </button>
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

        <!-- Features Available Offline -->
        <div class="offline-features">
          <h3 class="features-title">What works offline:</h3>
          <div class="features-grid">
            <div class="feature-item">
              <CheckCircleIcon class="w-5 h-5 text-green-600" />
              <span>View your business card</span>
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
              <span>Access cached cards</span>
            </div>
          </div>
        </div>

        <!-- Help Text -->
        <div class="offline-help">
          <p class="help-text">
            <strong>Tip:</strong> When you're back online, any changes you made 
            will automatically sync across your devices.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Offline page for PWA
 * Shown when user is offline and tries to navigate to a non-cached page
 */

import {
  WifiIcon,
  UserIcon,
  DocumentDuplicateIcon,
  ArrowPathIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'

// State
const isOnline = ref(navigator.onLine)
const isRetrying = ref(false)

/**
 * Handle online/offline status changes
 */
const handleOnline = () => {
  isOnline.value = true
  // Auto-redirect to dashboard when back online
  setTimeout(() => {
    navigateTo('/dashboard')
  }, 1000)
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
      navigateTo('/dashboard')
    }
  } catch (error) {
    console.log('Still offline')
  } finally {
    isRetrying.value = false
  }
}

/**
 * Show recently cached cards
 */
const showRecentCards = () => {
  // This could open a modal or navigate to a cached cards page
  // For now, just go to dashboard
  navigateTo('/dashboard')
}

// Lifecycle
onMounted(() => {
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
})

onUnmounted(() => {
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
})

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
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.container {
  max-width: 800px;
  width: 100%;
}

.offline-content {
  text-align: center;
  background-color: white;
  border-radius: 1rem;
  padding: 3rem 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Offline Icon */
.offline-icon {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  color: #64748b;
}

.offline-indicator {
  position: absolute;
  bottom: -5px;
  right: -5px;
  width: 24px;
  height: 24px;
  background-color: #ef4444;
  border: 3px solid white;
  border-radius: 50%;
}

.offline-indicator::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12px;
  height: 2px;
  background-color: white;
  transform: translate(-50%, -50%) rotate(45deg);
}

.offline-indicator::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12px;
  height: 2px;
  background-color: white;
  transform: translate(-50%, -50%) rotate(-45deg);
}

/* Main Message */
.offline-message {
  margin-bottom: 3rem;
}

.offline-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.offline-description {
  font-size: 1.125rem;
  color: #64748b;
  line-height: 1.6;
  max-width: 500px;
  margin: 0 auto;
}

/* Action Cards */
.offline-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.action-card {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 2rem 1.5rem;
  text-align: center;
  transition: all 0.2s ease;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.action-icon {
  width: 3rem;
  height: 3rem;
  color: #3b82f6;
  margin: 0 auto 1rem;
}

.action-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.action-description {
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.action-button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-button:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
}

.action-button.secondary {
  background-color: transparent;
  color: #3b82f6;
  border: 1px solid #3b82f6;
}

.action-button.secondary:hover {
  background-color: #3b82f6;
  color: white;
}

/* Connection Status */
.connection-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: 0.5rem;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #ef4444;
  transition: background-color 0.3s ease;
}

.status-indicator.online .status-dot {
  background-color: #22c55e;
}

.status-text {
  font-weight: 500;
  color: #64748b;
}

.status-indicator.online .status-text {
  color: #059669;
}

.retry-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-button:hover:not(:disabled) {
  background-color: #2563eb;
}

.retry-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Offline Features */
.offline-features {
  margin-bottom: 2rem;
}

.features-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
  max-width: 500px;
  margin: 0 auto;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
  text-align: left;
}

/* Help Text */
.offline-help {
  padding: 1rem;
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 0.5rem;
}

.help-text {
  font-size: 0.875rem;
  color: #1e40af;
  margin: 0;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .offline-content {
    padding: 2rem 1.5rem;
  }
  
  .offline-title {
    font-size: 2rem;
  }
  
  .offline-description {
    font-size: 1rem;
  }
  
  .action-card {
    padding: 1.5rem 1rem;
  }
  
  .connection-status {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
}
</style>
