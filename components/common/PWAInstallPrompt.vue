<template>
  <div v-if="showInstallPrompt" class="install-prompt">
    <!-- Standard PWA Install (Android/Desktop) -->
    <div v-if="canInstallPWA && !isIOS" class="install-banner">
      <div class="banner-content">
        <div class="banner-icon">
          <ArrowDownTrayIcon class="w-6 h-6" />
        </div>
        <div class="banner-text">
          <h3 class="banner-title">Install WorkInfo</h3>
          <p class="banner-description">Get the app experience with offline access</p>
        </div>
        <div class="banner-actions">
          <button @click="installPWA" class="install-btn">
            Install
          </button>
          <button @click="dismissPrompt" class="dismiss-btn">
            Later
          </button>
        </div>
      </div>
    </div>

    <!-- iOS Manual Install Instructions -->
    <div v-else-if="isIOS && !isStandalone" class="ios-install-guide">
      <div class="guide-content">
        <div class="guide-header">
          <div class="guide-icon">
            <DevicePhoneMobileIcon class="w-6 h-6" />
          </div>
          <div class="guide-text">
            <h3 class="guide-title">Install WorkInfo App</h3>
            <p class="guide-description">Add to your home screen for the best experience</p>
          </div>
          <button @click="showInstructions = !showInstructions" class="guide-toggle">
            <ChevronDownIcon 
              :class="['w-5 h-5 transition-transform', { 'rotate-180': showInstructions }]" 
            />
          </button>
        </div>

        <!-- Step-by-step instructions -->
        <div v-if="showInstructions" class="installation-steps">
          <!-- Safari instructions -->
          <div v-if="isSafari" class="steps-container">
            <div class="browser-notice">
              <CheckCircleIcon class="w-5 h-5 text-green-600" />
              <span>You're using Safari - perfect for installation!</span>
            </div>
            
            <div class="steps-list">
              <div class="step">
                <div class="step-number">1</div>
                <div class="step-content">
                  <p class="step-text">Tap the <strong>Share</strong> button</p>
                  <div class="step-icon">
                    <ShareIcon class="w-4 h-4" />
                  </div>
                </div>
              </div>
              
              <div class="step">
                <div class="step-number">2</div>
                <div class="step-content">
                  <p class="step-text">Scroll down and tap <strong>"Add to Home Screen"</strong></p>
                  <div class="step-visual">
                    <PlusIcon class="w-4 h-4" />
                    <span class="step-visual-text">Add to Home Screen</span>
                  </div>
                </div>
              </div>
              
              <div class="step">
                <div class="step-number">3</div>
                <div class="step-content">
                  <p class="step-text">Tap <strong>"Add"</strong> to confirm</p>
                  <div class="step-icon">
                    <CheckIcon class="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Other browsers on iOS -->
          <div v-else class="steps-container">
            <div class="browser-notice warning">
              <ExclamationTriangleIcon class="w-5 h-5 text-amber-600" />
              <span>Installation requires Safari on iOS</span>
            </div>
            
            <div class="alternative-steps">
              <div class="step">
                <div class="step-number">1</div>
                <div class="step-content">
                  <p class="step-text">Copy this page's URL</p>
                  <button @click="copyURL" class="copy-btn">
                    <ClipboardIcon class="w-4 h-4" />
                    Copy URL
                  </button>
                </div>
              </div>
              
              <div class="step">
                <div class="step-number">2</div>
                <div class="step-content">
                  <p class="step-text">Open <strong>Safari</strong> and paste the URL</p>
                </div>
              </div>
              
              <div class="step">
                <div class="step-number">3</div>
                <div class="step-content">
                  <p class="step-text">Follow the Safari installation steps above</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Dismiss option -->
          <div class="guide-actions">
            <button @click="dismissPrompt" class="dismiss-guide-btn">
              Don't show again
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * PWA Installation Prompt Component
 * Handles both automatic PWA installation and iOS manual instructions
 */

import {
  ArrowDownTrayIcon,
  DevicePhoneMobileIcon,
  ChevronDownIcon,
  ShareIcon,
  PlusIcon,
  CheckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClipboardIcon
} from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  autoShow: {
    type: Boolean,
    default: true
  },
  showOnMobile: {
    type: Boolean,
    default: true
  },
  showOnDesktop: {
    type: Boolean,
    default: false
  }
})

// State
const showInstallPrompt = ref(false)
const showInstructions = ref(false)
const deferredPrompt = ref(null)
const isInstalled = ref(false)

// Device detection
const isIOS = ref(false)
const isSafari = ref(false)
const isStandalone = ref(false)
const canInstallPWA = ref(false)

/**
 * Initialize device detection
 */
const initializeDetection = () => {
  if (!import.meta.client) return

  // Detect iOS
  isIOS.value = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

  // Detect Safari
  isSafari.value = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

  // Detect if already installed/standalone
  isStandalone.value = window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true

  // Check if already dismissed
  const dismissed = localStorage.getItem('pwa-install-dismissed')
  const dismissedTime = dismissed ? parseInt(dismissed) : 0
  const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)

  // Show prompt logic
  if (!dismissed || dismissedTime < weekAgo) {
    if (isIOS.value && props.showOnMobile && !isStandalone.value) {
      showInstallPrompt.value = true
    } else if (!isIOS.value) {
      // Will be shown when beforeinstallprompt fires
      canInstallPWA.value = false
    }
  }
}

/**
 * Handle PWA install prompt
 */
