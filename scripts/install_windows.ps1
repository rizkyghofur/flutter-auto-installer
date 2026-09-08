# ==============================================================================
# Flutter SDK & Java OpenJDK 17 Auto-Installer for Windows
# ==============================================================================

$ErrorActionPreference = "Stop"

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "     FLUTTER SDK & JAVA OPENJDK 17 AUTO INSTALLER     " -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

# Konfigurasi Folder Instalasi
$BaseInstallDir = "$env:SystemDrive\src"
$FlutterDir = Join-Path $BaseInstallDir "flutter"
$JavaBaseDir = "$env:LOCALAPPDATA\Programs\Common\Java"
$JavaDir = Join-Path $JavaBaseDir "jdk-17"

# Buat direktori dasar jika belum ada
if (-not (Test-Path $BaseInstallDir)) {
    Write-Host "[1/5] Membuat direktori instalasi di $BaseInstallDir..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $BaseInstallDir -Force | Out-Null
}

# ------------------------------------------------------------------------------
# 1. Cek & Pasang Git jika belum tersedia
# ------------------------------------------------------------------------------
Write-Host "[1/5] Memeriksa instalasi Git..." -ForegroundColor Yellow
$gitInstalled = Get-Command git -ErrorAction SilentlyContinue

if (-not $gitInstalled) {
    Write-Host "Git tidak ditemukan di sistem!" -ForegroundColor Red
    Write-Host "Mencoba menginstal Git menggunakan winget..." -ForegroundColor Yellow
    
    $wingetInstalled = Get-Command winget -ErrorAction SilentlyContinue
    if ($wingetInstalled) {
        & winget install --id Git.Git -e --source winget --accept-source-agreements --accept-package-agreements
        # Refresh PATH
        $machinePath = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
        $userPath = [System.Environment]::GetEnvironmentVariable("Path", "User")
        $env:Path = "$machinePath;$userPath"
    } else {
        Write-Host "Winget tidak tersedia. Mengunduh Git installer secara langsung..." -ForegroundColor Yellow
        $gitInstallerUrl = "https://github.com/git-for-windows/git/releases/download/v2.44.0.windows.1/Git-2.44.0-64-bit.exe"
        $gitInstallerPath = Join-Path $env:TEMP "git_installer.exe"
        Invoke-WebRequest -Uri $gitInstallerUrl -OutFile $gitInstallerPath -UseBasicParsing
        Write-Host "Memasang Git secara silent (background)..." -ForegroundColor Yellow
        Start-Process -FilePath $gitInstallerPath -ArgumentList "/VERYSILENT /NORESTART" -Wait
        Remove-Item $gitInstallerPath -Force -ErrorAction SilentlyContinue
        # Refresh PATH
        $machinePath = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
        $userPath = [System.Environment]::GetEnvironmentVariable("Path", "User")
        $env:Path = "$machinePath;$userPath"
    }
} else {
    $gitVer = git --version
    Write-Host "[OK] Git sudah terpasang: $gitVer" -ForegroundColor Green
}

# ------------------------------------------------------------------------------
# 2. Cek & Pasang Java OpenJDK 17 LTS
# ------------------------------------------------------------------------------
Write-Host ""
Write-Host "[2/5] Memeriksa instalasi Java (OpenJDK 17)..." -ForegroundColor Yellow
$javaInstalled = Get-Command java -ErrorAction SilentlyContinue
$needInstallJava = $true

if ($javaInstalled) {
    $javaVerOutput = java -version 2>&1 | Out-String
    Write-Host "Ditemukan Java saat ini:`n$javaVerOutput" -ForegroundColor Gray
    if ($javaVerOutput -match '17\.') {
        Write-Host "[OK] Java 17 sudah terpasang di sistem." -ForegroundColor Green
        $needInstallJava = $false
    } else {
        Write-Host "Java terdeteksi namun disarankan Java 17 LTS untuk kompatibilitas Android Gradle." -ForegroundColor Yellow
    }
}

if ($needInstallJava) {
    Write-Host "Mengunduh Eclipse Temurin OpenJDK 17 (LTS)..." -ForegroundColor Yellow
    if (-not (Test-Path $JavaBaseDir)) {
        New-Item -ItemType Directory -Path $JavaBaseDir -Force | Out-Null
    }

    # Eclipse Temurin OpenJDK 17 ZIP release URL
    $jdkZipUrl = "https://api.adoptium.net/v3/binary/latest/17/ga/windows/x64/jdk/hotspot/normal/eclipse?project=jdk"
    $jdkZipPath = Join-Path $env:TEMP "openjdk17.zip"
    $jdkExtractTemp = Join-Path $env:TEMP "openjdk17_temp"

    Write-Host "Mengunduh file arsip JDK 17..." -ForegroundColor Cyan
    Invoke-WebRequest -Uri $jdkZipUrl -OutFile $jdkZipPath -UseBasicParsing

    Write-Host "Mengekstrak Java OpenJDK 17..." -ForegroundColor Cyan
    if (Test-Path $jdkExtractTemp) { Remove-Item $jdkExtractTemp -Recurse -Force }
    Expand-Archive -Path $jdkZipPath -DestinationPath $jdkExtractTemp -Force

    $extractedFolder = Get-ChildItem -Path $jdkExtractTemp | Select-Object -First 1
    if (Test-Path $JavaDir) { Remove-Item $JavaDir -Recurse -Force }
    Move-Item -Path $extractedFolder.FullName -Destination $JavaDir -Force

    # Cleanup temp
    Remove-Item $jdkZipPath -Force -ErrorAction SilentlyContinue
    Remove-Item $jdkExtractTemp -Recurse -Force -ErrorAction SilentlyContinue

    Write-Host "[OK] Java OpenJDK 17 berhasil diekstrak ke: $JavaDir" -ForegroundColor Green
} else {
    if (-not $env:JAVA_HOME) {
        $javaExePath = (Get-Command java).Source
        $JavaDir = (Get-Item $javaExePath).Directory.Parent.FullName
    } else {
        $JavaDir = $env:JAVA_HOME
    }
}

