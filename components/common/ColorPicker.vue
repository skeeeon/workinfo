<template>
  <div class="color-picker">
    <!-- Visual color display -->
    <button
      @click="openPicker"
      class="color-display"
      :style="{ backgroundColor: modelValue }"
      :aria-label="label || 'Choose color'"
      :disabled="disabled"
    >
      <span v-if="!modelValue" class="no-color">
        <SwatchIcon class="w-4 h-4" />
      </span>
    </button>

    <!-- Native color input (hidden) -->
    <input
      ref="colorInput"
      type="color"
      :value="modelValue"
      @input="handleColorChange"
      class="hidden"
      :disabled="disabled"
    />

    <!-- Color value display -->
    <div v-if="showValue" class="color-value">
      <div class="color-info">
        <p class="color-label" 
           :style="{ color: 'var(--color-content-primary)' }">
          {{ label || 'Color' }}
        </p>
        <input
          v-model="hexValue"
          @input="handleHexInput"
          @blur="validateHex"
          class="hex-input"
          placeholder="#000000"
          maxlength="7"
          :disabled="disabled"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Color picker component
 * Provides an interface for selecting colors with hex input
 */

// Import Heroicons
import { SwatchIcon } from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  modelValue: {
    type: String,
    default: '#000000'
  },
  label: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  showValue: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// Template refs
const colorInput = ref(null)

// Local state
const hexValue = ref('')

// Initialize hex value
watchEffect(() => {
  hexValue.value = props.modelValue || '#000000'
})

/**
 * Open the native color picker
 */
const openPicker = () => {
  if (colorInput.value && !props.disabled) {
    colorInput.value.click()
  }
}

/**
 * Handle color change from native picker
 */
const handleColorChange = (event) => {
  const newColor = event.target.value
  hexValue.value = newColor
  emit('update:modelValue', newColor)
}

/**
 * Handle hex input changes
 */
const handleHexInput = (event) => {
  let value = event.target.value
  
  // Ensure it starts with #
  if (value && !value.startsWith('#')) {
    value = '#' + value
  }
  
  hexValue.value = value
  
  // Only emit if it's a valid hex color
  if (isValidHex(value)) {
    emit('update:modelValue', value)
  }
}

/**
 * Validate hex input on blur
 */
const validateHex = () => {
  if (!isValidHex(hexValue.value)) {
    // Reset to current model value if invalid
    hexValue.value = props.modelValue || '#000000'
  }
}

/**
 * Check if a string is a valid hex color
 */
const isValidHex = (hex) => {
  if (!hex) return false
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  return hexRegex.test(hex)
}

/**
 * Convert hex to RGB for better color manipulation
 */
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

/**
 * Get contrast color for text display
 */
const getContrastColor = (backgroundColor) => {
  const rgb = hexToRgb(backgroundColor)
  if (!rgb) return '#000000'
  
  // Calculate relative luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
  
  // Return black or white based on luminance
  return luminance > 0.5 ? '#000000' : '#ffffff'
}
</script>

<style scoped>
.color-picker {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  width: 100%;
}

.color-display {
  width: 40px;
  height: 40px;
  border: 2px solid var(--color-border-primary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.color-display:hover {
  border-color: var(--color-primary);
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.color-display:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.color-display:disabled:hover {
  transform: none;
  border-color: var(--color-border-primary);
}

.no-color {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-content-tertiary);
  background-color: var(--color-surface-secondary);
  width: 100%;
  height: 100%;
}

.color-value {
  flex: 1;
  min-width: 0;
}

.color-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;
}

.color-label {
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
  line-height: 1.2;
}

.hex-input {
  width: 100%;
  max-width: 120px;
  padding: 0.375rem 0.5rem;
  border: 1px solid var(--color-border-primary);
  border-radius: 0.25rem;
  background-color: var(--color-surface-primary);
  color: var(--color-content-primary);
  font-size: 0.75rem;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  transition: border-color 0.2s ease;
}

.hex-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 1px var(--color-primary);
}

.hex-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Color validation feedback */
.hex-input:invalid {
  border-color: var(--color-error);
}

/* Focus styles for accessibility */
.color-display:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--color-primary);
}

/* Ensure proper contrast for color display */
.color-display::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 40%, rgba(255, 255, 255, 0.1) 50%, transparent 60%);
  pointer-events: none;
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .color-picker {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .color-info {
    width: 100%;
  }
  
  .hex-input {
    max-width: 100%;
  }
}
</style>
