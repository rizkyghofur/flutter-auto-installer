# Flutter & Android Dev Suite One-Click Auto Installer

Aplikasi desktop lengkap berbasis **Electron.js** dan paket skrip otomatisasi untuk mempermudah persiapan lingkungan pengembangan Flutter dan Android dari nol sampai siap coding.

---

## 🚀 Fitur Lengkap Aplikasi Desktop

### 1. ⚡ Auto Installer (Core Engine)

- **1-Klik Instalasi Flutter SDK**: Mengunduh branch `stable` resmi terbaru langsung dari repository Flutter Google.
- **Java OpenJDK 17 LTS**: Mengunduh dan memasang versi Java yang diwajibkan untuk Android Gradle modern.
- **Konfigurasi Otomatis**: Mengatur `PATH` sistem pengguna dan `JAVA_HOME` secara otomatis tanpa perlu repot mengedit environment variables secara manual.
- **Visual Step Tracker & Live Terminal**: Memantau perkembangan tahapan dan log unduhan/ekstraksi secara langsung.

### 2. 💻 Pusat Instalasi IDE & Ekosistem (Tab "IDE & Tools")

- **Android Studio**:
  - Deteksi otomatis status terpasang/belum dengan logo vektor SVG resmi.
  - Opsi pasang 1-klik untuk mendapatkan **Android SDK**, **Android Emulator (AVD)**, dan build tools.
  - **⚡ Auto Setujui Lisensi**: Menyetujui semua syarat lisensi Android SDK secara otomatis tanpa perlu membuka terminal manual (`flutter doctor --android-licenses`).
- **Visual Studio Code**:
  - Deteksi otomatis status terpasang/belum dengan logo resmi.
  - Tombol pasang otomatis serta pintasan langsung untuk menginstal ekstensi resmi **Flutter & Dart**.
- **Xcode (Khusus macOS)**:
  - Deteksi ketersediaan di sistem Apple Mac dengan logo resmi.
  - Pintasan ke Mac App Store untuk simulator iPhone/iPad & CocoaPods.

### 3. 🚀 Widget Pembaruan Flutter (Sidebar)

- Menampilkan versi lokal Flutter yang sedang aktif beserta channel-nya.
- Menampilkan rilis **Terbaru** langsung dari upstream/remote secara live.
- Dilengkapi indikator state loading animasi putar (<kbd>↻</kbd>) dan tombol 1-klik **`🚀 Update ke v...`** untuk meng-upgrade Flutter SDK secara otomatis.

### 4. ⚡ Quick Create Flutter Project (Modal Dialog)

- Membuat template proyek Flutter baru dalam hitungan detik.
- Mendukung pemilihan multi-platform secara fleksibel (**Android**, **iOS**, **Web**, **Windows**, **macOS**, **Linux**).
- Dilengkapi fitur folder picker, pintasan keyboard (<kbd>Esc</kbd> / <kbd>Enter</kbd>), dan otomatis membuka proyek yang baru dibuat langsung ke **Visual Studio Code**.

### 5. 🩺 Visual Flutter Doctor (Tab "Visual Doctor")

- Menjalankan analisis `flutter doctor -v` dan mengubah output teks panjang menjadi **kartu checklist visual**:
  - 🟢 **Centang Hijau**: Komponen siap digunakan.
  - 🟡 **Tanda Seru Kuning**: Catatan/peringatan (misal lisensi belum disetujui).
  - 🔴 **Tanda Silang Merah**: Komponen wajib yang belum lengkap.
- **Panduan Perbaikan Bahasa Indonesia**: Setiap poin yang belum lulus dilengkapi banner instruksi yang jelas dan ramah pemula untuk mengatasi kendala tersebut.

---

## 🖥️ Cara Menjalankan Aplikasi

Jalankan perintah berikut di terminal / command prompt direktori proyek:

```bash
npm start
```

---

## ⚡ Mode Skrip Standalone (Tanpa Aplikasi Desktop)

Bagi pengguna yang ingin langsung menjalankan instalasi tanpa membuka GUI:

| Sistem Operasi | File Script (di dalam folder `scripts/`)   | Cara Pakai                                            |
| :------------- | :----------------------------------------- | :---------------------------------------------------- |
| **Windows**    | `scripts/install_windows.bat` atau `.ps1`  | **Klik 2x** pada `install_windows.bat`                |
| **Linux**      | `scripts/install_linux.desktop` atau `.sh` | **Klik 2x** pada desktop launcher atau jalankan `.sh` |
| **macOS**      | `scripts/install_macos.command`            | **Klik 2x** dari Finder                               |

---

## 📦 Unduhan Installer Resmi & Cara Rilis (Windows, macOS, Linux)

### 📥 Unduh Langsung Installer Aplikasi:

Installer versi terbaru yang sudah siap pakai dapat langsung diunduh di:
👉 **[Halaman Rilis Resmi GitHub (Releases)](https://github.com/rizkyghofur/flutter-auto-installer/releases)**

| Sistem Operasi | File Installer Siap Pakai | Tipe & Keterangan |
| :--- | :--- | :--- |
| 🪟 **Windows** | `Flutter-Auto-Installer-Setup-X.X.X.exe` | Setup Wizard (Otomatis buat shortcut Desktop & Start Menu) |
| 🪟 **Windows** | `Flutter-Auto-Installer-X.X.X.exe` | Portable Executable (langsung klik buka tanpa instal) |
| 🍏 **macOS** | `Flutter-Auto-Installer-X.X.X-arm64.dmg` | Apple Disk Image untuk **Mac Apple Silicon (M1 / M2 / M3 / M4)** |
| 🍏 **macOS** | `Flutter-Auto-Installer-X.X.X.dmg` | Apple Disk Image untuk **Mac Intel** |
| 🐧 **Linux** | `Flutter-Auto-Installer-X.X.X.AppImage` | Standalone Linux Executable (kompatibel semua distro Linux) |
| 🐧 **Linux** | `flutter-auto-installer_X.X.X_amd64.deb` | Paket Instalasi resmi untuk Debian / Ubuntu |

---

### 🚀 Cara Menerbitkan Versi Rilis Baru (Otomatis via GitHub CI/CD):

Anda **tidak perlu meng-compile manual** di 3 komputer berbeda. GitHub Actions akan otomatis meng-compile dan menerbitkan semua file installer ke tab **Releases** setiap kali Anda push versi tag baru:

1. **Update Versi di `package.json`** (misal dari `1.0.0` ke `1.0.1`).
2. **Jalankan Perintah Git di Terminal**:
   ```bash
   git add .
   git commit -m "feat: rilis pembaruan v1.0.1"
   git tag v1.0.1
   git push origin main --tags
   ```
3. **Selesai!** GitHub Actions akan otomatis:
   - Menyalakan 3 mesin cloud virtual (Windows, macOS, Linux).
   - Meng-compile file `.exe`, `.dmg`, `.AppImage`, dan `.deb`.
   - Langsung mengunggah semua installer ke tab **Releases** repositori Anda.

---

### 💻 Cara Compile Manual di Laptop Windows (Opsional)

Jika ingin meng-compile file lokal tanpa push ke GitHub:

```bash
# Compile Installer Windows (.exe)
npm run dist:win

# Compile Installer Linux (.AppImage & .deb)
npm run dist:linux
```
Hasil file installer akan tersimpan di dalam folder `dist/`.
