@echo off
setlocal enabledelayedexpansion
title Flutter & Java SDK Auto Installer

echo ======================================================
echo    FLUTTER & JAVA SDK AUTO INSTALLER (WINDOWS)
echo ======================================================
echo.
echo Mempersiapkan instalasi...
echo Membuka PowerShell untuk proses otomatis...
echo.

:: Dapatkan direktori script saat ini
set "SCRIPT_DIR=%~dp0"
set "PS_SCRIPT=%SCRIPT_DIR%install_windows.ps1"
if not exist "%PS_SCRIPT%" set "PS_SCRIPT=%SCRIPT_DIR%..\scripts\install_windows.ps1"

:: Jalankan skrip PowerShell dengan ExecutionPolicy Bypass
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PS_SCRIPT%"

echo.
echo ======================================================
echo Proses telah selesai.
echo Tekan sembarang tombol untuk keluar...
echo ======================================================
pause >nul
