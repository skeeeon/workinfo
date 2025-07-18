#!/usr/bin/env node

/**
 * PWA Icon Generator Script
 * Generates all required PWA icons from a single source image
 * 
 * Usage:
 * 1. Place your source icon (1024x1024 recommended) at ./assets/icon-source.png
 * 2. Run: node scripts/generate-icons.js
 * 3. Icons will be generated in ./public/icons/
 * 
 * Requirements:
 * npm install sharp
 */

import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Icon sizes needed for PWA
const iconSizes = [
  // Favicon sizes
  { size: 16, name: 'icon-16x16.png' },
  { size: 32, name: 'icon-32x32.png' },
  
  // PWA manifest icons
  { size: 72, name: 'icon-72x72.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 180, name: 'icon-180x180.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' },
  
  // Apple touch icons (iOS specific)
  { size: 57, name: 'apple-touch-icon-57x57.png' },
  { size: 60, name: 'apple-touch-icon-60x60.png' },
  { size: 72, name: 'apple-touch-icon-72x72.png' },
  { size: 76, name: 'apple-touch-icon-76x76.png' },
  { size: 114, name: 'apple-touch-icon-114x114.png' },
  { size: 120, name: 'apple-touch-icon-120x120.png' },
  { size: 144, name: 'apple-touch-icon-144x144.png' },
  { size: 152, name: 'apple-touch-icon-152x152.png' },
  { size: 180, name: 'apple-touch-icon-180x180.png' },
  
  // Shortcut icons
  { size: 192, name: 'shortcut-create.png' },
  { size: 192, name: 'shortcut-view.png' }
]

// Paths
const assetsDir = path.join(__dirname, '../assets')
const outputDir = path.join(__dirname, '../public/icons')
const publicDir = path.join(__dirname, '../public')

/**
 * Create sample source icon
 */
async function createSampleIcon() {
  console.log('🎨 Creating sample icon...')
  
  const sampleSvg = `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1D4ED8;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" rx="150" fill="url(#grad1)"/>
  <text x="512" y="600" font-family="Arial, sans-serif" font-size="300" font-weight="bold" 
        text-anchor="middle" fill="white">W</text>
  <rect x="200" y="700" width="624" height="80" rx="40" fill="white" opacity="0.9"/>
  <text x="512" y="755" font-family="Arial, sans-serif" font-size="48" font-weight="500" 
        text-anchor="middle" fill="#1D4ED8">WorkInfo</text>
</svg>`

  try {
    // Create assets directory if it doesn't exist
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true })
    }

    // Save SVG file
    const svgPath = path.join(assetsDir, 'icon-source.svg')
    fs.writeFileSync(svgPath, sampleSvg.trim())
    console.log('✅ Created sample SVG at:', svgPath)

    // Convert SVG to PNG
    const pngPath = path.join(assetsDir, 'icon-source.png')
    await sharp(Buffer.from(sampleSvg))
      .png({ quality: 100 })
      .toFile(pngPath)
    
    console.log('✅ Converted to PNG at:', pngPath)
    console.log('')
    
    return pngPath
  } catch (error) {
    console.error('❌ Failed to create sample icon:', error.message)
    throw error
  }
}

/**
 * Find the source icon file
 */
function findSourceIcon() {
  const pngPath = path.join(assetsDir, 'icon-source.png')
  const svgPath = path.join(assetsDir, 'icon-source.svg')
  
  if (fs.existsSync(pngPath)) {
    return pngPath
  }
  
  if (fs.existsSync(svgPath)) {
    return svgPath
  }
  
  return null
}

/**
 * Generate all PWA icons from source image
 */
async function generateIcons(sourcePath = null) {
  console.log('🎨 Starting PWA icon generation...')
  
  try {
    // Find source icon if not provided
    let sourceIconPath = sourcePath
    if (!sourceIconPath) {
      sourceIconPath = findSourceIcon()
      
      if (!sourceIconPath) {
        console.error('❌ No source icon found!')
        console.log('📝 Please create a source icon at:')
        console.log('   ./assets/icon-source.png (recommended)')
        console.log('   OR ./assets/icon-source.svg')
        console.log('   OR run with --sample flag to create one')
        process.exit(1)
      }
    }

    console.log(`📁 Source: ${sourceIconPath}`)
    console.log(`📁 Output: ${outputDir}`)

    // Create output directories
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }

    // Load and validate source image
    const sourceImage = sharp(sourceIconPath)
    const metadata = await sourceImage.metadata()
    
    console.log(`📐 Source image: ${metadata.width}x${metadata.height}`)
    
    if (!metadata.width || !metadata.height) {
      throw new Error('Invalid source image - could not read dimensions')
    }
    
    console.log('')

    // Generate all icon sizes
    console.log('🔄 Generating icon sizes...')
    const promises = iconSizes.map(async ({ size, name }) => {
      const outputPath = path.join(outputDir, name)
      
      try {
        await sharp(sourceIconPath)
          .resize(size, size, {
            kernel: sharp.kernel.lanczos3,
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 0 }
          })
          .png({
            quality: 100,
            compressionLevel: 6
          })
          .toFile(outputPath)
        
        console.log(`✅ Generated ${name} (${size}x${size})`)
        return true
      } catch (error) {
        console.error(`❌ Failed to generate ${name}:`, error.message)
        return false
      }
    })

    const results = await Promise.all(promises)
    const successCount = results.filter(Boolean).length
    
    // Generate favicon.ico
    try {
      const faviconPath = path.join(publicDir, 'favicon.ico')
      await sharp(sourceIconPath)
        .resize(32, 32)
        .png()
        .toFile(faviconPath)
      console.log('✅ Generated favicon.ico')
    } catch (error) {
      console.error('❌ Failed to generate favicon.ico:', error.message)
    }

    console.log('')
    console.log(`🎉 Generated ${successCount}/${iconSizes.length} icons successfully!`)
    console.log('')
    console.log('📋 Next steps:')
    console.log('1. Update your nuxt.config.ts with the PWA configuration')
    console.log('2. Deploy your app to test PWA installation')
    console.log('3. Test on iOS Safari: Share → Add to Home Screen')
    console.log('4. Test on Android Chrome: Install app prompt')
    console.log('')

    return true
  } catch (error) {
    console.error('❌ Error generating icons:', error.message)
    throw error
  }
}

/**
 * Main execution function
 */
async function main() {
  try {
    // Check for Sharp dependency
    try {
      await import('sharp')
    } catch (error) {
      console.error('❌ Sharp is required but not installed.')
      console.log('📦 Install it with: npm install sharp')
      process.exit(1)
    }

    console.log('🚀 PWA Icon Generator')
    console.log('')

    // Check if we should create a sample icon
    if (process.argv.includes('--sample')) {
      const samplePath = await createSampleIcon()
      console.log('🎨 Now generating all PWA icons from sample...')
      console.log('')
      await generateIcons(samplePath)
    } else {
      await generateIcons()
    }

  } catch (error) {
    console.error('❌ Script failed:', error.message)
    process.exit(1)
  }
}

// Check if script is run directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`

if (isMainModule) {
  main()
}

export { generateIcons, createSampleIcon }
