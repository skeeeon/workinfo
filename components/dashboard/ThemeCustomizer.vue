<template>
  <div class="theme-customizer">
    <!-- Color Pickers -->
    <div class="space-y-4">
      <!-- Light Mode Color -->
      <div>
        <label class="form-label">Light Mode Color</label>
        <div class="color-picker-container">
          <ColorPicker 
            v-model="lightColor"
            label="Light theme primary color"
          />
          <div class="color-info">
            <p class="text-sm font-medium" 
               :style="{ color: 'var(--color-content-primary)' }">
              Primary Color (Light Mode)
            </p>
            <p class="text-xs" 
               :style="{ color: 'var(--color-content-secondary)' }">
              {{ lightColor }}
            </p>
          </div>
        </div>
      </div>

      <!-- Dark Mode Color -->
      <div>
        <label class="form-label">Dark Mode Color</label>
        <div class="color-picker-container">
          <ColorPicker 
            v-model="darkColor"
            label="Dark theme primary color"
          />
          <div class="color-info">
            <p class="text-sm font-medium" 
               :style="{ color: 'var(--color-content-primary)' }">
              Primary Color (Dark Mode)
            </p>
            <p class="text-xs" 
               :style="{ color: 'var(--color-content-secondary)' }">
              {{ darkColor }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Color Presets -->
    <div class="mt-6">
      <label class="form-label">Color Presets</label>
      <div class="preset-grid">
        <button 
          v-for="preset in colorPresets" 
          :key="preset.name"
          @click="applyPreset(preset)"
          class="preset-button"
          :class="{ 'active': isActivePreset(preset) }"
          :aria-label="`Apply ${preset.name} color theme`"
        >
          <div class="preset-colors">
            <div class="preset-color" 
                 :style="{ backgroundColor: preset.light }"></div>
            <div class="preset-color" 
                 :style="{ backgroundColor: preset.dark }"></div>
          </div>
          <span class="preset-name">{{ preset.name }}</span>
        </button>
      </div>
    </div>

    <!-- Theme Preview -->
    <div class="mt-6">
      <label class="form-label">Preview</label>
      <div class="preview-container">
        <div class="preview-mode">
          <div class="preview-card light" 
               :style="{ 
                 '--preview-primary': lightColor,
                 borderColor: lightColor 
               }">
            <div class="preview-header" 
                 :style="{ backgroundColor: lightColor }">
              <span class="preview-text">Light Mode</span>
            </div>
            <div class="preview-content">
              <div class="preview-button" 
                   :style="{ backgroundColor: lightColor }">
                Button
              </div>
            </div>
          </div>
        </div>
        
        <div class="preview-mode">
          <div class="preview-card dark" 
               :style="{ 
                 '--preview-primary': darkColor,
                 borderColor: darkColor 
               }">
            <div class="preview-header" 
                 :style="{ backgroundColor: darkColor }">
              <span class="preview-text">Dark Mode</span>
            </div>
            <div class="preview-content dark-bg">
              <div class="preview-button" 
                   :style="{ backgroundColor: darkColor }">
                Button
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reset Button -->
    <div class="mt-6 flex justify-between items-center">
      <button 
        @click="resetToDefaults"
        class="btn btn-ghost text-sm"
      >
        <ArrowPathIcon class="w-4 h-4 mr-2" />
        Reset to Defaults
      </button>
      
      <div class="text-xs" :style="{ color: 'var(--color-content-tertiary)' }">
        Changes are saved automatically
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Theme customizer component for choosing card colors
 * Allows users to customize primary colors for light and dark modes
 */

// Import Heroicons
import { ArrowPathIcon } from '@heroicons/vue/24/outline'

// Use theme composable
const { customColors, setCustomColors, resetColors } = useTheme()

// Local reactive colors
const lightColor = ref('#2563eb')
const darkColor = ref('#60a5fa')

// Color presets
const colorPresets = [
  { name: 'Blue', light: '#2563eb', dark: '#60a5fa' },
  { name: 'Purple', light: '#7c3aed', dark: '#a78bfa' },
  { name: 'Green', light: '#059669', dark: '#34d399' },
  { name: 'Red', light: '#dc2626', dark: '#f87171' },
  { name: 'Orange', light: '#ea580c', dark: '#fb923c' },
  { name: 'Pink', light: '#db2777', dark: '#f472b6' },
  { name: 'Teal', light: '#0891b2', dark: '#22d3ee' },
  { name: 'Indigo', light: '#4f46e5', dark: '#818cf8' }
]

// Initialize colors from theme
watchEffect(() => {
  lightColor.value = customColors.value.primaryLight
  darkColor.value = customColors.value.primaryDark
})

// Watch for color changes and update theme
watch([lightColor, darkColor], ([newLight, newDark]) => {
  setCustomColors({
    primaryLight: newLight,
    primaryDark: newDark
  })
}, { debounced: 300 })

/**
 * Apply a color preset
 */
const applyPreset = (preset) => {
  lightColor.value = preset.light
  darkColor.value = preset.dark
}

/**
 * Check if preset is currently active
 */
const isActivePreset = (preset) => {
  return lightColor.value === preset.light && darkColor.value === preset.dark
}

/**
 * Reset colors to defaults
 */
const resetToDefaults = () => {
  resetColors()
  lightColor.value = '#2563eb'
  darkColor.value = '#60a5fa'
}
</script>

<style scoped>
.color-picker-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.color-info {
  flex: 1;
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.preset-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 0.5rem;
  border: 2px solid var(--color-border-primary);
  border-radius: 0.5rem;
  background-color: var(--color-surface-primary);
  transition: all 0.2s ease;
  cursor: pointer;
}

.preset-button:hover {
  border-color: var(--color-primary);
  transform: translateY(-1px);
}

.preset-button.active {
  border-color: var(--color-primary);
  background-color: var(--color-primary);
  color: white;
}

.preset-colors {
  display: flex;
  gap: 2px;
}

.preset-color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.preset-name {
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
}

.preview-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 0.5rem;
}

.preview-card {
  border: 2px solid;
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: white;
}

.preview-card.dark .preview-content {
  background-color: #0f172a;
}

.preview-header {
  padding: 0.5rem;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
}

.preview-content {
  padding: 1rem;
  background-color: white;
}

.dark-bg {
  background-color: #0f172a !important;
}

.preview-button {
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  border: none;
  width: 100%;
  text-align: center;
}

.preview-text {
  font-size: 0.75rem;
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .color-picker-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .preset-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .preview-container {
    grid-template-columns: 1fr;
  }
}
</style>
