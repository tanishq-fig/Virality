# Netlify Deployment Guide

## ✅ Fixes Applied

The Prisma initialization error has been fixed with the following changes:

### 1. Updated `package.json`
```json
"scripts": {
  "postinstall": "prisma generate",
  "build": "prisma generate && next build"
}
```

### 2. Created `netlify.toml`
Configuration file to ensure proper build process on Netlify.

### 3. Changes Pushed to GitHub
Commit `05fbb2e` - "Fix Netlify deployment: Add Prisma generation to build process"

## 🚀 Deploy on Netlify

### Option 1: Clear Cache and Redeploy (Recommended)

1. **Go to Netlify Dashboard**: https://app.netlify.com
2. **Find your site** (Virality)
3. **Go to Deploys tab**
4. **Click "Options" dropdown** → **Clear cache and retry deploy**

This will trigger a fresh build with the new configuration.

### Option 2: Trigger New Deploy

If the site hasn't been deployed yet:

1. **Go to**: https://app.netlify.com/start
2. **Connect to GitHub repository**: `tanishq-fig/Virality`
3. **Configure build settings** (should auto-detect from netlify.toml):
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: `22`

### Required Environment Variables

⚠️ **IMPORTANT**: Set these in Netlify UI before deploying:

1. **Go to**: Site settings → Environment variables
2. **Add these variables**:

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_URL="https://your-site.netlify.app"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"
```

### Database Setup for Production

**SQLite won't work on Netlify** (serverless environment). You need a hosted database:

#### Option 1: Neon (Recommended - Free PostgreSQL)
```bash
# 1. Sign up at https://neon.tech
# 2. Create a new project
# 3. Copy connection string
# 4. Set DATABASE_URL in Netlify
```

#### Option 2: Supabase (Free PostgreSQL)
```bash
# 1. Sign up at https://supabase.com
# 2. Create a new project
# 3. Go to Settings → Database
# 4. Copy connection string (use connection pooling)
# 5. Set DATABASE_URL in Netlify
```

#### Option 3: Railway (PostgreSQL)
```bash
# 1. Sign up at https://railway.app
# 2. Create new project → PostgreSQL
# 3. Copy DATABASE_URL
# 4. Set in Netlify
```

### Update Prisma Schema for PostgreSQL

Change `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

Then run migrations:
```bash
# After connecting to production database
npx prisma migrate deploy
```

### Google OAuth Configuration

Update Google Cloud Console:

1. **Go to**: https://console.cloud.google.com/apis/credentials
2. **Edit your OAuth client**
3. **Add Authorized redirect URI**:
   ```
   https://your-site.netlify.app/api/auth/callback/google
   ```

## 🔍 Verify Deployment

After deployment:

1. **Check build logs** for:
   - ✅ "Prisma Client generated" message
   - ✅ No cache-related errors
   - ✅ Successful build completion

2. **Test the site**:
   - Landing page loads
   - Login with Google works
   - Dashboard functions
   - Analysis works (requires ML backend)

## 🐛 Troubleshooting

### Still Getting Prisma Error?

1. **Clear cache again**: Deploys → Clear cache and retry deploy
2. **Check versions match** in package.json:
   ```json
   "@prisma/client": "^5.22.0",
   "prisma": "^5.22.0"
   ```
3. **Check build logs** for "prisma generate" output

### Database Connection Issues

- Verify `DATABASE_URL` is set correctly
- Use **connection pooling** URL for PostgreSQL (ends with `?pgbouncer=true`)
- Check database allows connections from Netlify IPs

### ML Backend Not Working

The Python ML backend needs separate deployment:

**Option 1: Railway**
```bash
# 1. Sign up at railway.app
# 2. New project → Deploy from GitHub → ml-backend folder
# 3. Add Procfile or configure start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
# 4. Copy deployment URL
# 5. Update your Next.js code to use production ML backend URL
```

**Option 2: Render**
```bash
# 1. Sign up at render.com
# 2. New Web Service → Connect ml-backend
# 3. Build: pip install -r requirements.txt
# 4. Start: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Authentication Issues

- Verify `NEXTAUTH_URL` matches your Netlify URL exactly
- Regenerate `NEXTAUTH_SECRET`: `openssl rand -base64 32`
- Check Google OAuth redirect URIs include Netlify domain

## 📊 Expected Build Output

Successful build should show:

```
✓ Prisma Client generated
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

## 🎯 Next Steps After Deployment

1. ✅ Set up production database (PostgreSQL)
2. ✅ Configure environment variables
3. ✅ Deploy ML backend separately
4. ✅ Update Google OAuth settings
5. ✅ Test all features
6. 🚀 Share your live site!

## 📚 Resources

- Netlify Next.js Deployment: https://docs.netlify.com/frameworks/next-js
- Prisma with Netlify: https://pris.ly/d/netlify-build
- Next.js Deployment: https://nextjs.org/docs/deployment

---

**Your fixes are pushed and ready! Just clear cache and redeploy.** 🚀
