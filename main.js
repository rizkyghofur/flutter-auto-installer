const { app, BrowserWindow, ipcMain, shell, dialog } = require("electron");
const path = require("path");
const { spawn, exec } = require("child_process");
const os = require("os");
const fs = require("fs");

let mainWindow;
let activeProcess = null;

const packageJson = require("./package.json");

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1240,
    height: 835,
    resizable: false,
    maximizable: false,
    autoHideMenuBar: true,
    title: "Flutter Dev Environment & One-Click Installer",
    icon: path.join(__dirname, "assets", "flutter-logo.png"),
    backgroundColor: "#0b0f19",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "src", "index.html"));
}

ipcMain.handle("get-app-metadata", () => {
  return {
    appName: "Flutter & Android Dev Suite",
    version: packageJson.version || "1.0.0",
    buildNumber: packageJson.buildNumber || 1,
    author: packageJson.author || "Rizki Abdul Gofur",
    description:
      "One-Click Auto Installer & Environment Setup Suite for Flutter and Android Development",
    year: new Date().getFullYear(),
  };
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// Helper Promise exec
function execPromise(cmd, timeoutMs = 8000) {
  return new Promise((resolve) => {
    exec(cmd, { timeout: timeoutMs }, (error, stdout, stderr) => {
      if (error) {
        resolve({ found: false, output: "" });
      } else {
        resolve({ found: true, output: (stdout || stderr).trim() });
      }
    });
  });
}

// -----------------------------------------------------------------------------
// System Status Checker (Git, Java, Flutter, Android Studio, VS Code, Xcode)
// -----------------------------------------------------------------------------
ipcMain.handle("check-system-status", async () => {
  const isWindows = process.platform === "win32";
  const isMac = process.platform === "darwin";
  const isLinux = process.platform === "linux";

  const defaultFlutterPath = isWindows
    ? "C:\\src\\flutter"
    : path.join(os.homedir(), "development", "flutter");
  const flutterExistsOnDisk = fs.existsSync(defaultFlutterPath);

  // Periksa Git, Java, Flutter
  const [gitCheck, javaCheck, flutterCheck] = await Promise.all([
    execPromise("git --version"),
    execPromise("java -version"),
    execPromise("flutter --version"),
  ]);

  // Periksa VS Code
  let vscodeCheck = await execPromise("code --version");
  if (!vscodeCheck.found) {
    // Check disk paths
    if (isWindows) {
      const paths = [
        path.join(
          process.env.LOCALAPPDATA || "",
          "Programs",
          "Microsoft VS Code",
          "Code.exe",
        ),
        "C:\\Program Files\\Microsoft VS Code\\Code.exe",
      ];
      if (paths.some((p) => fs.existsSync(p))) {
        vscodeCheck = { found: true, output: "Visual Studio Code Terpasang" };
      }
    } else if (isMac) {
      if (fs.existsSync("/Applications/Visual Studio Code.app")) {
        vscodeCheck = { found: true, output: "Visual Studio Code Terpasang" };
      }
    } else if (isLinux) {
      if (fs.existsSync("/usr/bin/code") || fs.existsSync("/snap/bin/code")) {
        vscodeCheck = { found: true, output: "Visual Studio Code Terpasang" };
      }
    }
  }

  // Periksa Android Studio
  let androidStudioFound = false;
  let androidStudioVer = "";
  if (isWindows) {
    const asPaths = [
      "C:\\Program Files\\Android\\Android Studio\\bin\\studio64.exe",
      path.join(
        process.env.LOCALAPPDATA || "",
        "Programs",
        "Android Studio",
        "bin",
        "studio64.exe",
      ),
    ];
    androidStudioFound = asPaths.some((p) => fs.existsSync(p));
  } else if (isMac) {
    androidStudioFound = fs.existsSync("/Applications/Android Studio.app");
  } else if (isLinux) {
    const asLinuxPaths = [
      "/opt/android-studio/bin/studio.sh",
      "/snap/bin/android-studio",
      path.join(os.homedir(), "android-studio", "bin", "studio.sh"),
    ];
    androidStudioFound = asLinuxPaths.some((p) => fs.existsSync(p));
  }

  // Periksa Android SDK
  let androidSdkPath = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;
  if (!androidSdkPath) {
    if (isWindows) {
      const defaultWinSdk = path.join(
        process.env.LOCALAPPDATA || "",
        "Android",
        "Sdk",
      );
      if (fs.existsSync(defaultWinSdk)) androidSdkPath = defaultWinSdk;
    } else if (isMac) {
      const defaultMacSdk = path.join(
        os.homedir(),
        "Library",
        "Android",
        "sdk",
      );
      if (fs.existsSync(defaultMacSdk)) androidSdkPath = defaultMacSdk;
    } else {
      const defaultLinuxSdk = path.join(os.homedir(), "Android", "Sdk");
      if (fs.existsSync(defaultLinuxSdk)) androidSdkPath = defaultLinuxSdk;
    }
  }

  // Periksa Xcode (Khusus macOS)
  let xcodeStatus = { applicable: isMac, found: false, output: "" };
  if (isMac) {
    const xcodeCheck = await execPromise("xcodebuild -version");
    if (xcodeCheck.found) {
      xcodeStatus.found = true;
      xcodeStatus.output = xcodeCheck.output.split("\n")[0];
    } else if (fs.existsSync("/Applications/Xcode.app")) {
      xcodeStatus.found = true;
      xcodeStatus.output = "Xcode.app Terpasang";
    }
  }

  // Periksa Status Lisensi Android SDK
  let androidLicensesAccepted = false;
  let androidLicensesChecked = false;
  if (androidSdkPath) {
    const licensesDir = path.join(androidSdkPath, "licenses");
    if (fs.existsSync(licensesDir)) {
      const androidSdkLicense = path.join(licensesDir, "android-sdk-license");
      if (fs.existsSync(androidSdkLicense)) {
        try {
          const content = fs.readFileSync(androidSdkLicense, "utf8");
          if (content.trim().length > 0) {
            androidLicensesAccepted = true;
          }
        } catch (e) {}
      }
    }
    androidLicensesChecked = true;
  }

  return {
    platform: process.platform,
    defaultInstallDir: defaultFlutterPath,
    flutterExistsOnDisk,
    git: gitCheck,
    java: javaCheck,
    flutter: flutterCheck,
    vscode: vscodeCheck,
    androidStudio: {
      found: androidStudioFound,
      output: androidStudioFound
        ? "Android Studio Terpasang"
        : "Belum Terpasang",
    },
    androidSdk: {
      found: !!androidSdkPath,
      path: androidSdkPath || null,
    },
    androidLicenses: {
      checked: androidLicensesChecked,
      accepted: androidLicensesAccepted,
    },
    xcode: xcodeStatus,
  };
});

// -----------------------------------------------------------------------------
// Run Flutter Doctor and Parse output to structured format
// -----------------------------------------------------------------------------
ipcMain.handle("run-flutter-doctor-parsed", async () => {
  const isWindows = process.platform === "win32";
  const flutterCmd = isWindows ? "flutter.bat doctor -v" : "flutter doctor -v";

  // Also check default local path if not in env PATH
  const defaultFlutterBin = isWindows
    ? "C:\\src\\flutter\\bin\\flutter.bat"
    : path.join(os.homedir(), "development", "flutter", "bin", "flutter");

  let execCmd = flutterCmd;
  if (fs.existsSync(defaultFlutterBin)) {
    execCmd = `"${defaultFlutterBin}" doctor -v`;
  }

  return new Promise((resolve) => {
    exec(execCmd, { maxBuffer: 1024 * 1024 * 2 }, (error, stdout, stderr) => {
      const rawText = stdout || stderr || "";

      if (!rawText || rawText.trim().length === 0) {
        resolve({
          success: false,
          raw: "Flutter belum terinstal atau belum terdaftar di PATH.",
          items: [
            {
              title: "Flutter SDK Tidak Ditemukan",
              status: "fail",
              details: [
                "Jalankan One-Click Installer terlebih dahulu untuk mengunduh Flutter SDK.",
              ],
              solution: 'Klik tombol "Mulai Instalasi (1-Klik)" di tab utama.',
            },
          ],
        });
        return;
      }

      // Parser logic
      const items = [];
      const lines = rawText.split(/\r?\n/);
      let currentItem = null;

      for (const line of lines) {
        // Deteksi header kategori (contoh: [✓] Flutter, [!] Android toolchain, [✗] Chrome)
        const match = line.match(/^\[([✓!xX! -])\]\s*(.+)$/);
        if (match) {
          if (currentItem) items.push(currentItem);

          const symbol = match[1];
          const title = match[2].trim();
          let status = "warn";
          if (symbol === "✓" || symbol === "v" || symbol === "+")
            status = "pass";
          else if (symbol === "x" || symbol === "X" || symbol === "!")
            status = symbol === "!" ? "warn" : "fail";

          currentItem = {
            title: title,
            status: status,
            details: [],
            solution: "",
          };
        } else if (currentItem) {
          const trimmed = line.trim();
          if (trimmed) {
            currentItem.details.push(trimmed);
          }
        }
      }
      if (currentItem) items.push(currentItem);

      // Tambahkan panduan solusi ramah pemula untuk tiap kategori
      for (const item of items) {
        const titleLower = item.title.toLowerCase();
        if (item.status !== "pass") {
          if (
            titleLower.includes("android toolchain") ||
            titleLower.includes("android sdk")
          ) {
            item.solution =
              'Buka Android Studio > SDK Manager > SDK Tools > centang "Android SDK Command-line Tools". Setelah itu jalankan di terminal: flutter doctor --android-licenses lalu tekan "y" untuk semua persetujuan.';
          } else if (titleLower.includes("android studio")) {
            item.solution =
              'Pasang aplikasi Android Studio menggunakan tombol "Instal Android Studio" di tab IDE Installer.';
          } else if (
            titleLower.includes("vs code") ||
            titleLower.includes("visual studio code")
          ) {
            item.solution =
              'Pasang VS Code lalu buka Extensions (Ctrl+Shift+X) dan cari ekstensi resmi "Flutter" dan "Dart".';
          } else if (titleLower.includes("chrome")) {
            item.solution =
              "Instal Google Chrome jika ingin mengembangkan aplikasi Flutter versi Web.";
          } else if (titleLower.includes("xcode")) {
            item.solution =
              "Buka Mac App Store dan instal Xcode, lalu jalankan di terminal: sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer && sudo xcodebuild -runFirstLaunch";
          } else if (titleLower.includes("connected device")) {
            item.solution =
              "Hubungkan HP Android dengan kabel USB (aktifkan USB Debugging di Opsi Pengembang) atau buat Emulator Android Virtual Device di Android Studio.";
          } else {
            item.solution =
              "Ikuti petunjuk perbaikan yang tertera di detail log di atas.";
          }
        }
      }

      resolve({
        success: true,
        raw: rawText,
        items: items,
      });
    });
  });
});

// -----------------------------------------------------------------------------
// Start Installation Runner (Core Flutter & Java)
// -----------------------------------------------------------------------------
ipcMain.on("start-installation", (event, customInstallDir) => {
  if (activeProcess) {
    event.reply(
      "install-log",
      "[INFO] Proses instalasi sedang berlangsung...\n",
    );
    return;
  }

  const isWindows = process.platform === "win32";
  const isMac = process.platform === "darwin";

  event.reply("install-started");

  if (isWindows) {
    const scriptInDir = path.join(__dirname, "scripts", "install_windows.ps1");
    const psScript = fs.existsSync(scriptInDir)
      ? scriptInDir
      : path.join(__dirname, "install_windows.ps1");

    activeProcess = spawn("powershell.exe", [
      "-NoProfile",
      "-ExecutionPolicy",
      "Bypass",
      "-File",
      psScript,
    ]);
  } else if (isMac) {
    const scriptInDir = path.join(
      __dirname,
      "scripts",
      "install_macos.command",
    );
    const macScript = fs.existsSync(scriptInDir)
      ? scriptInDir
      : path.join(__dirname, "install_macos.command");

    activeProcess = spawn("bash", [macScript]);
  } else {
    const scriptInDir = path.join(__dirname, "scripts", "install_linux.sh");
    const linuxScript = fs.existsSync(scriptInDir)
      ? scriptInDir
      : path.join(__dirname, "install_linux.sh");

    activeProcess = spawn("bash", [linuxScript]);
  }

  activeProcess.stdout.on("data", (data) => {
    event.reply("install-log", data.toString());
  });

  activeProcess.stderr.on("data", (data) => {
    event.reply("install-log", data.toString());
  });

  activeProcess.on("close", (code) => {
    activeProcess = null;
    event.reply("install-finished", { exitCode: code });
  });

  activeProcess.on("error", (err) => {
    activeProcess = null;
    event.reply(
      "install-log",
      `[ERROR] Gagal menjalankan proses instalasi: ${err.message}\n`,
    );
    event.reply("install-finished", { exitCode: 1 });
  });
});

// -----------------------------------------------------------------------------
// Install IDE Tools (Android Studio, VS Code, Xcode)
// -----------------------------------------------------------------------------
ipcMain.on("install-tool", (event, toolId) => {
  const isWindows = process.platform === "win32";
  const isMac = process.platform === "darwin";
  const isLinux = process.platform === "linux";

  event.reply(
    "install-log",
    `\n=== Memulai Instalasi: ${toolId.toUpperCase()} ===\n`,
  );

  if (toolId === "android-studio") {
    if (isWindows) {
      event.reply(
        "install-log",
        "Mencoba memasang Android Studio via winget...\n",
      );
      const proc = spawn("winget", [
        "install",
        "--id",
        "Google.AndroidStudio",
        "-e",
        "--source",
        "winget",
        "--accept-source-agreements",
        "--accept-package-agreements",
      ]);
      proc.stdout.on("data", (d) => event.reply("install-log", d.toString()));
      proc.stderr.on("data", (d) => event.reply("install-log", d.toString()));
      proc.on("close", (code) => {
        if (code !== 0) {
          event.reply(
            "install-log",
            "Winget tidak berhasil atau dibatalkan. Membuka halaman unduh resmi Android Studio di browser...\n",
          );
          shell.openExternal("https://developer.android.com/studio");
        } else {
          event.reply("install-log", "✓ Android Studio berhasil dipasang!\n");
        }
        event.reply("tool-install-finished", { toolId, code });
      });
    } else if (isMac) {
      shell.openExternal("https://developer.android.com/studio");
      event.reply(
        "install-log",
        "Membuka laman unduh resmi Android Studio untuk Mac...\n",
      );
      event.reply("tool-install-finished", { toolId, code: 0 });
    } else {
      shell.openExternal("https://developer.android.com/studio");
      event.reply("tool-install-finished", { toolId, code: 0 });
    }
  } else if (toolId === "vscode") {
    if (isWindows) {
      event.reply("install-log", "Memasang Visual Studio Code via winget...\n");
      const proc = spawn("winget", [
        "install",
        "--id",
        "Microsoft.VisualStudioCode",
        "-e",
        "--source",
        "winget",
        "--accept-source-agreements",
        "--accept-package-agreements",
      ]);
      proc.stdout.on("data", (d) => event.reply("install-log", d.toString()));
      proc.stderr.on("data", (d) => event.reply("install-log", d.toString()));
      proc.on("close", (code) => {
        if (code !== 0) {
          shell.openExternal("https://code.visualstudio.com/Download");
        } else {
          event.reply(
            "install-log",
            "✓ Visual Studio Code berhasil dipasang!\n",
          );
        }
        event.reply("tool-install-finished", { toolId, code });
      });
    } else if (isMac) {
      shell.openExternal("https://code.visualstudio.com/Download");
      event.reply("tool-install-finished", { toolId, code: 0 });
    } else {
      shell.openExternal("https://code.visualstudio.com/Download");
      event.reply("tool-install-finished", { toolId, code: 0 });
    }
  } else if (toolId === "xcode") {
    if (isMac) {
      event.reply(
        "install-log",
        "Membuka Mac App Store untuk menginstal Xcode...\n",
      );
      shell.openExternal("macappstore://apps.apple.com/app/xcode/id497799835");
    } else {
      event.reply(
        "install-log",
        "[INFO] Xcode hanya tersedia secara eksklusif untuk sistem operasi macOS (Apple).\n",
      );
    }
    event.reply("tool-install-finished", { toolId, code: 0 });
  }
});

// -----------------------------------------------------------------------------
// Check Flutter Version & Available Upgrade
// -----------------------------------------------------------------------------
ipcMain.handle("check-flutter-update", async () => {
  const isWindows = process.platform === "win32";
  const defaultFlutterBin = isWindows
    ? "C:\\src\\flutter\\bin\\flutter.bat"
    : path.join(os.homedir(), "development", "flutter", "bin", "flutter");

  // Cari lokasi executable flutter
  let flutterExe = "flutter";
  let flutterGitDir = null;

  if (fs.existsSync(defaultFlutterBin)) {
    flutterExe = `"${defaultFlutterBin}"`;
    flutterGitDir = path.dirname(path.dirname(defaultFlutterBin));
  } else {
    const whichRes = await execPromise(
      isWindows ? "where flutter" : "which flutter",
    );
    if (whichRes.found && whichRes.output) {
      const firstPath = whichRes.output.split(/\r?\n/)[0].trim();
      flutterExe = `"${firstPath}"`;
      flutterGitDir = path.dirname(path.dirname(firstPath));
    }
  }

  // Cek versi lokal
  const verRes = await execPromise(`${flutterExe} --version`);
  if (!verRes.found) {
    return {
      installed: false,
      currentVersion: null,
      channel: null,
      upgradeAvailable: false,
      latestVersion: null,
      message: "Flutter SDK belum terpasang.",
    };
  }

  const verOutput = verRes.output;
  const match = verOutput.match(
    /Flutter\s+([\d\.]+)\s+[•\-]\s+channel\s+(\w+)/i,
  );
  const currentVersion = match ? match[1] : "Terpasang";
  const channel = match ? match[2] : "stable";

  // Cek apakah ada update via git remote jika direktori .git flutter ada
  let upgradeAvailable = false;
  let latestVersion = currentVersion;
  let updateDetail = "";

  if (flutterGitDir && fs.existsSync(path.join(flutterGitDir, ".git"))) {
    try {
      const gitFetchRes = await execPromise(
        `git -C "${flutterGitDir}" fetch origin ${channel} --tags`,
        12000,
      );
      const gitStatusRes = await execPromise(
        `git -C "${flutterGitDir}" status -uno`,
        6000,
      );

      if (
        gitStatusRes.output.includes("Your branch is behind") ||
        gitStatusRes.output.includes("have diverged")
      ) {
        upgradeAvailable = true;
        updateDetail = "Versi baru tersedia di branch " + channel;
      }

      // Ambil tag rilis stable terbaru
      const latestTagRes = await execPromise(
        `git -C "${flutterGitDir}" describe --tags origin/${channel}`,
        6000,
      );
      if (latestTagRes.found && latestTagRes.output) {
        latestVersion = latestTagRes.output.trim().split("-")[0];
        if (latestVersion !== currentVersion) {
          upgradeAvailable = true;
        }
      }
    } catch (e) {
      console.error("Error checking flutter git updates:", e);
    }
  }

  return {
    installed: true,
    currentVersion,
    channel,
    upgradeAvailable,
    latestVersion: latestVersion || currentVersion,
    message: upgradeAvailable
      ? "Pembaruan rilis Flutter tersedia!"
      : "Flutter sudah di versi terbaru.",
  };
});

ipcMain.on("flutter-upgrade", (event) => {
  if (activeProcess) {
    event.reply("install-log", "[INFO] Proses lain sedang berjalan...\n");
    return;
  }

  event.reply("install-started");
  event.reply(
    "install-log",
    "\n=== Menjalankan Flutter Upgrade (channel stable) ===\n",
  );

  const isWindows = process.platform === "win32";
  const defaultFlutterBin = isWindows
    ? "C:\\src\\flutter\\bin\\flutter.bat"
    : path.join(os.homedir(), "development", "flutter", "bin", "flutter");

  let flutterCmd = "flutter";
  if (fs.existsSync(defaultFlutterBin)) {
    flutterCmd = defaultFlutterBin;
  }

  activeProcess = spawn(flutterCmd, ["upgrade"], { shell: true });

  activeProcess.stdout.on("data", (data) =>
    event.reply("install-log", data.toString()),
  );
  activeProcess.stderr.on("data", (data) =>
    event.reply("install-log", data.toString()),
  );

  activeProcess.on("close", (code) => {
    activeProcess = null;
    event.reply("install-finished", { exitCode: code });
  });

  activeProcess.on("error", (err) => {
    activeProcess = null;
    event.reply(
      "install-log",
      `[ERROR] Gagal menjalankan flutter upgrade: ${err.message}\n`,
    );
    event.reply("install-finished", { exitCode: 1 });
  });
});

// -----------------------------------------------------------------------------
// Open Android Licenses Interactive Helper & Auto-Accept
// -----------------------------------------------------------------------------
ipcMain.on("run-android-licenses", (event) => {
  const isWindows = process.platform === "win32";
  const cmd = isWindows
    ? 'start cmd /k "flutter doctor --android-licenses"'
    : "flutter doctor --android-licenses";
  exec(cmd);
});

ipcMain.handle("auto-accept-android-licenses", async () => {
  return new Promise((resolve) => {
    let flutterCmd = "flutter";
    const defaultFlutterBin =
      process.platform === "win32"
        ? "C:\\src\\flutter\\bin\\flutter.bat"
        : path.join(os.homedir(), "development", "flutter", "bin", "flutter");

    if (fs.existsSync(defaultFlutterBin)) {
      flutterCmd = defaultFlutterBin;
    }

    const proc = spawn(flutterCmd, ["doctor", "--android-licenses"], {
      shell: true,
    });

    let output = "";

    proc.stdout.on("data", (data) => {
      const text = data.toString();
      output += text;
      // Otomatis kirim 'y\n' jika ditanya persetujuan lisensi
      if (
        text.includes("(y/N)?") ||
        text.includes("(y/n)?") ||
        text.includes("[y/N]") ||
        text.includes("[y/n]")
      ) {
        try {
          proc.stdin.write("y\n");
        } catch (e) {}
      }
    });

    proc.stderr.on("data", (data) => {
      const text = data.toString();
      output += text;
      if (
        text.includes("(y/N)?") ||
        text.includes("(y/n)?") ||
        text.includes("[y/N]") ||
        text.includes("[y/n]")
      ) {
        try {
          proc.stdin.write("y\n");
        } catch (e) {}
      }
    });

    // Kirim beberapa stream y\n untuk memastikan lisensi beruntun otomatis disetujui
    const interval = setInterval(() => {
      try {
        if (proc.stdin && !proc.killed) {
          proc.stdin.write("y\n");
        }
      } catch (e) {}
    }, 800);

    proc.on("close", (code) => {
      clearInterval(interval);
      resolve({
        success:
          code === 0 || output.includes("All SDK package licenses accepted"),
        output: output,
      });
    });

    proc.on("error", (err) => {
      clearInterval(interval);
      resolve({
        success: false,
        error: err.message,
      });
    });

    // Timeout safety 45 detik
    setTimeout(() => {
      clearInterval(interval);
      try {
        if (!proc.killed) proc.kill();
      } catch (e) {}
      resolve({
        success: output.includes("All SDK package licenses accepted"),
        output: output,
      });
    }, 45000);
  });
});

// -----------------------------------------------------------------------------
// Quick Create Flutter Project
// -----------------------------------------------------------------------------
ipcMain.handle("select-project-directory", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: "Pilih Folder Lokasi Proyek",
    properties: ["openDirectory", "createDirectory"],
  });
  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }
  return result.filePaths[0];
});

