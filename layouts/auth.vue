<template>
  <div class="min-h-screen flex flex-col theme-transition" 
       :style="{ backgroundColor: 'var(--color-surface-primary)' }">
    
    <!-- Simple header for auth pages -->
    <header class="py-6 border-b" 
            :style="{ borderColor: 'var(--color-border-primary)' }">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between">
          <NuxtLink to="/" class="flex items-center">
            <Logo />
          </NuxtLink>
          <ThemeToggle />
        </div>
      </div>
    </header>

    <!-- Main content area -->
    <main class="flex-grow flex items-center justify-center py-12">
      <div class="w-full max-w-md">
        <slot />
      </div>
    </main>

    <!-- Simple footer -->
    <footer class="py-6 border-t text-center" 
            :style="{ borderColor: 'var(--color-border-primary)' }">
      <div class="container mx-auto px-4">
        <p class="text-sm" 
           :style="{ color: 'var(--color-content-secondary)' }">
          © {{ new Date().getFullYear() }} Hivecard. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
/**
 * Authentication layout for login and register pages
 * Provides a clean, centered layout for authentication forms
 */

// Initialize theme
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
</style>
