<template>
  <div class="logo-container" :class="size">
    <!-- Workinfo logo -->
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" class="logo-image">
      <!-- Hexagon shape representing hive -->
      <path d="M16 2L26 8v16l-10 6L6 24V8z" 
            fill="none" 
            :stroke="isDarkMode ? '#60a5fa' : '#2563eb'" 
            stroke-width="2.5" 
            stroke-linejoin="round" />
      
      <!-- Inner card/document representation -->
      <rect x="10" y="12" width="12" height="8" 
            rx="1" 
            fill="none" 
            :stroke="isDarkMode ? '#60a5fa' : '#2563eb'" 
            stroke-width="1.5" />
      
      <!-- Card lines -->
      <line x1="12" y1="15" x2="18" y2="15" 
            :stroke="isDarkMode ? '#60a5fa' : '#2563eb'" 
            stroke-width="1" />
      <line x1="12" y1="17" x2="16" y2="17" 
            :stroke="isDarkMode ? '#60a5fa' : '#2563eb'" 
            stroke-width="1" />
    </svg>
    
    <div v-if="showText" class="logo-text-container">
      <span class="logo-text" :class="{'sr-only': textHidden}">
        <span class="logo-main">Work</span><span class="logo-suffix">info</span>
      </span>
    </div>
  </div>
</template>

<script setup>
/**
 * Hivecard logo component
 * Features a hexagon (hive) with a business card inside
 */

// Use the theme composable
const { isDarkMode } = useTheme()

// Props definition
const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  showText: {
    type: Boolean,
    default: true
  },
  textHidden: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.logo-container {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.logo-image {
  height: 32px;
  width: 32px;
  transition: all 0.3s ease;
}

.logo-text-container {
  display: flex;
  flex-direction: column;
}

.logo-text {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 1.5rem;
  letter-spacing: -0.02em;
  transition: color 0.3s ease;
  line-height: 1;
}

.logo-main {
  color: var(--color-primary);
}

.logo-suffix {
  color: var(--color-content-secondary);
  font-weight: 500;
}

/* Size variants */
.logo-container.sm .logo-image {
  height: 24px;
  width: 24px;
}

.logo-container.sm .logo-text {
  font-size: 1.125rem;
}

.logo-container.lg .logo-image {
  height: 40px;
  width: 40px;
}

.logo-container.lg .logo-text {
  font-size: 1.75rem;
}

/* Screen reader only utility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
