<template>
  <div class="min-h-screen flex flex-col theme-transition"
       :style="{ backgroundColor: 'var(--color-surface-primary)' }">
    
    <!-- Minimal Header -->
    <header class="py-4 border-b" 
            :style="{ borderColor: 'var(--color-border-primary)' }">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between">
          <!-- WorkInfo logo -->
          <NuxtLink to="/" class="flex items-center transition-colors" 
                    aria-label="WorkInfo - Return to main site">
            <Logo />
          </NuxtLink>
          
          <!-- Theme toggle only -->
          <ThemeToggle />
        </div>
      </div>
    </header>

    <!-- Main content area -->
    <main class="flex-grow">
      <slot />
    </main>

    <!-- Minimal Footer -->
    <footer class="py-6 border-t text-center" 
            :style="{ borderColor: 'var(--color-border-primary)' }">
      <div class="container mx-auto px-4">
        <div class="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <NuxtLink to="/" 
                    class="inline-flex items-center font-medium transition-colors text-sm"
                    :style="{ color: 'var(--color-primary)' }">
            <ArrowLeftIcon class="w-4 h-4 mr-2" />
            Visit WorkInfo.me
          </NuxtLink>
          
          <span class="hidden sm:inline text-xs" 
                :style="{ color: 'var(--color-content-tertiary)' }">
            |
          </span>
          
          <p class="text-xs" 
             :style="{ color: 'var(--color-content-secondary)' }">
            Professional Contact Card
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
/**
 * Minimal card layout for contact cards
 * Provides clean, focused experience for direct sharing
 * Removes main navigation clutter while maintaining WorkInfo branding
 */

// Import Heroicons
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'

// Initialize theme system
const { isDarkMode } = useTheme()
</script>

<style scoped>
.container {
  max-width: 1280px;
}

.theme-transition {
  transition-property: background-color, border-color, color;
  transition-timing-function: ease;
  transition-duration: 0.3s;
}

/* Ensure proper hover states */
a:hover {
  color: var(--color-primary) !important;
  transform: translateX(2px);
  transition: all 0.2s ease;
}

/* Minimal, clean styling */
header {
  backdrop-filter: blur(8px);
}

footer {
  background-color: var(--color-surface-secondary);
}
</style>
