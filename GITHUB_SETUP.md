# GitHub Setup Guide

## Prerequisites

1. **Install Git** (if not already installed):
   - Download from: https://git-scm.com/download/win
   - Or use: `winget install --id Git.Git -e --source winget`
   - Restart your terminal after installation

2. **GitHub Account**:
   - Create account at: https://github.com
   - Consider setting up SSH keys for easier authentication

## Step 1: Configure Git (First Time Only)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Step 2: Initialize Repository

```bash
# Navigate to project folder
cd "c:\Users\tanis\OneDrive\Desktop\maxova-MainAI-1"

# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Virality Analyzer with ML backend"
```

## Step 3: Create GitHub Repository

1. Go to: https://github.com/new
2. Repository name: `virality-analyzer` (or your preferred name)
3. Description: "AI-powered content virality analysis tool with Next.js and ML backend"
4. Choose: **Private** or **Public**
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

## Step 4: Push to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Or if using SSH:
# git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 5: Environment Variables on GitHub

⚠️ **IMPORTANT**: Your `.env.local` file is not pushed to GitHub (it's in .gitignore).

Add a `.env.example` file for others to reference:

```bash
# Copy your .env.local without sensitive values
cp .env.local .env.example
```

Then edit `.env.example` and replace sensitive values with placeholders:
```
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here-generate-with-openssl"

GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

Commit the example:
```bash
git add .env.example
git commit -m "Add environment variables example"
git push
```

## What's Included in the Repository

✅ **Included**:
- All source code (Next.js app, React components, API routes)
- ML backend (Python FastAPI server)
- ML models (tfidf_vectorizer.pkl, virality_model.pkl)
- Prisma schema and migrations
- Documentation files
- Configuration files (tsconfig, tailwind, etc.)

❌ **Excluded** (via .gitignore):
- node_modules/
- .next/ (build files)
- .env and .env*.local (sensitive credentials)
- Database files (dev.db)
- Python cache (__pycache__/)

## Repository Structure

```
virality-analyzer/
├── src/                    # Next.js source code
│   ├── app/               # App router pages
│   ├── components/        # React components
│   └── lib/               # Utilities
├── ml-backend/            # Python FastAPI ML server
│   ├── main.py           # FastAPI app
│   ├── *.pkl             # Trained ML models
│   └── requirements.txt   # Python dependencies
├── prisma/                # Database
│   └── schema.prisma     # Database schema
├── public/                # Static assets
└── docs/                  # Documentation
```

## Recommended GitHub Repository Settings

### Topics (for discoverability):
- `nextjs`
- `react`
- `machine-learning`
- `fastapi`
- `virality-analysis`
- `content-analysis`
- `ai`
- `typescript`
- `tailwindcss`

### Branch Protection Rules:
1. Go to Settings → Branches
2. Add rule for `main` branch:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass

### Description:
"AI-powered content virality analyzer built with Next.js 15, FastAPI, and machine learning. Features Google OAuth, real-time analysis, history tracking, and a premium dark UI."

### Website:
Add your deployed URL once live (e.g., Vercel deployment URL)

## Making Changes After Initial Push

```bash
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Description of changes"

# Push to GitHub
git push
```

## Useful Git Commands

```bash
# View commit history
git log --oneline

# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main

# See differences
git diff

# Undo uncommitted changes
git checkout -- filename

# View remote URL
git remote -v
```

## Troubleshooting

### Authentication Issues
If prompted for credentials repeatedly:
```bash
# Use credential manager (Windows)
git config --global credential.helper wincred
```

### Large File Warning
If `.pkl` files are too large (>100MB):
```bash
# Install Git LFS
git lfs install
git lfs track "*.pkl"
git add .gitattributes
git commit -m "Add Git LFS for ML models"
```

### Reset to Previous Commit
```bash
# Soft reset (keeps changes)
git reset --soft HEAD~1

# Hard reset (discards changes)
git reset --hard HEAD~1
```

## Next Steps

1. Add GitHub Actions for CI/CD (optional)
2. Set up automatic deployments to Vercel
3. Add issue templates
4. Create CONTRIBUTING.md for collaborators
5. Add license file (MIT, Apache, etc.)

## Support

For Git help: https://git-scm.com/doc
For GitHub help: https://docs.github.com