const handleBeforeInstallPrompt = (e) => {
  e.preventDefault()
  deferredPrompt.value = e
  canInstallPWA.value = true

  // Show prompt if conditions are met
  if (props.autoShow && !isInstalled.value) {
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (!dismissed) {
      if ((props.showOnMobile && isMobile()) || (props.showOnDesktop && !isMobile())) {
        showInstallPrompt.value = true
      }
    }
  }
}

/**
 * Install PWA (for supported browsers)
 */
const installPWA = async () => {
  if (!deferredPrompt.value) return

  try {
    deferredPrompt.value.prompt()
    const { outcome } = await deferredPrompt.value.userChoice
    
    if (outcome === 'accepted') {
      isInstalled.value = true
      showInstallPrompt.value = false
    }
    
    deferredPrompt.value = null
    canInstallPWA.value = false
  } catch (error) {
    console.error('PWA installation failed:', error)
  }
}

/**
 * Copy current URL to clipboard
 */
const copyURL = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    // Could add toast notification here
  } catch (error) {
    console.error('Failed to copy URL:', error)
  }
}

/**
 * Dismiss install prompt
 */
const dismissPrompt = () => {
  showInstallPrompt.value = false
  localStorage.setItem('pwa-install-dismissed', Date.now().toString())
}

/**
 * Check if device is mobile
 */
const isMobile = () => {
  return window.innerWidth <= 768
}

/**
 * Handle app install event
 */
const handleAppInstalled = () => {
  isInstalled.value = true
  showInstallPrompt.value = false
  console.log('PWA was installed')
}

// Lifecycle
onMounted(() => {
  if (!import.meta.client) return

  initializeDetection()

  // Listen for PWA install prompt
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.addEventListener('appinstalled', handleAppInstalled)

  // Auto-show instructions on iOS after a delay
  if (isIOS.value && showInstallPrompt.value && props.autoShow) {
    setTimeout(() => {
      showInstructions.value = true
    }, 2000)
  }
})

onUnmounted(() => {
  if (!import.meta.client) return
  
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.removeEventListener('appinstalled', handleAppInstalled)
})

// Expose methods for parent components
defineExpose({
  showPrompt: () => { showInstallPrompt.value = true },
  hidePrompt: () => { showInstallPrompt.value = false },
  canInstall: () => canInstallPWA.value || (isIOS.value && !isStandalone.value)
})
</script>

<style scoped>
/* Standard PWA Install Banner */
.install-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-darker));
  color: white;
  z-index: 50;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(100%);
  animation: slideUp 0.3s ease-out forwards;
}

.banner-content {
  display: flex;
  align-items: center;
  padding: 1rem;
  max-width: 600px;
  margin: 0 auto;
  gap: 1rem;
}

.banner-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-text {
  flex: 1;
  min-width: 0;
}

.banner-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.banner-description {
  font-size: 0.875rem;
  opacity: 0.9;
}

.banner-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.install-btn {
  background-color: white;
  color: var(--color-primary);
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.install-btn:hover {
  background-color: rgba(255, 255, 255, 0.9);
  transform: translateY(-1px);
}

.dismiss-btn {
  background: transparent;
  color: white;
  padding: 0.5rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dismiss-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* iOS Install Guide */
.ios-install-guide {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--color-surface-primary);
  border-top: 1px solid var(--color-border-primary);
  z-index: 50;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(100%);
  animation: slideUp 0.3s ease-out forwards;
  max-height: 80vh;
  overflow-y: auto;
}

.guide-content {
  max-width: 600px;
  margin: 0 auto;
}

.guide-header {
  display: flex;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
  cursor: pointer;
  border-bottom: 1px solid var(--color-border-primary);
}

.guide-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  background-color: var(--color-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.guide-text {
  flex: 1;
  min-width: 0;
}

.guide-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-content-primary);
  margin-bottom: 0.25rem;
}

.guide-description {
  font-size: 0.875rem;
  color: var(--color-content-secondary);
}

.guide-toggle {
  background: none;
  border: none;
  color: var(--color-content-secondary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}

.guide-toggle:hover {
  background-color: var(--color-surface-secondary);
}

/* Installation Steps */
.installation-steps {
  padding: 0;
}

.steps-container {
  padding: 1rem;
}

.browser-notice {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 0.375rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  color: var(--color-content-primary);
}

.browser-notice.warning {
  background-color: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.2);
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.step {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.step-number {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  background-color: var(--color-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.step-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.step-text {
  color: var(--color-content-primary);
  line-height: 1.5;
}

.step-icon {
  align-self: flex-start;
  padding: 0.5rem;
  background-color: var(--color-surface-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: 0.375rem;
  color: var(--color-content-secondary);
}

.step-visual {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background-color: var(--color-surface-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: var(--color-content-primary);
  align-self: flex-start;
}

.step-visual-text {
  font-weight: 500;
}

.copy-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  align-self: flex-start;
}

.copy-btn:hover {
  background-color: var(--color-primary-darker);
}

.guide-actions {
  padding: 1rem;
  border-top: 1px solid var(--color-border-primary);
  text-align: center;
}

.dismiss-guide-btn {
  background: none;
  border: none;
  color: var(--color-content-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}

.dismiss-guide-btn:hover {
  background-color: var(--color-surface-secondary);
  color: var(--color-content-primary);
}

/* Animations */
@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .banner-content {
    padding: 0.75rem;
    gap: 0.75rem;
  }
  
  .banner-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .install-btn,
  .dismiss-btn {
    padding: 0.625rem 1rem;
    width: 100%;
    text-align: center;
  }
  
  .guide-header {
    padding: 0.75rem;
  }
  
  .steps-container {
    padding: 0.75rem;
  }
}
</style>
