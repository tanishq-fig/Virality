@echo off
echo ========================================
echo Pushing Virality Analyzer to GitHub
echo ========================================
echo.

REM Add Git to PATH
set PATH=%PATH%;C:\Program Files\Git\cmd

cd /d "c:\Users\tanis\OneDrive\Desktop\maxova-MainAI-1"

echo Step 1: Cleaning up old git repository...
if exist .git (
    rmdir /s /q .git
    echo Old repository removed.
)
echo.

echo Step 2: Initializing new Git repository...
git init
echo.

echo Step 3: Adding all files...
git add .
echo.

echo Step 4: Creating initial commit...
git commit -m "Initial commit: Complete Virality Analyzer with Next.js and ML backend"
echo.

echo Step 5: Renaming branch to main...
git branch -M main
echo.

echo Step 6: Adding remote repository...
git remote add origin https://github.com/tanishq-fig/Virality.git
echo.

echo Step 7: Pushing to GitHub (force)...
echo Your browser will open for authentication...
git push -u origin main --force
echo.

echo ========================================
echo Push complete!
echo View your repository at:
echo https://github.com/tanishq-fig/Virality
echo ========================================
pause