ipcMain.handle(
  "create-flutter-project",
  async (event, { projectName, targetDirectory }) => {
    return new Promise((resolve) => {
      let flutterCmd = "flutter";
      const defaultFlutterBin =
        process.platform === "win32"
          ? "C:\\src\\flutter\\bin\\flutter.bat"
          : path.join(os.homedir(), "development", "flutter", "bin", "flutter");

      if (fs.existsSync(defaultFlutterBin)) {
        flutterCmd = defaultFlutterBin;
      }

      const projectPath = path.join(targetDirectory, projectName);
      const args = ["create"];
      if (platforms && Array.isArray(platforms) && platforms.length > 0) {
        args.push("--platforms", platforms.join(","));
      }
      args.push(projectName);

      const proc = spawn(flutterCmd, args, {
        cwd: targetDirectory,
        shell: true,
      });

      let output = "";

      proc.stdout.on("data", (data) => {
        output += data.toString();
      });

      proc.stderr.on("data", (data) => {
        output += data.toString();
      });

      proc.on("close", (code) => {
        if (code === 0 && fs.existsSync(projectPath)) {
          resolve({
            success: true,
            projectPath: projectPath,
            output: output,
          });
        } else {
          resolve({
            success: false,
            error: output || `Proses keluar dengan kode ${code}`,
          });
        }
      });

      proc.on("error", (err) => {
        resolve({
          success: false,
          error: err.message,
        });
      });
    });
  },
);

ipcMain.on("open-project-in-vscode", (event, projectPath) => {
  const isWindows = process.platform === "win32";
  const cmd = isWindows ? `code "${projectPath}"` : `code "${projectPath}"`;
  exec(cmd, (err) => {
    if (err) {
      shell.openPath(projectPath);
    }
  });
});

// -----------------------------------------------------------------------------
// Cancel & Utilities
// -----------------------------------------------------------------------------
ipcMain.on("cancel-installation", (event) => {
  if (activeProcess) {
    activeProcess.kill("SIGTERM");
    activeProcess = null;
    event.reply(
      "install-log",
      "\n[PERINGATAN] Proses instalasi dibatalkan oleh pengguna.\n",
    );
    event.reply("install-finished", { exitCode: -1 });
  }
});

ipcMain.on("open-path", (event, targetPath) => {
  if (fs.existsSync(targetPath)) {
    shell.openPath(targetPath);
  } else {
    shell.openPath(path.dirname(targetPath));
  }
});

ipcMain.on("open-external-url", (event, url) => {
  shell.openExternal(url);
});
