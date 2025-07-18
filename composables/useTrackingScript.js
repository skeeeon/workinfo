/**
 * Tracking script composable - Safe handling of user analytics scripts
 * Validates and safely injects analytics tracking scripts into pages
 */

export const useTrackingScript = () => {
  /**
   * Parse and sanitize a tracking script
   * @param {string} scriptString - Raw script string from user
   * @returns {Object|null} Parsed script object or null if invalid
   */
  const parseTrackingScript = (scriptString) => {
    if (!scriptString?.trim()) return null

    try {
      // Extract script tag
      const scriptTagRegex = /<script[^>]*>[\s\S]*?<\/script>|<script[^>]*\/>/gi
      const matches = scriptString.match(scriptTagRegex)
      
      if (!matches || matches.length !== 1) return null

      const scriptTag = matches[0]
      
      // Extract src attribute
      const srcMatch = scriptTag.match(/src=["']([^"']+)["']/i)
      if (!srcMatch) return null

      const src = srcMatch[1]
      
      // Validate domain
      if (!isAllowedAnalyticsDomain(src)) return null

      // Extract attributes safely
      const attributes = {}
      
      // Common safe attributes for analytics scripts
      const safeAttributes = [
        'defer', 'async', 'type', 'crossorigin', 'integrity',
        'data-website-id', 'data-domain', 'data-api', 'data-exclude',
        'data-include', 'data-host-url', 'data-track-localhost'
      ]

      safeAttributes.forEach(attr => {
        const attrRegex = new RegExp(`${attr}=["']([^"']+)["']`, 'i')
        const attrMatch = scriptTag.match(attrRegex)
        if (attrMatch) {
          attributes[attr] = attrMatch[1]
        } else if (scriptTag.includes(attr) && ['defer', 'async'].includes(attr)) {
          // Boolean attributes
          attributes[attr] = true
        }
      })

      return {
        src,
        attributes,
        provider: detectProvider(src)
      }
    } catch (error) {
      console.error('Error parsing tracking script:', error)
      return null
    }
  }

  /**
   * Check if domain is allowed for analytics
   * @param {string} src - Script source URL
   * @returns {boolean} Is allowed
   */
  const isAllowedAnalyticsDomain = (src) => {
    const allowedDomains = [
      // Google Analytics
      'google-analytics.com',
      'googletagmanager.com',
      'analytics.google.com',
      
      // Umami
      'umami.is',
      'cloud.umami.is',
      
      // Plausible
      'plausible.io',
      
      // Simple Analytics
      'simpleanalytics.com',
      
      // Other popular analytics
      'hotjar.com',
      'fullstory.com',
      'mixpanel.com'
    ]

    try {
      const url = new URL(src)
      return allowedDomains.some(domain => 
        url.hostname === domain || url.hostname.endsWith('.' + domain)
      )
    } catch {
      return false
    }
  }

  /**
   * Detect analytics provider from script URL
   * @param {string} src - Script source URL
   * @returns {string} Provider name
   */
  const detectProvider = (src) => {
    if (src.includes('google-analytics.com') || src.includes('googletagmanager.com')) {
      return 'Google Analytics'
    }
    if (src.includes('umami.is')) {
      return 'Umami'
    }
    if (src.includes('plausible.io')) {
      return 'Plausible'
    }
    if (src.includes('simpleanalytics.com')) {
      return 'Simple Analytics'
    }
    if (src.includes('hotjar.com')) {
      return 'Hotjar'
    }
    return 'Analytics'
  }

  /**
   * Safely inject tracking script into page head
   * @param {string} scriptString - Raw script string
   */
  const injectTrackingScript = (scriptString) => {
    const parsedScript = parseTrackingScript(scriptString)
    
    if (!parsedScript) {
      console.warn('Invalid or unsafe tracking script provided')
      return
    }

    // Use Nuxt's useHead to safely inject the script
    useHead({
      script: [
        {
          src: parsedScript.src,
          ...parsedScript.attributes,
          // Ensure it's external and safe
          async: parsedScript.attributes.async || true,
          defer: parsedScript.attributes.defer || false
        }
      ]
    })

    console.log(`Injected ${parsedScript.provider} tracking script`)
  }

  /**
   * Validate tracking script format
   * @param {string} scriptString - Raw script string
   * @returns {Object} Validation result
   */
  const validateTrackingScript = (scriptString) => {
    if (!scriptString?.trim()) {
      return { isValid: true, error: null } // Empty is valid
    }

    const parsed = parseTrackingScript(scriptString)
    
    if (!parsed) {
      return { 
        isValid: false, 
        error: 'Invalid script format or unsupported provider' 
      }
    }

    return { 
      isValid: true, 
      error: null,
      provider: parsed.provider 
    }
  }

  return {
    parseTrackingScript,
    injectTrackingScript,
    validateTrackingScript,
    isAllowedAnalyticsDomain,
    detectProvider
  }
}
