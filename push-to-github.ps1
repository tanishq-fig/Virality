# Push to GitHub Script
# Run this script: .\push-to-github.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Pushing Virality Analyzer to GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to project
Set-Location "c:\Users\tanis\OneDrive\Desktop\maxova-MainAI-1"

# Refresh PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

Write-Host "Step 1: Cleaning up old git repository..." -ForegroundColor Yellow
if (Test-Path .git) {
    Remove-Item -Recurse -Force .git
    Write-Host "✓ Old repository removed." -ForegroundColor Green
}
Write-Host ""

Write-Host "Step 2: Initializing new Git repository..." -ForegroundColor Yellow
git init
Write-Host ""

Write-Host "Step 3: Adding all files..." -ForegroundColor Yellow
git add .
Write-Host ""

Write-Host "Step 4: Creating initial commit..." -ForegroundColor Yellow
git commit -m "Initial commit: Complete Virality Analyzer with Next.js and ML backend"
Write-Host ""

Write-Host "Step 5: Renaming branch to main..." -ForegroundColor Yellow
git branch -M main
Write-Host ""

Write-Host "Step 6: Adding remote repository..." -ForegroundColor Yellow
git remote add origin https://github.com/tanishq-fig/Virality.git
Write-Host ""

Write-Host "Step 7: Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "Your browser will open for authentication..." -ForegroundColor Cyan
git push -u origin main --force
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "✓ Push complete!" -ForegroundColor Green
Write-Host "View your repository at:" -ForegroundColor Cyan
Write-Host "https://github.com/tanishq-fig/Virality" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Green
