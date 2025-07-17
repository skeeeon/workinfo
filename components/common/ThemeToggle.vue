<template>
  <div class="flex items-center space-x-1">
    <button 
      @click="toggleMode" 
      class="relative inline-flex items-center justify-center h-10 w-10 rounded-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-colors"
      :style="{ 
        backgroundColor: isDarkMode ? 'var(--color-surface-tertiary)' : 'rgba(59, 130, 246, 0.1)', 
        color: isDarkMode ? 'var(--color-primary)' : 'var(--color-primary)' 
      }"
      :aria-label="`Toggle theme, currently ${themeLabel} mode`"
    >
      <!-- Icon transition with Heroicons -->
      <transition name="theme-toggle" mode="out-in">
        <MoonIcon v-if="isDarkMode" class="w-5 h-5" aria-hidden="true" />
        <SunIcon v-else-if="currentTheme === 'light'" class="w-5 h-5" aria-hidden="true" />
        <ComputerDesktopIcon v-else class="w-5 h-5" aria-hidden="true" />
      </transition>
    </button>
    
    <!-- Theme label (optional, hidden on mobile) -->
    <span class="text-sm hidden md:inline" 
          :style="{ color: 'var(--color-content-secondary)' }"
          aria-hidden="true">
      {{ themeLabel }}
    </span>
  </div>
</template>

<script setup>
/**
 * Theme toggle component for Hivecard
 * Provides a button to cycle between light, dark, and auto theme modes
 */

// Import Heroicons
import { MoonIcon, SunIcon, ComputerDesktopIcon } from '@heroicons/vue/24/outline'

// Use the theme composable
const { currentTheme, isDarkMode, toggleTheme, themeLabel } = useTheme()

/**
 * Toggle between light, dark, and system themes
 */
const toggleMode = () => {
  toggleTheme()
}
</script>

<style scoped>
/* Theme toggle animation */
.theme-toggle-enter-active,
.theme-toggle-leave-active {
  transition: transform 0.2s ease-out, opacity 0.2s ease-out;
}

.theme-toggle-enter-from,
.theme-toggle-leave-to {
  opacity: 0;
  transform: scale(0.8) rotate(20deg);
}

/* Ensure button has consistent hover state */
button:hover {
  transform: scale(1.05);
  transition: all 0.2s ease;
}

/* Focus ring for accessibility */
button:focus-visible {
  ring-color: var(--color-primary);
  ring-offset-color: var(--color-surface-primary);
}
</style>
