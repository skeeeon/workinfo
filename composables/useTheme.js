/**
 * Theme management composable - IMPROVED: Prevent recursive calls
 * Handles light/dark mode and custom brand colors
 */

import { ref, computed, watch, onMounted } from 'vue'

export const useTheme = () => {
  // Theme state
  const currentTheme = useState('theme', () => 'auto')
  const systemPrefersDark = ref(false)
  const customColors = useState('customColors', () => ({
    primaryLight: '#2563eb',
    primaryDark: '#60a5fa'
  }))
  
  // IMPROVEMENT: Track loading state to prevent recursive calls
  const isLoadingColors = ref(false)
  
  // Computed properties
  const isDarkMode = computed(() => {
    return currentTheme.value === 'dark' || 
           (currentTheme.value === 'auto' && systemPrefersDark.value)
  })
  
  const currentPrimaryColor = computed(() => {
    return isDarkMode.value ? customColors.value.primaryDark : customColors.value.primaryLight
  })
  
  const themeLabel = computed(() => {
    switch (currentTheme.value) {
      case 'light': return 'Light'
      case 'dark': return 'Dark'
      default: return 'Auto'
    }
  })
  
  /**
   * Initialize theme system
   */
  const initTheme = () => {
    if (!import.meta.client) return
    
    // Check system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    systemPrefersDark.value = mediaQuery.matches
    
    // Load saved theme
    const savedTheme = localStorage.getItem('workinfo-theme')
    if (['light', 'dark', 'auto'].includes(savedTheme)) {
      currentTheme.value = savedTheme
    }
    
    // Load saved colors
    const savedColors = localStorage.getItem('workinfo-colors')
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
    
    // Listen for system changes
    const handleSystemChange = (e) => {
      systemPrefersDark.value = e.matches
    }
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemChange)
    } else {
      mediaQuery.addListener(handleSystemChange)
    }
  }
  
  /**
   * Set theme mode
   * @param {string} theme - Theme mode ('light', 'dark', 'auto')
   */
  const setTheme = (theme) => {
    if (!['light', 'dark', 'auto'].includes(theme)) return
    
    currentTheme.value = theme
    saveTheme()
    applyTheme()
  }
  
  /**
   * Toggle theme between light, dark, and auto
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
   * Set custom colors - IMPROVED: Prevent recursive calls
   * @param {Object} colors - Color configuration
   */
  const setCustomColors = (colors) => {
    // IMPROVEMENT: Prevent recursive calls during loading
    if (isLoadingColors.value) {
      console.log('Skipping setCustomColors - already loading')
      return
    }
    
    const newColors = {
      primaryLight: colors.primaryLight || customColors.value.primaryLight,
      primaryDark: colors.primaryDark || customColors.value.primaryDark
    }
    
    // IMPROVEMENT: Only update if colors actually changed
    const hasChanged = newColors.primaryLight !== customColors.value.primaryLight || 
                      newColors.primaryDark !== customColors.value.primaryDark
    
    if (!hasChanged) {
      console.log('Colors unchanged, skipping update')
      return
    }
    
    console.log('Updating custom colors:', newColors)
    customColors.value = newColors
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
    if (!import.meta.client) return
    
    const shouldBeDark = isDarkMode.value
    const root = document.documentElement
    
    // Apply dark mode class
    root.classList.toggle('dark', shouldBeDark)
    
    // Apply custom colors
    root.style.setProperty('--color-primary', currentPrimaryColor.value)
    root.style.setProperty('--color-primary-light', customColors.value.primaryLight)
    root.style.setProperty('--color-primary-dark', customColors.value.primaryDark)
    
    // Update theme-color meta tag
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.content = shouldBeDark ? '#0f172a' : '#ffffff'
    }
  }
  
  /**
   * Save theme to localStorage
   */
  const saveTheme = () => {
    if (import.meta.client) {
      localStorage.setItem('workinfo-theme', currentTheme.value)
    }
  }
  
  /**
   * Save custom colors to localStorage
   */
  const saveCustomColors = () => {
    if (import.meta.client) {
      localStorage.setItem('workinfo-colors', JSON.stringify(customColors.value))
    }
  }
  
  /**
   * Load colors from card data - IMPROVED: Prevent recursive calls
   * @param {Object} cardData - Card data with theme colors
   */
  const loadColorsFromCard = (cardData) => {
    // IMPROVEMENT: Guard against recursive calls
    if (isLoadingColors.value) {
      console.log('Already loading colors, skipping')
      return
    }
    
    if (!cardData?.theme_primary_light && !cardData?.theme_primary_dark) {
      console.log('No custom colors in card data')
      return
    }
    
    isLoadingColors.value = true
    console.log('Loading colors from card:', {
      light: cardData.theme_primary_light,
      dark: cardData.theme_primary_dark
    })
    
    try {
      setCustomColors({
        primaryLight: cardData.theme_primary_light || customColors.value.primaryLight,
        primaryDark: cardData.theme_primary_dark || customColors.value.primaryDark
      })
    } finally {
      // Always reset the loading flag
      isLoadingColors.value = false
    }
  }
  
  /**
   * Get colors for saving to card
   * @returns {Object} Color data
   */
  const getColorsForCard = () => {
    return {
      theme_primary_light: customColors.value.primaryLight,
      theme_primary_dark: customColors.value.primaryDark
    }
  }
  
  // Watch for theme changes
  watch(isDarkMode, () => {
    if (import.meta.client && !isLoadingColors.value) {
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
    customColors,
    currentPrimaryColor,
    themeLabel,
    
    // Actions
    setTheme,
    toggleTheme,
    setCustomColors,
    resetColors,
    initTheme,
    
    // Card integration
    loadColorsFromCard,
    getColorsForCard
  }
}
