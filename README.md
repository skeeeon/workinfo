# WorkInfo - Professional Contact Cards

A modern progressive web application for creating and sharing professional contact cards. Built with Nuxt.js and PocketBase.

## Features

- **Custom Design**: Personalize your card with custom colors, themes, and branding
- **QR Code Sharing**: Generate QR codes for instant sharing at networking events
- **Easy Sharing**: Share via URL, QR code, or download as vCard
- **Mobile Optimized**: Perfect experience on all devices
- **Always Updated**: Real-time updates to all shared cards
- **Professional Look**: Clean, modern design that makes great first impressions

## Tech Stack

- **Frontend**: Nuxt.js 3, Vue 3 Composition API, TypeScript
- **Styling**: Tailwind CSS + Custom CSS Variables
- **Backend**: PocketBase for authentication and data storage
- **PWA**: Offline support with service workers
- **Icons**: Heroicons
- **Deployment**: Static generation ready

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Environment Variables

Create a `.env` file in the root directory:

```env
NUXT_PUBLIC_SITE_URL=https://workinfo.me
NUXT_PUBLIC_POCKETBASE_URL=http://localhost:8090
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

## Project Structure

```
├── assets/css/          # Global styles and CSS variables
├── components/          # Reusable Vue components
│   ├── cards/          # Business card components
│   ├── common/         # Shared UI components
│   ├── dashboard/      # Dashboard-specific components
│   └── layout/         # Layout components
├── composables/        # Vue composables for business logic
├── layouts/           # Nuxt layouts
├── middleware/        # Route middleware
├── pages/            # Application pages/routes
├── plugins/          # Nuxt plugins
└── public/          # Static assets
```

## Key Components

- **BusinessCard**: Main public card display component
- **CompactBusinessCard**: Dashboard preview component
- **CardEditor**: Form for editing card information
- **QRCodeModal**: QR code generation and sharing
- **ThemeCustomizer**: Brand color customization

## Deployment

The application is optimized for static generation and can be deployed to:

- Vercel
- Netlify
- CloudFlare Pages
- Any static hosting provider

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## License

MIT License - see LICENSE file for details.

## Support

For support, email support@workinfo.me or create an issue in the repository.
