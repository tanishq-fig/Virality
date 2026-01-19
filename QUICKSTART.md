# 🎯 Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- npm or yarn
- Google Cloud account (for OAuth)

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Application type: "Web application"
6. Add authorized redirect URI:
   - `http://localhost:3000/api/auth/callback/google`
7. Copy the Client ID and Client Secret

### 3. Environment Variables

Update `.env.local` with your credentials:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

To generate a secure secret:
```bash
openssl rand -base64 32
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Features Implemented

✅ **Landing Page** - Apple-level design with animations
✅ **Authentication** - Google OAuth + email/password UI
✅ **Dashboard** - Interactive content analyzer
✅ **Dark Mode** - Seamless theme switching
✅ **API Routes** - Content analysis endpoint
✅ **Responsive** - Mobile, tablet, desktop optimized

## Project Structure

```
src/
├── app/
│   ├── api/           # API routes
│   ├── dashboard/     # Main app
│   ├── login/         # Auth pages
│   ├── register/
│   └── page.tsx       # Landing page
├── components/
│   ├── ui/            # Reusable components
│   └── theme-*        # Theme system
├── lib/               # Utilities
└── types/             # TypeScript types
```

## Testing the App

### Without Google OAuth (Quick Test)
1. Click "Sign in" or "Get Started"
2. Fill in any email/password
3. Click submit - you'll be redirected to dashboard
4. Paste content and click "Analyze Now"

### With Google OAuth
1. Configure Google OAuth credentials
2. Click "Continue with Google"
3. Authorize with your Google account
4. Start analyzing content

## Design Highlights

- **No generic templates** - Every component custom-designed
- **Smooth animations** - Framer Motion throughout
- **Premium feel** - Inspired by Apple, Linear, Stripe
- **Unique layouts** - Creative, not standard dashboards
- **Dark mode** - Beautiful in both themes

## Production Deployment

### Build
```bash
npm run build
```

### Deploy to Vercel
```bash
npm i -g vercel
vercel
```

Update `NEXTAUTH_URL` in production environment variables.

## Troubleshooting

**Build errors?**
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version (18+ required)

**Google OAuth not working?**
- Verify redirect URI matches exactly
- Check credentials are in `.env.local`
- Restart dev server after changing env vars

**Dark mode issues?**
- Clear browser cache
- Check system theme preference

## Next Steps

1. **Integrate Real AI** - Replace simulated analysis in `/api/analyze/route.ts`
2. **Add Database** - Store user analyses (Prisma + PostgreSQL)
3. **Analytics** - Track usage and performance
4. **Social Features** - Share analyses, leaderboards
5. **Payment** - Stripe integration for premium features

## Support

This is a production-ready starter. Customize and extend as needed for your startup!
