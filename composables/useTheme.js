/**
 * Theme management composable for Hivecard
 * Handles both system theme (light/dark) and custom brand colors
 * Based on 816tech theme system with custom color extensions
 */

export const useTheme = () => {
  // System theme state
  const currentTheme = useState('theme', () => 'auto')
  const systemPrefersDark = ref(false)
  
  // Custom colors state
  const customColors = useState('customColors', () => ({
    primaryLight: '#2563eb',
    primaryDark: '#60a5fa'
  }))
  
  /**
   * Computed property to determine if dark mode is active
   */
  const isDarkMode = computed(() => {
    return currentTheme.value === 'dark' || 
      (currentTheme.value === 'auto' && systemPrefersDark.value)
  })
  
  /**
   * Get current primary color based on theme
   */
  const currentPrimaryColor = computed(() => {
    return isDarkMode.value ? customColors.value.primaryDark : customColors.value.primaryLight
  })
  
  /**
   * Initialize theme system
   */
  const initTheme = () => {
    if (import.meta.client) {
      // Check system preference
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      systemPrefersDark.value = mediaQuery.matches
      
      // Get saved theme from localStorage
      const savedTheme = localStorage.getItem('hivecard-theme')
      if (['dark', 'light', 'auto'].includes(savedTheme)) {
        currentTheme.value = savedTheme
      }
      
      // Load custom colors from localStorage
      const savedColors = localStorage.getItem('hivecard-colors')
      if (savedColors) {
        try {
          const parsed = JSON.parse(savedColors)
          customColors.value = { ...customColors.value, ...parsed }
        } catch (e) {
          console.error('Failed to parse saved colors:', e)
        }
      }
      
      // Apply theme
      applyTheme()
      
      // Listen for system preference changes
      const updateSystemPreference = (e) => {
        systemPrefersDark.value = e.matches
        applyTheme()
      }
      
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', updateSystemPreference)
      } else if (mediaQuery.addListener) {
        mediaQuery.addListener(updateSystemPreference)
      }
      
      // Clean up on unmount
      onUnmounted(() => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', updateSystemPreference)
        } else if (mediaQuery.removeListener) {
          mediaQuery.removeListener(updateSystemPreference)
        }
      })
    }
  }
  
  /**
   * Set the theme mode
   * @param {string} theme - Theme mode: 'light', 'dark', or 'auto'
   */
  const setTheme = (theme) => {
    if (!['light', 'dark', 'auto'].includes(theme)) {
      console.warn(`Invalid theme: ${theme}`)
      return
    }
    
    currentTheme.value = theme
    saveTheme()
    applyTheme()
  }
  
  /**
   * Toggle between light, dark, and auto themes
   */
  const toggleTheme = () => {
    if (currentTheme.value === 'light') {
      setTheme('dark')
    } else if (currentTheme.value === 'dark') {
      setTheme('auto')
    } else {
      setTheme('light')
    }
  }
  
  /**
   * Set custom colors
   * @param {Object} colors - Color configuration
   * @param {string} colors.primaryLight - Primary color for light mode
   * @param {string} colors.primaryDark - Primary color for dark mode
   */
  const setCustomColors = (colors) => {
    customColors.value = {
      primaryLight: colors.primaryLight || customColors.value.primaryLight,
      primaryDark: colors.primaryDark || colors.primaryLight || customColors.value.primaryDark
    }
    saveCustomColors()
    applyTheme()
  }
  
  /**
   * Reset colors to defaults
   */
  const resetColors = () => {
    customColors.value = {
      primaryLight: '#2563eb',
      primaryDark: '#60a5fa'
    }
    saveCustomColors()
    applyTheme()
  }
  
  /**
   * Apply theme to document
   */
  const applyTheme = () => {
    if (import.meta.client) {
      const shouldBeDark = isDarkMode.value
      
      // Apply dark mode class
      document.documentElement.classList.toggle('dark', shouldBeDark)
      
      // Apply custom colors as CSS variables
      const root = document.documentElement
      root.style.setProperty('--color-primary', currentPrimaryColor.value)
      root.style.setProperty('--color-primary-light', customColors.value.primaryLight)
      root.style.setProperty('--color-primary-dark', customColors.value.primaryDark)
      
      // Generate color variations
      const primaryColor = currentPrimaryColor.value
      const { light, dark } = generateColorVariations(primaryColor)
      
      root.style.setProperty('--color-primary-lighter', light)
      root.style.setProperty('--color-primary-darker', dark)
      
      // Update theme-color meta tag
      const themeColorMeta = document.querySelector('meta[name="theme-color"]')
      if (themeColorMeta) {
        themeColorMeta.content = shouldBeDark ? '#0f172a' : '#ffffff'
      }
    }
  }
  
  /**
   * Generate color variations from base color
   * @param {string} baseColor - Base color in hex format
   * @returns {Object} Color variations
   */
  const generateColorVariations = (baseColor) => {
    // Simple color variation generator
    // In a real app, you might want to use a color library like chroma.js
    const hex = baseColor.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    
    // Generate lighter version (add 20%)
    const lighter = `rgb(${Math.min(255, r + 51)}, ${Math.min(255, g + 51)}, ${Math.min(255, b + 51)})`
    
    // Generate darker version (subtract 20%)
    const darker = `rgb(${Math.max(0, r - 51)}, ${Math.max(0, g - 51)}, ${Math.max(0, b - 51)})`
    
    return { light: lighter, dark: darker }
  }
  
  /**
   * Save theme preference to localStorage
   */
  const saveTheme = () => {
    if (import.meta.client) {
      localStorage.setItem('hivecard-theme', currentTheme.value)
    }
  }
  
  /**
   * Save custom colors to localStorage
   */
  const saveCustomColors = () => {
    if (import.meta.client) {
      localStorage.setItem('hivecard-colors', JSON.stringify(customColors.value))
    }
  }
  
  /**
   * Get theme label for UI
   */
  const themeLabel = computed(() => {
    switch (currentTheme.value) {
      case 'light': return 'Light'
      case 'dark': return 'Dark'
      default: return 'Auto'
    }
  })
  
  /**
   * Load colors from card data
   * @param {Object} cardData - Card data with theme colors
   */
  const loadColorsFromCard = (cardData) => {
    if (cardData?.theme_primary_light || cardData?.theme_primary_dark) {
      setCustomColors({
        primaryLight: cardData.theme_primary_light || customColors.value.primaryLight,
        primaryDark: cardData.theme_primary_dark || customColors.value.primaryDark
      })
    }
  }
  
  /**
   * Get colors for saving to card
   * @returns {Object} Color data for card
   */
  const getColorsForCard = () => {
    return {
      theme_primary_light: customColors.value.primaryLight,
      theme_primary_dark: customColors.value.primaryDark
    }
  }
  
  // Watch for theme changes
  watch(isDarkMode, (newIsDark, oldIsDark) => {
    if (import.meta.client && oldIsDark !== undefined && oldIsDark !== newIsDark) {
      applyTheme()
    }
  })
  
  // Initialize on mount
  onMounted(() => {
    initTheme()
  })
  
  return {
    // State
    currentTheme,
    isDarkMode,
    systemPrefersDark,
    customColors: readonly(customColors),
    currentPrimaryColor,
    themeLabel,
    
    // Theme methods
    setTheme,
    toggleTheme,
    setCustomColors,
    resetColors,
    initTheme,
    
    // Card integration
    loadColorsFromCard,
    getColorsForCard,
    
    // Utilities
    generateColorVariations
  }
}
