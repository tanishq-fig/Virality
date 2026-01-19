# Database Integration - Quick Reference

## ✅ What's Implemented

### Database Schema (Prisma + SQLite)
- **User**: OAuth user accounts with email, name, image
- **Account**: OAuth provider connections (Google)
- **Session**: Active user sessions for authentication
- **Analysis**: Content analysis results with full metrics
- **VerificationToken**: Email verification (for future use)

### Authentication Flow
1. User clicks "Sign in with Google"
2. NextAuth redirects to Google OAuth
3. On success, user is created/updated in database
4. Session is stored in database
5. User is redirected to dashboard

### Analysis Storage
1. User submits content on dashboard
2. API checks authentication (session from database)
3. Analysis is performed
4. Results are saved to `Analysis` table with `userId`
5. Results returned to frontend

### History Page
1. User navigates to `/history`
2. Frontend fetches analyses from `/api/history`
3. Data is filtered by authenticated user's ID
4. Displays with search, filters, and delete functionality

## 📁 Key Files

### Database Configuration
- `prisma/schema.prisma` - Database schema definition
- `src/lib/prisma.ts` - Prisma client singleton
- `src/lib/auth.ts` - NextAuth configuration with Prisma adapter
- `.env.local` - DATABASE_URL configuration

### API Routes
- `src/app/api/auth/[...nextauth]/route.ts` - NextAuth handlers
- `src/app/api/analyze/route.ts` - Save analyses to database
- `src/app/api/history/route.ts` - GET (fetch) and DELETE analyses

### Frontend Pages
- `src/app/dashboard/page.tsx` - Shows recent analyses from database
- `src/app/history/page.tsx` - Full history with search/filter

### Auth Components
- `src/components/session-provider.tsx` - NextAuth session context
- `src/app/layout.tsx` - Wraps app with SessionProvider

## 🔑 Authentication Check Pattern

All protected API routes use this pattern:

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  
  // User is authenticated, proceed with logic
  const userId = session.user.id;
  // ...
}
```

## 🗄️ Database Operations Examples

### Create Analysis
```typescript
const analysis = await prisma.analysis.create({
  data: {
    userId: session.user.id,
    content: content.substring(0, 500),
    overall: 85,
    emotionalImpact: 90,
    shareability: 80,
    timing: 75,
    uniqueness: 88,
    engagement: 92,
    insights: JSON.stringify(["insight 1", "insight 2"]),
    recommendations: JSON.stringify(["tip 1", "tip 2"])
  }
});
```

### Fetch User Analyses
```typescript
const analyses = await prisma.analysis.findMany({
  where: { userId: session.user.id },
  orderBy: { createdAt: "desc" },
  take: 20,
  skip: 0
});
```

### Delete Analysis (with ownership check)
```typescript
await prisma.analysis.deleteMany({
  where: {
    id: analysisId,
    userId: session.user.id  // Ensures user owns the analysis
  }
});
```

### Count Total Analyses
```typescript
const total = await prisma.analysis.count({
  where: { userId: session.user.id }
});
```

## 🚀 Quick Commands

```bash
# Start dev server
npm run dev

# View database in browser
npx prisma studio

# Generate Prisma client (after schema changes)
npx prisma generate

# Create migration (after schema changes)
npx prisma migrate dev --name migration_name

# Apply migrations to database
npx prisma migrate deploy

# Reset database (deletes all data)
npx prisma migrate reset

# Build for production
npm run build
```

## 📊 Data Flow Diagram

```
User Login
    ↓
Google OAuth → NextAuth → Prisma Adapter → SQLite
                   ↓
            Create/Update User
                   ↓
            Create Session
                   ↓
        Store in Database
                   ↓
          User Authenticated

User Analyzes Content
    ↓
Dashboard → POST /api/analyze → Check Session
                                      ↓
                                Auth Verified
                                      ↓
                            Create Analysis Record
                                      ↓
                            Save to Database (with userId)
                                      ↓
                            Return Results

User Views History
    ↓
History Page → GET /api/history → Check Session
                                      ↓
                                Auth Verified
                                      ↓
                            Query Analysis Table
                                      ↓
                        Filter by userId (security)
                                      ↓
                            Return Results
```

## 🔒 Security Features

1. **Session-based authentication** - All API routes check session
2. **User ownership validation** - Users can only see/delete their own analyses
3. **Cascade deletes** - Deleting a user removes all related data
4. **Environment variables** - Sensitive data not in code
5. **JWT tokens** - Secure session management
6. **SQL injection prevention** - Prisma uses parameterized queries

## 🎯 Testing the Flow

1. **Start the app**: `npm run dev`
2. **Sign in**: Use Google OAuth on login page
3. **Check database**: `npx prisma studio` - see User and Session created
4. **Analyze content**: Submit content on dashboard
5. **Check database**: See Analysis record with your userId
6. **View history**: Navigate to `/history` - see your analyses
7. **Delete analysis**: Click delete on any card
8. **Check database**: Analysis removed from database

## 📝 Environment Variables Required

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

## 🐛 Common Issues & Solutions

### "Prisma Client not generated"
```bash
npx prisma generate
```

### "Can't reach database server"
- Check DATABASE_URL in `.env.local`
- Ensure `prisma` folder exists
- Run `npx prisma migrate deploy`

### "Session not found"
- Sign out and sign in again
- Check Google OAuth credentials
- Verify NEXTAUTH_SECRET is set

### "Analysis not saving"
- Check user is authenticated
- View browser console for errors
- Check API route logs

## 📖 Further Reading

- [DATABASE.md](DATABASE.md) - Full database documentation
- [README.md](README.md) - Project overview and setup
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth Docs](https://authjs.dev)
