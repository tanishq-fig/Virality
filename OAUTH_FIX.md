# 🚨 DEPLOYMENT ERROR FIX: Google OAuth Not Working

## Problem
**"Server error - There is a problem with the server configuration"**

This happens when trying to sign in with Google after deployment.

## Root Causes
1. ❌ Missing environment variables on Vercel
2. ❌ Google OAuth redirect URI not configured for production domain
3. ❌ Database not set up for production

## ✅ SOLUTION: Complete Setup Guide

### Step 1: Set Environment Variables on Vercel

1. **Go to your Vercel project**: https://vercel.com/[your-username]/[project-name]
2. **Click**: Settings → Environment Variables
3. **Add these variables** (one by one):

```env
# Required for NextAuth
NEXTAUTH_URL=https://your-deployed-site.vercel.app
NEXTAUTH_SECRET=your-generated-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database (PostgreSQL required for production)
DATABASE_URL=your-production-database-url
```

#### How to Get Each Value:

**NEXTAUTH_URL:**
- Your full Vercel deployment URL
- Example: `https://virality-analyzer.vercel.app`
- ⚠️ Must match exactly (include https://)

**NEXTAUTH_SECRET:**
Generate a secure random string:
```bash
# Method 1: OpenSSL (recommended)
openssl rand -base64 32

# Method 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Method 3: Online generator
# Visit: https://generate-secret.vercel.app/32
```

**GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET:**
- You already have these from local development
- Same values from your `.env.local` file

**DATABASE_URL:**
- ⚠️ SQLite doesn't work on Vercel (serverless)
- You MUST use PostgreSQL for production
- See "Step 3: Set Up Production Database" below

---

### Step 2: Configure Google OAuth for Production

1. **Go to Google Cloud Console**: https://console.cloud.google.com/apis/credentials

2. **Select your project** (same one used for local development)

3. **Click on your OAuth 2.0 Client ID**

4. **Add Authorized Redirect URIs**:
   - Click "Add URI"
   - Add: `https://your-site.vercel.app/api/auth/callback/google`
   - Replace `your-site.vercel.app` with your actual Vercel URL
   - Click "Save"

5. **Also add these for testing**:
   - `https://your-site.vercel.app/api/auth/callback/google`
   - `https://*.vercel.app/api/auth/callback/google` (for preview deployments)

**Example:**
```
Authorized redirect URIs:
✅ http://localhost:3000/api/auth/callback/google (local dev)
✅ https://virality-analyzer.vercel.app/api/auth/callback/google (production)
✅ https://virality-analyzer-*.vercel.app/api/auth/callback/google (preview)
```

---

### Step 3: Set Up Production Database

**⚠️ IMPORTANT**: SQLite doesn't work on Vercel. You need PostgreSQL.

#### Option A: Vercel Postgres (Recommended - Easiest)

1. **Go to your Vercel project** → Storage tab
2. **Click "Create Database"** → Select "Postgres"
3. **Name it** (e.g., "virality-db")
4. **Click "Create"**
5. **Environment variables are added automatically** ✅
6. **Run migrations**:
   ```bash
   # In your local project
   npx prisma migrate deploy
   ```

#### Option B: Neon (Free Tier Available)

1. **Sign up**: https://neon.tech
2. **Create new project** → Name it "Virality Analyzer"
3. **Copy connection string**
4. **Add to Vercel env vars** as `DATABASE_URL`
5. **Update Prisma schema**:
   ```prisma
   datasource db {
     provider = "postgresql"  // Change from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
6. **Run migrations**:
   ```bash
   npx prisma migrate deploy
   ```

#### Option C: Supabase (Free Tier)

1. **Sign up**: https://supabase.com
2. **New project** → Set password
3. **Settings** → Database → Connection string
4. **Use "Connection pooling" URL** (ends with `:6543`)
5. **Add to Vercel** as `DATABASE_URL`
6. **Run migrations**

---

### Step 4: Update Prisma Schema (If Using PostgreSQL)

**Edit** `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

**Push changes**:
```bash
git add prisma/schema.prisma
git commit -m "Switch to PostgreSQL for production"
git push
```

---

### Step 5: Redeploy

After setting environment variables:

1. **Go to Vercel** → Deployments
2. **Click "..." on latest deployment** → "Redeploy"
3. **OR** push any change to GitHub (auto-deploys)

---

## 🔍 Verification Checklist

After redeployment, verify:

- [ ] ✅ All environment variables set in Vercel
- [ ] ✅ `NEXTAUTH_URL` matches your deployment URL exactly
- [ ] ✅ Google OAuth redirect URI includes your production domain
- [ ] ✅ Database is PostgreSQL (not SQLite)
- [ ] ✅ `DATABASE_URL` is set correctly
- [ ] ✅ Redeployed after adding environment variables

---

## 🧪 Test the Fix

1. **Open your deployed site**: `https://your-site.vercel.app`
2. **Click "Sign In" or "Continue with Google"**
3. **Should redirect to Google login** ✅
4. **After login, should redirect to dashboard** ✅

---

## 🐛 Still Not Working?

### Check Deployment Logs

1. **Go to Vercel** → Deployments → Click on latest deployment
2. **Click "Functions"** → Find any failed functions
3. **Look for errors** like:
   - `Missing NEXTAUTH_SECRET`
   - `Invalid client_id` (Google OAuth)
   - `Database connection failed`

### Common Errors & Fixes

**Error: "Invalid client_id"**
- ✅ Check `GOOGLE_CLIENT_ID` is correct in Vercel
- ✅ No extra spaces or quotes in the value

**Error: "Redirect URI mismatch"**
- ✅ Google Console redirect URI must match exactly
- ✅ Include `https://` in the URI

**Error: "Database connection failed"**
- ✅ Using PostgreSQL (not SQLite)
- ✅ `DATABASE_URL` is correct
- ✅ Database allows connections from Vercel

**Error: "Invalid NEXTAUTH_SECRET"**
- ✅ Generate a new secret: `openssl rand -base64 32`
- ✅ Add to Vercel environment variables

---

## 📋 Quick Setup Summary

```bash
# 1. Generate secret
openssl rand -base64 32

# 2. Add to Vercel (Settings → Environment Variables):
NEXTAUTH_URL=https://your-site.vercel.app
NEXTAUTH_SECRET=<generated-secret>
GOOGLE_CLIENT_ID=<from-google-console>
GOOGLE_CLIENT_SECRET=<from-google-console>
DATABASE_URL=<postgresql-connection-string>

# 3. Update Google OAuth:
# Add redirect URI: https://your-site.vercel.app/api/auth/callback/google

# 4. Update Prisma (if needed):
# Change datasource provider to "postgresql"

# 5. Redeploy on Vercel
```

---

## 🎯 Need Help?

**Vercel Docs**: https://vercel.com/docs/concepts/projects/environment-variables
**NextAuth Docs**: https://next-auth.js.org/deployment
**Google OAuth Setup**: https://console.cloud.google.com/apis/credentials

---

**Once you complete these steps, Google OAuth will work perfectly!** 🚀
