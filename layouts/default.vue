<template>
  <div class="app-layout">
    <!-- Navigation -->
    <AppNavigation />
    
    <!-- Main Content -->
    <main class="main-content">
      <slot />
    </main>
    
    <!-- Footer -->
    <AppFooter />
    
    <!-- PWA Install Prompt - Added for iOS installation guidance -->
    <PWAInstallPrompt 
      :auto-show="true"
      :show-on-mobile="true"
      :show-on-desktop="false"
    />
  </div>
</template>

<script setup>
/**
 * Default layout with PWA install prompt support
 * Includes site-wide navigation, footer, and PWA installation guidance
 */

// Import components
import AppNavigation from '~/components/layout/AppNavigation.vue'
import AppFooter from '~/components/layout/AppFooter.vue'
import PWAInstallPrompt from '~/components/common/PWAInstallPrompt.vue'

// Theme management
const { currentTheme, initializeTheme } = useTheme()

// Initialize theme on mount
onMounted(() => {
  initializeTheme()
})

// Watch for theme changes and apply to document
watch(currentTheme, (newTheme) => {
  if (import.meta.client) {
    document.documentElement.setAttribute('data-theme', newTheme)
  }
}, { immediate: true })
</script>

<style>
/* Global app layout styles */
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-surface-primary);
  color: var(--color-content-primary);
}

.main-content {
  flex: 1;
  width: 100%;
}

/* PWA-specific styles */
@media (display-mode: standalone) {
  /* Styles when app is installed as PWA */
  .app-layout {
    /* Add safe area support for devices with notches */
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
  }
  
  /* Hide certain elements when in PWA mode */
  .pwa-hide {
    display: none;
  }
}

/* iOS PWA status bar styling */
@supports (-webkit-touch-callout: none) {
  @media (display-mode: standalone) {
    .app-layout {
      /* iOS PWA status bar handling */
      padding-top: max(env(safe-area-inset-top), 20px);
    }
  }
}

/* Print styles */
@media print {
  .app-layout {
    min-height: auto;
  }
  
  .main-content {
    flex: none;
  }
  
  /* Hide navigation and footer when printing */
  nav,
  footer,
  .pwa-install-prompt {
    display: none !important;
  }
}
</style>
