#!/bin/bash
# ==============================================================================
# Flutter SDK & Java OpenJDK 17 Auto-Installer for Linux
# ==============================================================================

set -e

GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}======================================================${NC}"
echo -e "${CYAN}     FLUTTER SDK & JAVA OPENJDK 17 AUTO INSTALLER     ${NC}"
echo -e "${CYAN}======================================================${NC}"
echo ""

BASE_INSTALL_DIR="$HOME/development"
FLUTTER_DIR="$BASE_INSTALL_DIR/flutter"

mkdir -p "$BASE_INSTALL_DIR"

# ------------------------------------------------------------------------------
# 1. Deteksi & Instal Dependensi Sistem (Git, Curl, Unzip, OpenJDK 17, Mesa)
# ------------------------------------------------------------------------------
echo -e "${YELLOW}[1/4] Memeriksa paket pendukung dan OpenJDK 17...${NC}"

install_deps() {
    if command -v apt-get &> /dev/null; then
        echo -e "${CYAN}Terdeteksi Debian/Ubuntu. Menginstal dependencies via apt...${NC}"
        sudo apt-get update -y
        sudo apt-get install -y git curl unzip xz-utils zip libglu1-mesa openjdk-17-jdk libc6:i386 libstdc++6:i386 zlib1g:i386 2>/dev/null || sudo apt-get install -y git curl unzip xz-utils zip libglu1-mesa openjdk-17-jdk
    elif command -v dnf &> /dev/null; then
        echo -e "${CYAN}Terdeteksi Fedora/RHEL. Menginstal dependencies via dnf...${NC}"
        sudo dnf install -y git curl unzip xz mesa-libGLU java-17-openjdk-devel
    elif command -v pacman &> /dev/null; then
        echo -e "${CYAN}Terdeteksi Arch Linux. Menginstal dependencies via pacman...${NC}"
        sudo pacman -Sy --noconfirm git curl unzip xz glu jdk17-openjdk
    else
        echo -e "${YELLOW}Package manager tidak dikenali secara otomatis. Pastikan git, curl, unzip, dan openjdk-17 sudah terpasang.${NC}"
    fi
}

install_deps

# ------------------------------------------------------------------------------
# 2. Clone atau Update Flutter SDK Stable Release
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}[2/4] Mengunduh / Memperbarui Flutter SDK (Stable)...${NC}"
if [ -d "$FLUTTER_DIR/.git" ]; then
    echo -e "${CYAN}Flutter SDK ditemukan di $FLUTTER_DIR. Mengambil update stable terbaru...${NC}"
    cd "$FLUTTER_DIR"
    git checkout stable
    git pull
    cd - > /dev/null
else
    echo -e "${CYAN}Cloning Flutter SDK branch 'stable' ke $FLUTTER_DIR...${NC}"
    git clone https://github.com/flutter/flutter.git -b stable "$FLUTTER_DIR"
fi

# ------------------------------------------------------------------------------
# 3. Konfigurasi Environment Variables di Shell Profile (~/.bashrc dan ~/.zshrc)
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}[3/4] Mengonfigurasi PATH dan JAVA_HOME di shell profil...${NC}"

FLUTTER_PATH_LINE="export PATH=\"\$PATH:$FLUTTER_DIR/bin\""

# Cari path java jika JAVA_HOME belum diset
if [ -z "$JAVA_HOME" ]; then
    JAVA_BIN_PATH=$(which java || true)
    if [ -n "$JAVA_BIN_PATH" ]; then
        RESOLVED_JAVA=$(readlink -f "$JAVA_BIN_PATH")
        CALCULATED_JAVA_HOME=$(dirname $(dirname "$RESOLVED_JAVA"))
        JAVA_HOME_LINE="export JAVA_HOME=\"$CALCULATED_JAVA_HOME\""
    fi
fi

setup_rc_file() {
    local rc_file="$1"
    if [ -f "$rc_file" ]; then
        if ! grep -q "$FLUTTER_DIR/bin" "$rc_file"; then
            echo "" >> "$rc_file"
            echo "# Flutter SDK & Java Environment" >> "$rc_file"
            echo "$FLUTTER_PATH_LINE" >> "$rc_file"
            if [ -n "$JAVA_HOME_LINE" ]; then
                echo "$JAVA_HOME_LINE" >> "$rc_file"
            fi
            echo -e "${GREEN}✓ Berhasil menambahkan Flutter ke $rc_file${NC}"
        else
            echo -e "${GREEN}✓ Flutter sudah terdaftar di $rc_file${NC}"
        fi
    fi
}

setup_rc_file "$HOME/.bashrc"
setup_rc_file "$HOME/.zshrc"
setup_rc_file "$HOME/.profile"

# Export untuk sesi saat ini
export PATH="$PATH:$FLUTTER_DIR/bin"
if [ -n "$CALCULATED_JAVA_HOME" ]; then
    export JAVA_HOME="$CALCULATED_JAVA_HOME"
fi

# ------------------------------------------------------------------------------
# 4. Inisialisasi & Verifikasi Flutter Doctor
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}[4/4] Menjalankan flutter doctor (pre-download Dart SDK)...${NC}"
"$FLUTTER_DIR/bin/flutter" doctor

echo -e "\n${GREEN}======================================================${NC}"
echo -e "${GREEN}         INSTALASI SELESAI DENGAN SUKSES!             ${NC}"
echo -e "${GREEN}======================================================${NC}"
echo -e "Flutter terpasang di: $FLUTTER_DIR"
echo -e "Buka terminal baru atau jalankan 'source ~/.bashrc' untuk langsung menggunakan flutter."
echo -e "${CYAN}Tekan Enter untuk menutup jendela ini...${NC}"
read -r
