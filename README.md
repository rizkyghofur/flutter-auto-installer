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

## 📦 Cara Compile Installer (Windows, macOS, Linux)

### Cara 1: Otomatis via GitHub Actions CI/CD (Rekomendasi ⭐)

Anda tidak perlu memiliki 3 komputer fisik. GitHub akan meminjamkan 3 server asli (Windows, Mac, Linux) di cloud untuk meng-compile aplikasi:

1. Buat tag versi baru di terminal dan push ke GitHub:
   ```bash
   git add .
   git commit -m "release: siapkan versi v1.0.0"
   git tag v1.0.0
   git push origin main --tags
   ```
2. Buka tab **Actions** di repositori GitHub Anda.
3. Server GitHub akan meng-compile sekaligus:
   - 🪟 **Windows**: `.exe` Installer (Setup Wizard) & Portable
   - 🍏 **macOS**: `.dmg` Installer & `.zip` (Intel & Apple Silicon M1/M2/M3)
   - 🐧 **Linux**: `.AppImage` & `.deb`
4. Setelah selesai, seluruh installer siap diunduh di tab **Releases** GitHub Anda!

### Cara 2: Compile Langsung dari Laptop Windows

Untuk meng-compile paket Windows atau Linux dari komputer Anda saat ini:

```bash
# Compile Installer Windows (.exe)
npm run dist:win

# Compile Installer Linux (.AppImage & .deb)
npm run dist:linux
```
Hasil file installer akan tersimpan di folder `dist/`.
