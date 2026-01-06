# Production Cleanup Script
# WARNING: This will DELETE files. Review before running!

Write-Host "🧹 Da Pet Care - Production Cleanup Script" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

# Ask for confirmation
$confirmation = Read-Host "This will DELETE test files and development scripts. Continue? (yes/no)"
if ($confirmation -ne "yes") {
    Write-Host "❌ Cleanup cancelled." -ForegroundColor Red
    exit
}

Write-Host "`n🗑️  Removing test and development files...`n" -ForegroundColor Yellow

# Root directory
$filesToDelete = @(
    "test-connection.js"
)

# Server directory
$serverFiles = @(
    "server\test-api.js",
    "server\test-endpoints.js",
    "server\test-payment.js",
    "server\scripts\test-create-user.js",
    "server\scripts\remove-duplicates.js",
    "server\scripts\upload-csv-products.js",
    "server\scripts\upload-segment-1.js",
    "server\scripts\upload-segment-2.js",
    "server\scripts\upload-segment-3.js",
    "server\scripts\upload-segment-4.js"
)

# Client directory
$clientFiles = @(
    "Client\Postman (x64).exe"
)

$allFiles = $filesToDelete + $serverFiles + $clientFiles

foreach ($file in $allFiles) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "✅ Deleted: $file" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Not found: $file" -ForegroundColor Yellow
    }
}

Write-Host "`n🔐 Checking for sensitive files...`n" -ForegroundColor Yellow

# Check for sensitive files
$sensitiveFiles = @(
    "Client\serviceAccountKey.json",
    "server\serviceAccountKey.json",
    "Client\.env",
    "server\.env"
)

$foundSensitive = $false
foreach ($file in $sensitiveFiles) {
    if (Test-Path $file) {
        Write-Host "⚠️  SENSITIVE FILE FOUND: $file" -ForegroundColor Red
        Write-Host "   This file should NOT be committed to git!" -ForegroundColor Red
        $foundSensitive = $true
    }
}

if ($foundSensitive) {
    Write-Host "`n⚠️  IMPORTANT: Remove sensitive files from git:" -ForegroundColor Red
    Write-Host "   git rm --cached Client/serviceAccountKey.json" -ForegroundColor Yellow
    Write-Host "   git rm --cached server/serviceAccountKey.json" -ForegroundColor Yellow
    Write-Host "   git commit -m 'Remove sensitive files'" -ForegroundColor Yellow
}

Write-Host "`n📊 Cleanup Summary:" -ForegroundColor Cyan
Write-Host "   - Removed test scripts" -ForegroundColor Green
Write-Host "   - Removed development tools" -ForegroundColor Green
Write-Host "   - Removed seeding scripts" -ForegroundColor Green

Write-Host "`n✅ Cleanup complete!" -ForegroundColor Green
Write-Host "`n📝 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Review PRODUCTION_CHECKLIST.md" -ForegroundColor White
Write-Host "   2. Update environment variables" -ForegroundColor White
Write-Host "   3. Run 'npm audit fix' in both Client and server" -ForegroundColor White
Write-Host "   4. Test the application thoroughly" -ForegroundColor White
Write-Host "   5. Build for production: 'npm run build'" -ForegroundColor White