# ------------------------------------------------------------------------------
# 3. Clone / Update Flutter SDK Stable Release
# ------------------------------------------------------------------------------
Write-Host ""
Write-Host "[3/5] Mengunduh / Memperbarui Flutter SDK (Stable Release)..." -ForegroundColor Yellow

$flutterBat = Join-Path $FlutterDir "bin\flutter.bat"
if (Test-Path $flutterBat) {
    Write-Host "Flutter SDK sudah ada di $FlutterDir. Melakukan update ke stable terbaru..." -ForegroundColor Cyan
    Push-Location $FlutterDir
    git checkout stable
    git pull
    Pop-Location
} else {
    Write-Host "Melakukan clone Flutter SDK branch stable ke $FlutterDir..." -ForegroundColor Cyan
    git clone https://github.com/flutter/flutter.git -b stable $FlutterDir
}

Write-Host "[OK] Flutter SDK siap di $FlutterDir" -ForegroundColor Green

# ------------------------------------------------------------------------------
# 4. Konfigurasi Environment Variables (PATH & JAVA_HOME)
# ------------------------------------------------------------------------------
Write-Host ""
Write-Host "[4/5] Mengonfigurasi Environment Variables (User PATH & JAVA_HOME)..." -ForegroundColor Yellow

$currentUserPath = [System.Environment]::GetEnvironmentVariable("Path", [System.EnvironmentVariableTarget]::User)
if (-not $currentUserPath) { $currentUserPath = "" }
$flutterBin = Join-Path $FlutterDir "bin"
$javaBin = Join-Path $JavaDir "bin"

# Tambah JAVA_HOME
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", $JavaDir, [System.EnvironmentVariableTarget]::User)
$env:JAVA_HOME = $JavaDir
Write-Host "[OK] JAVA_HOME diatur ke: $JavaDir" -ForegroundColor Green

# Tambah Flutter & Java ke User PATH jika belum ada
$pathList = $currentUserPath.Split(";", [System.StringSplitOptions]::RemoveEmptyEntries)
$pathUpdated = $false

if ($pathList -notcontains $flutterBin) {
    $currentUserPath = "$flutterBin;$currentUserPath"
    $pathUpdated = $true
}

if ($pathList -notcontains $javaBin) {
    $currentUserPath = "$javaBin;$currentUserPath"
    $pathUpdated = $true
}

if ($pathUpdated) {
    [System.Environment]::SetEnvironmentVariable("Path", $currentUserPath, [System.EnvironmentVariableTarget]::User)
    $env:Path = "$flutterBin;$javaBin;" + $env:Path
    Write-Host "[OK] Flutter dan Java bin berhasil ditambahkan ke User PATH." -ForegroundColor Green
} else {
    Write-Host "[OK] Flutter dan Java bin sudah terdaftar di PATH." -ForegroundColor Green
}

# ------------------------------------------------------------------------------
# 5. Inisialisasi & Verifikasi Flutter Doctor
# ------------------------------------------------------------------------------
Write-Host ""
Write-Host "[5/5] Menjalankan verifikasi awal Flutter (flutter doctor)..." -ForegroundColor Yellow
Write-Host "Proses ini akan mengunduh Dart SDK bawaan Flutter. Mohon tunggu beberapa saat..." -ForegroundColor Cyan

$flutterExe = Join-Path $flutterBin "flutter.bat"

if (Test-Path $flutterExe) {
    & $flutterExe doctor
} else {
    Write-Host "File flutter.bat tidak ditemukan di $flutterBin!" -ForegroundColor Red
}

Write-Host ""
Write-Host "======================================================" -ForegroundColor Green
Write-Host "         INSTALASI SELESAI DENGAN SUKSES!             " -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green
Write-Host "Lokasi Flutter SDK : $FlutterDir" -ForegroundColor White
Write-Host "Lokasi Java JDK    : $JavaDir" -ForegroundColor White
Write-Host ""
Write-Host "Catatan: Jika membuka terminal/cmd baru, perintah" -ForegroundColor Cyan
Write-Host "flutter dan java sudah dapat langsung digunakan." -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Green
