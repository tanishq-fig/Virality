# Database Documentation

## Overview
This application uses **Prisma 5** as the ORM with **SQLite** as the database. The database stores user accounts, authentication sessions, and content analysis history.

## Database Schema

### Models

#### User
Stores user account information from OAuth providers.
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  analyses      Analysis[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

#### Account
OAuth provider connection details (Google, etc.).
```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([provider, providerAccountId])
}
```

#### Session
Active user sessions for authentication.
```prisma
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

#### Analysis
Content analysis results with all metrics and insights.
```prisma
model Analysis {
  id                String   @id @default(cuid())
  userId            String
  content           String
  overall           Int
  emotionalImpact   Int
  shareability      Int
  timing            Int
  uniqueness        Int
  engagement        Int
  insights          String   // JSON array
  recommendations   String   // JSON array
  createdAt         DateTime @default(now())
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([createdAt])
}
```

#### VerificationToken
Email verification tokens (for future use).
```prisma
model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  
  @@unique([identifier, token])
}
```

## Database Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Initial Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Environment Variables**
   Create `.env.local` file:
   ```env
   DATABASE_URL="file:./prisma/dev.db"
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

3. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

4. **Run Migrations**
   ```bash
   npx prisma migrate deploy
   ```

## Database Commands

### View Database Contents
```bash
# Open Prisma Studio (visual database browser)
npx prisma studio
```
Prisma Studio will open at `http://localhost:5555`

### Create New Migration
```bash
# After changing schema.prisma
npx prisma migrate dev --name your_migration_name
```

### Reset Database
```bash
# WARNING: This deletes all data
npx prisma migrate reset
```

### Seed Database (if seed file exists)
```bash
npx prisma db seed
```

## Database Location

**Development Database**: `prisma/dev.db`
- This is a SQLite file stored in the prisma folder
- Automatically created on first migration
- Can be backed up by copying this file

## Querying the Database

### Using Prisma Client

```typescript
import { prisma } from '@/lib/prisma'

// Get all analyses for a user
const analyses = await prisma.analysis.findMany({
  where: { userId: user.id },
  orderBy: { createdAt: 'desc' },
  take: 10
})

// Create new analysis
const analysis = await prisma.analysis.create({
  data: {
    userId: user.id,
    content: "Content to analyze",
    overall: 85,
    emotionalImpact: 90,
    shareability: 80,
    timing: 75,
    uniqueness: 88,
    engagement: 92,
    insights: JSON.stringify(["insight 1", "insight 2"]),
    recommendations: JSON.stringify(["tip 1", "tip 2"])
  }
})

// Get user with all analyses
const userWithAnalyses = await prisma.user.findUnique({
  where: { id: user.id },
  include: { analyses: true }
})

// Delete specific analysis
await prisma.analysis.delete({
  where: { id: analysisId }
})

// Count total analyses
const total = await prisma.analysis.count({
  where: { userId: user.id }
})
```

## API Routes Using Database

### `/api/analyze` (POST)
Saves analysis results to database:
- Requires authenticated user
- Creates Analysis record linked to userId
- Returns analysis with timestamp

### `/api/history` (GET)
Fetches user's analysis history:
- Supports pagination with `limit` and `offset` query params
- Returns analyses in descending order by creation date
- Includes total count and hasMore flag

### `/api/history` (DELETE)
Deletes specific analysis:
- Requires `id` query parameter
- Verifies ownership (userId matches session)
- Returns success status

## Database Relationships

```
User (1) ──→ (N) Account     // OAuth connections
User (1) ──→ (N) Session     // Active sessions
User (1) ──→ (N) Analysis    // Content analyses

Cascade delete enabled:
- Delete user → deletes all accounts, sessions, analyses
```

## Backup & Restore

### Backup Database
```bash
# Copy the SQLite file
cp prisma/dev.db prisma/dev.db.backup

# Or with timestamp
cp prisma/dev.db "prisma/dev.db.backup.$(date +%Y%m%d_%H%M%S)"
```

### Restore Database
```bash
# Restore from backup
cp prisma/dev.db.backup prisma/dev.db

# Restart the application
npm run dev
```

## Production Considerations

### For Production Deployment:

1. **Use PostgreSQL or MySQL** instead of SQLite for better concurrency
2. **Update schema.prisma**:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. **Set DATABASE_URL** to production database:
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/dbname"
   ```

4. **Run migrations** on production:
   ```bash
   npx prisma migrate deploy
   ```

## Troubleshooting

### "PrismaClient is unable to run"
- Run `npx prisma generate`
- Restart dev server

### "Can't reach database server"
- Check DATABASE_URL in `.env.local`
- Ensure prisma folder exists
- Run `npx prisma migrate deploy`

### "Unique constraint failed"
- Check if record already exists
- Verify unique fields (email, sessionToken, etc.)

### Database Locked
- Close Prisma Studio if open
- Restart development server
- Check for other processes using the database

## Performance Tips

1. **Add indexes** for frequently queried fields
2. **Use select** to fetch only needed fields
3. **Implement pagination** for large datasets
4. **Cache frequent queries** with React Query or SWR
5. **Use transactions** for multiple related operations

## Security Best Practices

1. **Never expose database credentials** in client code
2. **Validate all inputs** before database queries
3. **Use parameterized queries** (Prisma does this automatically)
4. **Implement rate limiting** on API routes
5. **Log database errors** without exposing schema details
6. **Regular backups** of production database
7. **Row-level security** - always filter by userId

## Migration History

### 20260118123100_init
Initial database schema with:
- User authentication (NextAuth.js models)
- Analysis tracking with all metrics
- Session management
- OAuth account linking

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Prisma Adapter](https://authjs.dev/reference/adapter/prisma)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
