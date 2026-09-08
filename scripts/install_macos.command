#!/bin/bash
# ==============================================================================
# Flutter SDK & Java OpenJDK 17 Auto-Installer for macOS
# ==============================================================================

set -e

# Warna Output
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

clear
echo -e "${CYAN}======================================================${NC}"
echo -e "${CYAN}     FLUTTER SDK & JAVA OPENJDK 17 AUTO INSTALLER     ${NC}"
echo -e "${CYAN}                      (macOS)                         ${NC}"
echo -e "${CYAN}======================================================${NC}"
echo ""

BASE_INSTALL_DIR="$HOME/development"
FLUTTER_DIR="$BASE_INSTALL_DIR/flutter"

mkdir -p "$BASE_INSTALL_DIR"

# ------------------------------------------------------------------------------
# 1. Periksa Xcode Command Line Tools & Git
# ------------------------------------------------------------------------------
echo -e "${YELLOW}[1/4] Memeriksa Command Line Developer Tools & Git...${NC}"
if ! xcode-select -p &>/dev/null; then
    echo -e "${CYAN}Menginstal Xcode Command Line Tools...${NC}"
    xcode-select --install || true
    echo -e "${YELLOW}Silakan ikuti dialog instalasi jika muncul di layar Mac Anda.${NC}"
else
    echo -e "${GREEN}✓ Command Line Tools sudah terpasang.${NC}"
fi

# ------------------------------------------------------------------------------
# 2. Cek & Pasang Java (OpenJDK 17) via Homebrew atau Direct Binary
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}[2/4] Memeriksa instalasi Java (OpenJDK 17)...${NC}"
need_java=true

if command -v java &>/dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}')
    echo -e "Java terdeteksi: $JAVA_VERSION"
    if [[ "$JAVA_VERSION" == 17* ]]; then
        echo -e "${GREEN}✓ Java 17 sudah terpasang.${NC}"
        need_java=false
    fi
fi

if [ "$need_java" = true ]; then
    if command -v brew &>/dev/null; then
        echo -e "${CYAN}Menginstal OpenJDK 17 melalui Homebrew...${NC}"
        brew install openjdk@17
        sudo ln -sfn "$(brew --prefix)/opt/openjdk@17/libexec/openjdk.jdk" /Library/Java/JavaVirtualMachines/openjdk-17.jdk 2>/dev/null || true
    else
        echo -e "${CYAN}Homebrew tidak ditemukan. Mengunduh Adoptium Eclipse Temurin 17...${NC}"
        ARCH=$(uname -m)
        if [ "$ARCH" = "arm64" ]; then
            JDK_URL="https://api.adoptium.net/v3/binary/latest/17/ga/mac/aarch64/jdk/hotspot/normal/eclipse?project=jdk"
        else
            JDK_URL="https://api.adoptium.net/v3/binary/latest/17/ga/mac/x64/jdk/hotspot/normal/eclipse?project=jdk"
        fi
        
        TEMP_TAR="/tmp/temurin17.tar.gz"
        TEMP_DIR="/tmp/temurin17_extracted"
        curl -L "$JDK_URL" -o "$TEMP_TAR"
        mkdir -p "$TEMP_DIR"
        tar -xzf "$TEMP_TAR" -C "$TEMP_DIR"
        
        JDK_DIR="$HOME/Library/Java/JavaVirtualMachines"
        mkdir -p "$JDK_DIR"
        EXTRACTED_NAME=$(ls "$TEMP_DIR")
        rm -rf "$JDK_DIR/temurin-17.jdk" 2>/dev/null || true
        mv "$TEMP_DIR/$EXTRACTED_NAME" "$JDK_DIR/temurin-17.jdk"
        rm -rf "$TEMP_TAR" "$TEMP_DIR"
        echo -e "${GREEN}✓ OpenJDK 17 berhasil dipasang di $JDK_DIR/temurin-17.jdk${NC}"
    fi
fi

# ------------------------------------------------------------------------------
# 3. Clone atau Update Flutter SDK Stable Release
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}[3/4] Mengunduh / Memperbarui Flutter SDK (Stable)...${NC}"
if [ -d "$FLUTTER_DIR/.git" ]; then
    echo -e "${CYAN}Flutter sudah ada di $FLUTTER_DIR. Mengambil update stable terbaru...${NC}"
    cd "$FLUTTER_DIR"
    git checkout stable
    git pull
    cd - > /dev/null
else
    echo -e "${CYAN}Melakukan clone Flutter SDK branch 'stable' ke $FLUTTER_DIR...${NC}"
    git clone https://github.com/flutter/flutter.git -b stable "$FLUTTER_DIR"
fi

# ------------------------------------------------------------------------------
# 4. Konfigurasi Environment Variables di Shell Profile (~/.zprofile dan ~/.zshrc)
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}[4/4] Mengonfigurasi PATH dan JAVA_HOME di shell profil macOS...${NC}"

FLUTTER_ENV_BLOCK='
# Flutter SDK & Java OpenJDK 17
export PATH="$PATH:$HOME/development/flutter/bin"
if [ -f /usr/libexec/java_home ]; then
  export JAVA_HOME=$(/usr/libexec/java_home -v 17 2>/dev/null || /usr/libexec/java_home)
fi
'

setup_mac_rc() {
    local profile_file="$1"
    touch "$profile_file"
    if ! grep -q "development/flutter/bin" "$profile_file"; then
        echo "$FLUTTER_ENV_BLOCK" >> "$profile_file"
        echo -e "${GREEN}✓ Berhasil menambahkan Flutter ke $profile_file${NC}"
    else
        echo -e "${GREEN}✓ Flutter sudah terdaftar di $profile_file${NC}"
    fi
}

setup_mac_rc "$HOME/.zprofile"
setup_mac_rc "$HOME/.zshrc"

# Export untuk sesi saat ini
export PATH="$PATH:$FLUTTER_DIR/bin"
if [ -f /usr/libexec/java_home ]; then
    export JAVA_HOME=$(/usr/libexec/java_home -v 17 2>/dev/null || /usr/libexec/java_home 2>/dev/null || true)
fi

# ------------------------------------------------------------------------------
# 5. Inisialisasi & Verifikasi Flutter Doctor
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}Menjalankan flutter doctor (pre-download Dart SDK)...${NC}"
"$FLUTTER_DIR/bin/flutter" doctor

echo -e "\n${GREEN}======================================================${NC}"
echo -e "${GREEN}         INSTALASI SELESAI DENGAN SUKSES!             ${NC}"
echo -e "${GREEN}======================================================${NC}"
echo -e "Flutter terpasang di: $FLUTTER_DIR"
echo -e "Buka tab Terminal baru untuk mulai menggunakan perintah 'flutter' dan 'dart'."
echo -e "\nTekan [Enter] untuk keluar..."
read -r
