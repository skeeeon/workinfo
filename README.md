# WorkInfo - Professional Contact Cards

A modern progressive web application for creating and sharing professional contact cards. Built with Nuxt.js and PocketBase for the modern professional.

## ✨ Features

### 🎨 **Custom Design & Branding**
- **Theme Customization**: Personalize your card with custom colors for light and dark modes
- **Professional Templates**: Clean, modern design that makes great first impressions
- **Dark/Light Mode**: Automatic system preference detection with manual override
- **Brand Colors**: Custom primary colors that persist across all card elements

### 📱 **Sharing & Distribution**
- **QR Code Generation**: Local QR code generation for instant sharing at events
- **Multiple Share Options**: Share via URL, QR code, or download as vCard
- **Direct Links**: Clean, memorable URLs like `workinfo.me/users/yourname`
- **vCard Export**: Download contact information in universal vCard format
- **Web Share API**: Native sharing on supported devices

### 📊 **Analytics Tracking**
- **Privacy-First Analytics**: Optional user-configurable analytics scripts
- **Supported Providers**: 
  - Umami Analytics
  - Google Analytics 4
  - Plausible Analytics
  - Simple Analytics
  - Hotjar
- **Security Validated**: All scripts are validated and sanitized before injection
- **Easy Setup**: Simple copy-paste integration in the card editor

### 🖼️ **Profile Management**
- **Image Upload**: Professional photo upload with automatic optimization
- **Contact Information**: Mobile, office, email, website, and calendar booking links
- **Rich Profiles**: Company information, job titles, addresses, and personal notes
- **Real-time Preview**: See changes instantly as you edit

### 📱 **Progressive Web App**
- **Offline Support**: Works without internet connection
- **Installable**: Add to home screen on mobile devices
- **Fast Loading**: Optimized performance with service workers
- **Mobile Optimized**: Perfect experience on all devices and screen sizes

### 🔒 **Security & Privacy**
- **Secure Authentication**: PocketBase-powered user management
- **Data Ownership**: Users control their own information
- **No Tracking**: WorkInfo doesn't track users across the internet
- **GDPR Compliant**: Users control their data and analytics preferences

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PocketBase server instance
- Modern web browser

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/workinfo.git
cd workinfo

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### Environment Configuration

Create a `.env` file in the root directory:

```env
NUXT_PUBLIC_SITE_URL=https://workinfo.me
NUXT_PUBLIC_POCKETBASE_URL=http://localhost:8090
```

### Development

```bash
# Start development server
npm run dev

# Visit http://localhost:3000
```

### Production

```bash
# Build for production
npm run build

# Generate static files
npm run generate

# Preview production build
npm run preview
```

## 🛠️ Tech Stack

- **Frontend**: Nuxt.js 3, Vue 3 Composition API, TypeScript
- **Styling**: Tailwind CSS + Custom CSS Variables for theming
- **Backend**: PocketBase for authentication and data storage
- **PWA**: Service workers with Vite PWA plugin
- **Icons**: Heroicons
- **Fonts**: Inter (via Google Fonts)
- **QR Codes**: Local generation with qrcode.js
- **Analytics**: User-configurable tracking scripts

## 📁 Project Structure

```
├── assets/css/          # Global styles and CSS variables
├── components/          # Reusable Vue components
│   ├── cards/          # Business card components
│   ├── common/         # Shared UI components
│   ├── dashboard/      # Dashboard-specific components
│   └── layout/         # Layout components
├── composables/        # Vue composables for business logic
│   ├── useAuth.js      # Authentication management
│   ├── useCard.js      # Card CRUD operations
│   ├── useTheme.js     # Theme and color management
│   ├── useTrackingScript.js # Analytics script validation
│   └── usePocketbase.js # PocketBase client management
├── layouts/           # Nuxt layouts
│   ├── default.vue    # Main application layout
│   ├── auth.vue       # Authentication pages layout
│   └── card.vue       # Public card display layout
├── middleware/        # Route middleware
├── pages/            # Application pages/routes
├── plugins/          # Nuxt plugins
└── public/          # Static assets
```

## 🎯 Key Components

### **BusinessCard** (`components/cards/BusinessCard.vue`)
- Main public card display component
- Responsive contact method layout
- QR code and sharing integration
- vCard download functionality

### **CardEditor** (`components/dashboard/CardEditor.vue`)
- Comprehensive form for editing card information
- Real-time validation and auto-save
- Theme customization interface
- Analytics script configuration

### **ThemeCustomizer** (`components/dashboard/ThemeCustomizer.vue`)
- Color picker for light and dark modes
- Preset color themes
- Live preview of theme changes

### **ImageUpload** (`components/dashboard/ImageUpload.vue`)
- Drag-and-drop image upload
- Image validation and optimization
- Preview functionality

## 🔧 Configuration

### PocketBase Setup

Your PocketBase instance needs these collections:

#### **users** collection
- `username` (text, unique)
- `email` (email, unique)
- `name` (text)

#### **cards** collection
- `user_id` (relation to users)
- `username` (text, indexed)
- `first_name` (text)
- `last_name` (text)
- `company` (text)
- `title` (text)
- `email` (email)
- `mobile` (text)
- `office` (text)
- `website` (url)
- `calendar` (url)
- `address` (text)
- `note` (text)
- `profile_image` (file)
- `theme_primary_light` (text)
- `theme_primary_dark` (text)
- `tracking_script` (text)
- `is_active` (bool)

### Analytics Integration

Add analytics tracking scripts in the Card Editor:

**Umami Analytics:**
```html
<script defer src="https://cloud.umami.is/script.js" data-website-id="your-website-id"></script>
```

**Google Analytics 4:**
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

**Plausible Analytics:**
```html
<script defer data-domain="example.com" src="https://plausible.io/js/script.js"></script>
```

## 🚀 Deployment

### Static Hosting (Recommended)
Works with Vercel, Netlify, CloudFlare Pages, or any static hosting provider:

```bash
npm run generate
```

Upload the `dist/` folder to your hosting provider.

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Email**: support@workinfo.me
- **Documentation**: [docs.workinfo.me](https://docs.workinfo.me)
- **Issues**: [GitHub Issues](https://github.com/yourusername/workinfo/issues)

## 🙏 Acknowledgments

- Built with [Nuxt.js](https://nuxt.com/)
- Backend powered by [PocketBase](https://pocketbase.io/)
- Icons by [Heroicons](https://heroicons.com/)
- Fonts from [Google Fonts](https://fonts.google.com/)

---

**WorkInfo** - Professional contact cards for the modern world. Create, customize, and share your professional identity with ease.
