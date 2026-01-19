# 🚀 Deployment Guide - Virality Analyzer

## Quick Deploy Options

### Option 1: Vercel (Recommended - 5 minutes)

Vercel is made by the Next.js team and offers zero-config deployment.

#### Steps:

1. **Install Vercel CLI** (optional)
```bash
npm i -g vercel
```

2. **Deploy via Git** (Easiest)
   - Push your code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Connect your GitHub repo
   - Vercel auto-detects Next.js
   - Click "Deploy"

3. **Configure Environment Variables in Vercel**
   - Go to Project Settings → Environment Variables
   - Add:
     ```
     NEXTAUTH_URL=https://your-domain.vercel.app
     NEXTAUTH_SECRET=your-secret-key
     GOOGLE_CLIENT_ID=your-google-client-id
     GOOGLE_CLIENT_SECRET=your-google-client-secret
     ```

4. **Update Google OAuth**
   - Go to Google Cloud Console
   - Add new authorized redirect URI:
     `https://your-domain.vercel.app/api/auth/callback/google`

5. **Redeploy**
   - Push to main branch
   - Auto-deploys in 30 seconds

✅ **Done!** Your app is live at `https://your-project.vercel.app`

---

### Option 2: Netlify (Alternative)

#### Steps:

1. **Push to Git**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

2. **Deploy on Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import existing project"
   - Connect Git provider
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Click "Deploy"

3. **Environment Variables**
   - Site settings → Environment variables
   - Add same variables as Vercel

---

### Option 3: Self-Hosted (VPS/Cloud)

For AWS, DigitalOcean, or your own server.

#### Steps:

1. **Build for Production**
```bash
npm run build
```

2. **Copy Files to Server**
```bash
# Using SCP
scp -r .next package.json package-lock.json user@server:/app

# Or use Git
git clone your-repo
cd your-repo
npm install
npm run build
```

3. **Install PM2** (Process Manager)
```bash
npm install -g pm2
pm2 start npm --name "virality-analyzer" -- start
pm2 save
pm2 startup
```

4. **Setup Nginx** (Reverse Proxy)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. **SSL with Let's Encrypt**
```bash
sudo certbot --nginx -d your-domain.com
```

---

### Option 4: Docker (Containerized)

#### Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXTAUTH_URL=https://your-domain.com
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
    restart: unless-stopped
```

#### Deploy:
```bash
docker-compose up -d
```

---

## Environment Variables Setup

### Production Values

Create a `.env.production` file:

```env
# Your production domain
NEXTAUTH_URL=https://your-domain.com

# Generate a new secret for production
NEXTAUTH_SECRET=generate-new-secret-here

# Google OAuth credentials (same or create new project)
GOOGLE_CLIENT_ID=your-production-client-id
GOOGLE_CLIENT_SECRET=your-production-client-secret
```

### Generate Secret Key:
```bash
# On Mac/Linux
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

---

## Pre-Deployment Checklist

### Security
- [ ] New NEXTAUTH_SECRET generated
- [ ] Environment variables not in code
- [ ] .env files in .gitignore
- [ ] HTTPS enabled (SSL certificate)
- [ ] Google OAuth redirect URIs updated

### Performance
- [ ] Production build tested locally
- [ ] Images optimized
- [ ] Unused dependencies removed
- [ ] Console.logs removed
- [ ] Error tracking setup (Sentry optional)

### Features
- [ ] All pages work
- [ ] Dark mode works
- [ ] OAuth flow tested
- [ ] API routes functional
- [ ] Mobile responsive checked

### SEO (Optional)
- [ ] Meta tags added
- [ ] Open Graph images
- [ ] Sitemap generated
- [ ] robots.txt configured
- [ ] Google Analytics added

---

## Custom Domain Setup

### Vercel
1. Project Settings → Domains
2. Add your domain
3. Update DNS records:
   - A Record: `76.76.21.21`
   - Or CNAME: `cname.vercel-dns.com`

### Netlify
1. Domain settings → Add custom domain
2. Update DNS:
   - A Record: Netlify IP
   - Or CNAME: `your-site.netlify.app`

---

## Post-Deployment

### 1. Monitor
- Check error logs
- Monitor performance
- Watch for 404s

### 2. Analytics (Optional)
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 3. Error Tracking (Optional)
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

---

## Scaling Considerations

### When to Scale:
- 1000+ users/day
- Slow response times
- Database needed

### Next Steps:
1. **Add Database**
   - Prisma + PostgreSQL
   - Store user data
   - Analysis history

2. **Add Caching**
   - Redis for sessions
   - CDN for static assets

3. **Optimize Images**
   - Next.js Image component
   - WebP format
   - Lazy loading

4. **API Rate Limiting**
   - Protect endpoints
   - Prevent abuse

---

## Troubleshooting Deployment

### Build Fails
```bash
# Test build locally
npm run build

# Check logs
vercel logs your-deployment-url
```

### OAuth Not Working
- Check redirect URIs match production domain
- Verify environment variables set
- Clear browser cookies

### 500 Errors
- Check environment variables
- Review logs
- Test API routes

### Slow Loading
- Enable Next.js image optimization
- Check bundle size: `npm run build`
- Consider CDN

---

## Cost Estimates

### Vercel Free Tier
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Auto HTTPS
- ✅ Perfect for starting out

### Vercel Pro ($20/mo)
- 1TB bandwidth
- Analytics
- Priority support

### Self-Hosted (VPS)
- DigitalOcean: $6-12/mo
- AWS t3.micro: ~$10/mo
- Requires more setup

---

## Success Metrics to Track

After deployment, monitor:

1. **Traffic**
   - Daily active users
   - Page views
   - Bounce rate

2. **Engagement**
   - Analyses performed
   - Return visitors
   - Time on site

3. **Technical**
   - Page load time
   - API response time
   - Error rate

4. **Business**
   - Sign-ups
   - OAuth completion rate
   - Feature usage

---

## 🎉 You're Live!

Your premium SaaS application is now deployed and accessible to the world.

**Next:** Share your link, get feedback, iterate, and grow!

---

**Deployment Support:**
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
