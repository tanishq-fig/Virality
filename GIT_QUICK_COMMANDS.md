# Quick Git Commands for GitHub

## Initial Setup (Do Once)

### Install Git
```bash
# Using winget (Windows Package Manager)
winget install --id Git.Git -e --source winget

# Or download from: https://git-scm.com/download/win
```

### Configure Git
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Push to GitHub (First Time)

### Step 1: Initialize Repository
```bash
cd "c:\Users\tanis\OneDrive\Desktop\maxova-MainAI-1"
git init
git add .
git commit -m "Initial commit: Virality Analyzer with ML backend"
```

### Step 2: Create GitHub Repository
1. Go to: https://github.com/new
2. Name it: `virality-analyzer`
3. Make it **Private** or **Public**
4. **Don't** add README, .gitignore, or license
5. Click "Create repository"

### Step 3: Connect and Push
```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/virality-analyzer.git
git branch -M main
git push -u origin main
```

## Daily Git Workflow

```bash
# 1. Check what changed
git status

# 2. Add changes
git add .

# 3. Commit with message
git commit -m "Your change description"

# 4. Push to GitHub
git push
```

## Useful Commands

```bash
# View commit history
git log --oneline

# See differences
git diff

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main

# Pull latest changes
git pull
```

## Common Scenarios

### Made Changes, Want to Push
```bash
git add .
git commit -m "Updated dashboard UI"
git push
```

### See What Files Changed
```bash
git status
git diff
```

### Undo Uncommitted Changes
```bash
# Undo changes to specific file
git checkout -- filename.tsx

# Undo all changes
git reset --hard HEAD
```

### Accidentally Committed Wrong File
```bash
# Undo last commit, keep changes
git reset --soft HEAD~1

# Remove file from staging
git reset filename.txt

# Commit again
git commit -m "Correct commit"
```

## GitHub Repository Settings

### After First Push:

1. **Add Description**:
   "AI-powered content virality analyzer with Next.js, FastAPI, and machine learning"

2. **Add Topics** (improves discoverability):
   - `nextjs`
   - `typescript`
   - `machine-learning`
   - `fastapi`
   - `prisma`
   - `virality-analysis`
   - `ai`
   - `content-analysis`

3. **Update README**:
   - Rename `README_GITHUB.md` to `README.md` (becomes main page)
   ```bash
   git mv README_GITHUB.md README.md
   git commit -m "Update README for GitHub"
   git push
   ```

## Troubleshooting

### "git: command not found"
- Install Git from https://git-scm.com/download/win
- Restart terminal/VS Code after installation

### "Authentication failed"
- GitHub removed password authentication
- Use Personal Access Token instead:
  1. GitHub → Settings → Developer settings → Personal access tokens
  2. Generate new token (classic)
  3. Select scopes: `repo` (full control)
  4. Copy token
  5. Use token as password when pushing

### "Large file error"
If ML models are too large:
```bash
git lfs install
git lfs track "*.pkl"
git add .gitattributes
git commit -m "Add Git LFS"
git push
```

## Next Steps

1. ✅ Install Git
2. ✅ Configure user name/email
3. ✅ Create GitHub repository
4. ✅ Push code
5. ⭐ Star your own repo (why not? 😄)
6. 🚀 Deploy to Vercel
7. 📱 Share with friends!

## Quick Reference Card

```
┌─────────────────────────────────────────┐
│  Most Used Commands                     │
├─────────────────────────────────────────┤
│  git status      - Check changes        │
│  git add .       - Stage all changes    │
│  git commit -m   - Commit with message  │
│  git push        - Upload to GitHub     │
│  git pull        - Download from GitHub │
│  git log         - See history          │
└─────────────────────────────────────────┘
```
