// UI Elements: Navigation
const navTabs = document.querySelectorAll(".nav-tab");
const tabPanes = document.querySelectorAll(".tab-pane");
const topHeaderTitle = document.getElementById("topHeaderTitle");
const topHeaderSubtitle = document.getElementById("topHeaderSubtitle");

// Tab 1 Elements
const osBadge = document.getElementById("osBadge");
const btnRefreshStatus = document.getElementById("btnRefreshStatus");
const lblTargetDir = document.getElementById("lblTargetDir");
const statusGit = document.getElementById("statusGit");
const statusJava = document.getElementById("statusJava");
const statusFlutter = document.getElementById("statusFlutter");
const statusAndroid = document.getElementById("statusAndroid");
const statusLicenses = document.getElementById("statusLicenses");

// Smart Action Card & Notice Banner
const badgeActionTag = document.getElementById("badgeActionTag");
const lblActionTitle = document.getElementById("lblActionTitle");
const lblBtnInstallText = document.getElementById("lblBtnInstallText");
const installerNoticeBanner = document.getElementById("installerNoticeBanner");
const noticeBannerIcon = document.getElementById("noticeBannerIcon");
const noticeBannerText = document.getElementById("noticeBannerText");

// Sidebar Flutter Version Widget
const btnCheckUpdate = document.getElementById("btnCheckUpdate");
const lblCurrentFlutterVer = document.getElementById("lblCurrentFlutterVer");
const rowLatestVer = document.getElementById("rowLatestVer");
const lblLatestFlutterVer = document.getElementById("lblLatestFlutterVer");
const lblUpdateStatus = document.getElementById("lblUpdateStatus");
const btnUpgradeFlutter = document.getElementById("btnUpgradeFlutter");

const btnActionCreateProject = document.getElementById(
  "btnActionCreateProject",
);
const btnStartInstall = document.getElementById("btnStartInstall");
const btnCancelInstall = document.getElementById("btnCancelInstall");
const lblProgressStatus = document.getElementById("lblProgressStatus");
const lblProgressPercent = document.getElementById("lblProgressPercent");
const progressBarFill = document.getElementById("progressBarFill");
const terminalLog = document.getElementById("terminalLog");
const btnClearLog = document.getElementById("btnClearLog");
const quickActions = document.getElementById("quickActions");
const btnQuickCreateProject = document.getElementById("btnQuickCreateProject");
const btnOpenFlutterFolder = document.getElementById("btnOpenFlutterFolder");
const btnGoToDoctor = document.getElementById("btnGoToDoctor");

// Tab 2 Elements: IDEs
const badgeAndroidStudio = document.getElementById("badgeAndroidStudio");
const badgeLicenses = document.getElementById("badgeLicenses");
const badgeVSCode = document.getElementById("badgeVSCode");
const badgeXcode = document.getElementById("badgeXcode");
const btnInstallAndroidStudio = document.getElementById(
  "btnInstallAndroidStudio",
);
const btnInstallVSCode = document.getElementById("btnInstallVSCode");
const btnInstallXcode = document.getElementById("btnInstallXcode");
const btnAndroidLicenses = document.getElementById("btnAndroidLicenses");
const btnAutoAcceptLicenses = document.getElementById("btnAutoAcceptLicenses");
const btnInstallExtensions = document.getElementById("btnInstallExtensions");
const lblXcodeNote = document.getElementById("lblXcodeNote");

// Modal Elements: Quick Create Project
const modalCreateProject = document.getElementById("modalCreateProject");
const btnCloseModal = document.getElementById("btnCloseModal");
const btnCancelCreateProject = document.getElementById(
  "btnCancelCreateProject",
);
const btnSubmitCreateProject = document.getElementById(
  "btnSubmitCreateProject",
);
const btnBrowseProjectDir = document.getElementById("btnBrowseProjectDir");
const inputProjectName = document.getElementById("inputProjectName");
const inputProjectDir = document.getElementById("inputProjectDir");
const createProjectStatus = document.getElementById("createProjectStatus");
const createProjectStatusText = document.getElementById(
  "createProjectStatusText",
);

// Tab 3 Elements: Doctor
const btnRunDoctor = document.getElementById("btnRunDoctor");
const doctorResults = document.getElementById("doctorResults");

let currentInstallDir = "C:\\src\\flutter";
let isRunning = false;
let currentPlatform = "win32";

// -----------------------------------------------------------------------------
// Tab Switching Logic (Sidebar)
// -----------------------------------------------------------------------------
const tabTitles = {
  "tab-install": {
    title: "Auto Installer",
    subtitle: "Instalasi Flutter SDK & Java JDK otomatis",
  },
  "tab-ides": {
    title: "IDE & Tools",
    subtitle: "Pemasangan editor kode dan perangkat pendukung",
  },
  "tab-doctor": {
    title: "Visual Doctor",
    subtitle: "Pemeriksaan kesiapan sistem dan panduan solusi",
  },
};

navTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const targetTab = tab.dataset.tab;
    navTabs.forEach((t) => t.classList.remove("active"));
    tabPanes.forEach((p) => p.classList.remove("active"));

    tab.classList.add("active");
    const activePane = document.getElementById(targetTab);
    if (activePane) activePane.classList.add("active");

    if (tabTitles[targetTab]) {
      topHeaderTitle.textContent = tabTitles[targetTab].title;
      topHeaderSubtitle.textContent = tabTitles[targetTab].subtitle;
    }
  });
});

if (btnGoToDoctor) {
  btnGoToDoctor.addEventListener("click", () => {
    document.querySelector('[data-tab="tab-doctor"]').click();
    runDoctorAnalysis();
  });
}

// -----------------------------------------------------------------------------
// Format OS Platform Display
// -----------------------------------------------------------------------------
function updateOsBadge(platform) {
  currentPlatform = platform;
  const osIcon = document.getElementById("osIcon");
  const osName = document.getElementById("osName");

  if (!osIcon || !osName) {
    if (osBadge) {
      if (platform === "win32") osBadge.textContent = "Windows (x64)";
      else if (platform === "darwin") osBadge.textContent = "macOS";
      else osBadge.textContent = "Linux";
    }
    return;
  }

  if (platform === "win32") {
    osIcon.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
      </svg>
    `;
    osName.textContent = "Windows (x64)";
  } else if (platform === "darwin") {
    osIcon.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.88c.61-.75 1.04-1.8 1.01-2.88-.96.04-2.16.64-2.84 1.44-.57.66-1.08 1.74-.95 2.78 1.07.08 2.2-.6 2.78-1.34z"/>
      </svg>
    `;
    osName.textContent = "macOS";
  } else {
    osIcon.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="9"/>
        <path d="M8 12h8"/>
      </svg>
    `;
    osName.textContent = "Linux";
  }
}

// -----------------------------------------------------------------------------
// Helper: Update Single Status Item
// -----------------------------------------------------------------------------
function setStatusItem(element, state, valueText) {
  if (!element) return;
  const indicator = element.querySelector(".indicator");
  const value = element.querySelector(".value");

  if (indicator) indicator.className = "indicator " + state;
  if (value) value.textContent = valueText;
}

// -----------------------------------------------------------------------------
// Check & Update System Status + Smart Action Button Logic
// -----------------------------------------------------------------------------
async function refreshStatus() {
  btnRefreshStatus.classList.add("rotating");
  try {
    const status = await window.installerAPI.checkSystemStatus();
    updateOsBadge(status.platform);

    currentInstallDir = status.defaultInstallDir;
    if (lblTargetDir) lblTargetDir.textContent = currentInstallDir;

    // Track missing components
    const missingCoreComponents = [];

    // Git Status
    if (status.git.found) {
      setStatusItem(statusGit, "success", status.git.output.split("\n")[0]);
    } else {
      missingCoreComponents.push("Git Version Control");
      setStatusItem(
        statusGit,
        "danger",
        "Belum terpasang (akan diinstal otomatis)",
      );
    }

    // Java Status
    if (status.java.found) {
      const isJava17 = status.java.output.includes("17.");
      setStatusItem(
        statusJava,
        isJava17 ? "success" : "warning",
        isJava17
          ? "OpenJDK 17 LTS Terdeteksi"
          : "Bukan versi 17 (Disarankan Java 17)",
      );
      if (!isJava17) {
        missingCoreComponents.push("Java OpenJDK 17 LTS");
      }
    } else {
      missingCoreComponents.push("Java OpenJDK 17");
      setStatusItem(
        statusJava,
        "danger",
        "Belum terpasang (akan diinstal otomatis)",
      );
    }

    // Flutter Status
    if (status.flutter.found) {
      setStatusItem(
        statusFlutter,
        "success",
        status.flutter.output.split("\n")[0],
      );
    } else if (status.flutterExistsOnDisk) {
      setStatusItem(
        statusFlutter,
        "warning",
        "Folder ada di disk (siap registrasi)",
      );
      missingCoreComponents.push("Registrasi PATH Flutter");
    } else {
      missingCoreComponents.push("Flutter SDK (Stable)");
      setStatusItem(statusFlutter, "danger", "Belum terpasang");
    }

    // Android SDK Status
    if (status.androidSdk.found) {
      setStatusItem(
        statusAndroid,
        "success",
        status.androidSdk.path || "Android SDK Terdeteksi",
      );
    } else {
      setStatusItem(
        statusAndroid,
        "warning",
        "Android SDK belum terdeteksi (opsional pasang via IDE)",
      );
    }

    // Android Licenses Status
    if (status.androidLicenses && status.androidLicenses.accepted) {
      if (statusLicenses)
        setStatusItem(statusLicenses, "success", "Semua lisensi disetujui");
      if (badgeLicenses) {
        badgeLicenses.textContent = "Lisensi: ✓ Disetujui";
        badgeLicenses.className = "license-pill accepted";
      }
      if (btnAutoAcceptLicenses) {
        btnAutoAcceptLicenses.textContent = "✓ Lengkap";
        btnAutoAcceptLicenses.className = "btn-license-auto done";
        btnAutoAcceptLicenses.disabled = true;
      }
      if (btnAndroidLicenses) {
        btnAndroidLicenses.textContent = "CLI";
      }
    } else if (status.androidSdk.found) {
      if (statusLicenses)
        setStatusItem(
          statusLicenses,
          "warning",
          "Belum disetujui (perlu konfirmasi)",
        );
      if (badgeLicenses) {
        badgeLicenses.textContent = "Lisensi: ⚠️ Belum Disetujui";
        badgeLicenses.className = "license-pill pending";
      }
      if (btnAutoAcceptLicenses) {
        btnAutoAcceptLicenses.textContent = "⚡ Auto Setujui";
        btnAutoAcceptLicenses.className = "btn-license-auto";
        btnAutoAcceptLicenses.disabled = false;
      }
      if (btnAndroidLicenses) {
        btnAndroidLicenses.textContent = "CLI";
      }
    } else {
      if (statusLicenses)
        setStatusItem(statusLicenses, "danger", "Menunggu Android SDK");
      if (badgeLicenses) {
        badgeLicenses.textContent = "Lisensi: -";
        badgeLicenses.className = "license-pill";
      }
      if (btnAutoAcceptLicenses) {
        btnAutoAcceptLicenses.textContent = "⚡ Auto Setujui";
        btnAutoAcceptLicenses.className = "btn-license-auto";
        btnAutoAcceptLicenses.disabled = true;
      }
    }

    // -------------------------------------------------------------------------
    // SMART CONTEXTUAL ACTION CARD: Cegah kebingungan pengguna!
    // -------------------------------------------------------------------------
    if (missingCoreComponents.length === 0) {
      // Komponen utama (Git, Java 17, Flutter SDK) SUDAH LENGKAP!
      badgeActionTag.textContent = "Lingkungan Inti Siap";
      badgeActionTag.style.color = "#10b981";
      lblActionTitle.textContent = "Komponen Utama Sudah Terpasang!";
      lblBtnInstallText.textContent = "Instal Ulang / Perbaiki";
      btnStartInstall.className = "btn-primary";
      if (btnActionCreateProject) {
        btnActionCreateProject.style.display = "inline-flex";
      }

      installerNoticeBanner.className = "notice-banner all-ready";
      noticeBannerIcon.textContent = "🎉";
      noticeBannerText.innerHTML =
        "<strong>Sistem Anda sudah memiliki Flutter & Java OpenJDK 17.</strong> Klik <strong>Buat Proyek</strong> untuk langsung mulai coding, atau gunakan tombol instal ulang jika ingin memperbarui instalasi.";
      lblProgressStatus.textContent =
        "Semua komponen inti telah siap digunakan.";
    } else {
      // Masih ada komponen yang belum terpasang
      badgeActionTag.textContent = `${missingCoreComponents.length} Komponen Perlu Dipasang`;
      badgeActionTag.style.color = "#f59e0b";
      lblActionTitle.textContent = "Instalasi Komponen yang Belum Ada";
      lblBtnInstallText.textContent = "Mulai Instalasi Otomatis";
      btnStartInstall.className = "btn-primary";
      if (btnActionCreateProject) {
        btnActionCreateProject.style.display = "none";
      }

      installerNoticeBanner.className = "notice-banner missing-items";
      noticeBannerIcon.textContent = "⚡";
      noticeBannerText.innerHTML = `Komponen yang akan disiapkan otomatis: <strong>${missingCoreComponents.join(", ")}</strong>. Cukup klik tombol di atas dan tunggu prosesnya.`;
      lblProgressStatus.textContent = "Menunggu perintah instalasi...";
    }

    // IDE Cards Status
    // VS Code
    if (status.vscode && status.vscode.found) {
      badgeVSCode.textContent = "✓ Terpasang";
      badgeVSCode.className = "ide-badge installed";
      btnInstallVSCode.textContent = "Buka VS Code";
      btnInstallVSCode.onclick = () =>
        window.installerAPI.installTool("vscode");
    } else {
      badgeVSCode.textContent = "Belum Ada";
      badgeVSCode.className = "ide-badge not-installed";
      btnInstallVSCode.textContent = "Instal Visual Studio Code";
      btnInstallVSCode.onclick = () => {
        document.querySelector('[data-tab="tab-install"]').click();
        window.installerAPI.installTool("vscode");
      };
    }

    // Android Studio
    if (status.androidStudio && status.androidStudio.found) {
      badgeAndroidStudio.textContent = "✓ Terpasang";
      badgeAndroidStudio.className = "ide-badge installed";
      btnInstallAndroidStudio.textContent = "Sudah Terpasang";
      btnInstallAndroidStudio.classList.add("disabled");
    } else {
      badgeAndroidStudio.textContent = "Belum Ada";
      badgeAndroidStudio.className = "ide-badge not-installed";
      btnInstallAndroidStudio.textContent = "Instal Android Studio";
      btnInstallAndroidStudio.classList.remove("disabled");
      btnInstallAndroidStudio.onclick = () => {
        document.querySelector('[data-tab="tab-install"]').click();
        window.installerAPI.installTool("android-studio");
      };
    }

    // Xcode (macOS)
    if (status.platform === "darwin") {
      if (status.xcode && status.xcode.found) {
        badgeXcode.textContent = "✓ Terpasang";
        badgeXcode.className = "ide-badge installed";
        btnInstallXcode.textContent = "Sudah Terpasang";
        btnInstallXcode.classList.add("disabled");
      } else {
        badgeXcode.textContent = "Belum Ada";
        badgeXcode.className = "ide-badge not-installed";
        btnInstallXcode.textContent = "Buka Mac App Store";
        btnInstallXcode.classList.remove("disabled");
        btnInstallXcode.onclick = () =>
          window.installerAPI.installTool("xcode");
      }
      lblXcodeNote.textContent = "Apple Developer Tools";
    } else {
      badgeXcode.textContent = "Khusus macOS";
      badgeXcode.className = "ide-badge";
      btnInstallXcode.textContent = "Tidak Tersedia di OS Ini";
      btnInstallXcode.classList.add("disabled");
      lblXcodeNote.textContent = "Xcode hanya tersedia di Apple Mac";
    }

    // Cek versi & update Flutter di sidebar
    checkFlutterVersionAndUpdates();
  } catch (err) {
    console.error("Failed checking status:", err);
  } finally {
    btnRefreshStatus.classList.remove("rotating");
  }
}

// -----------------------------------------------------------------------------
// Check Flutter Version & Available Upgrade (Sidebar Widget)
// -----------------------------------------------------------------------------
async function checkFlutterVersionAndUpdates() {
  btnCheckUpdate.classList.add("rotating");
  btnCheckUpdate.disabled = true;

  // Tampilkan state loading di field Terbaru, Versi, dan Status
  if (rowLatestVer) rowLatestVer.style.display = "flex";
  if (lblLatestFlutterVer) {
    lblLatestFlutterVer.textContent = "Memeriksa...";
    lblLatestFlutterVer.classList.add("sv-loading");
  }
  if (lblCurrentFlutterVer) {
    lblCurrentFlutterVer.classList.add("sv-loading");
  }
  lblUpdateStatus.textContent = "Memeriksa rilis...";
  lblUpdateStatus.style.color = "#38bdf8";

  try {
    const info = await window.installerAPI.checkFlutterUpdate();
    if (lblCurrentFlutterVer)
      lblCurrentFlutterVer.classList.remove("sv-loading");
    if (lblLatestFlutterVer) lblLatestFlutterVer.classList.remove("sv-loading");

    if (!info.installed) {
      lblCurrentFlutterVer.textContent = "Belum Ada";
      if (lblLatestFlutterVer) lblLatestFlutterVer.textContent = "-";
      lblUpdateStatus.textContent = "Menunggu instalasi";
      lblUpdateStatus.style.color = "#ef4444";
      btnUpgradeFlutter.style.display = "none";
      return;
    }

    lblCurrentFlutterVer.textContent = `${info.currentVersion} (${info.channel})`;

    if (info.upgradeAvailable) {
      if (lblLatestFlutterVer) {
        lblLatestFlutterVer.textContent = `${info.latestVersion} (${info.channel})`;
      }
      if (rowLatestVer) rowLatestVer.style.display = "flex";
      lblUpdateStatus.textContent = `Update rilis tersedia!`;
      lblUpdateStatus.style.color = "#f59e0b";
      btnUpgradeFlutter.style.display = "block";
      btnUpgradeFlutter.textContent = `🚀 Update ke v${info.latestVersion}`;
    } else {
      if (lblLatestFlutterVer) {
        lblLatestFlutterVer.textContent = `${info.currentVersion} (${info.channel})`;
      }
      if (rowLatestVer) rowLatestVer.style.display = "flex";
      lblUpdateStatus.textContent = "✓ Rilis Terbaru";
      lblUpdateStatus.style.color = "#10b981";
      btnUpgradeFlutter.style.display = "none";
    }
  } catch (err) {
    console.error("Failed checking flutter update:", err);
    if (lblCurrentFlutterVer)
      lblCurrentFlutterVer.classList.remove("sv-loading");
    if (lblLatestFlutterVer) {
      lblLatestFlutterVer.classList.remove("sv-loading");
      lblLatestFlutterVer.textContent = "-";
    }
    lblUpdateStatus.textContent = "Gagal memeriksa";
    lblUpdateStatus.style.color = "#ef4444";
  } finally {
    btnCheckUpdate.classList.remove("rotating");
    btnCheckUpdate.disabled = false;
  }
}

// -----------------------------------------------------------------------------
// Step Tracker
// -----------------------------------------------------------------------------
function setStep(stepNumber) {
  for (let i = 1; i <= 5; i++) {
    const node = document.getElementById(`stepNode${i}`);
    if (!node) continue;
    if (i < stepNumber) {
      node.className = "step-node completed";
    } else if (i === stepNumber) {
      node.className = "step-node active";
    } else {
      node.className = "step-node";
    }
  }
}

// -----------------------------------------------------------------------------
// Terminal Helpers
// -----------------------------------------------------------------------------
function appendLog(text) {
  terminalLog.textContent += text;
  terminalLog.scrollTop = terminalLog.scrollHeight;

  if (text.includes("[1/5]") || text.includes("[1/4]")) {
    setStep(1);
    progressBarFill.style.width = "20%";
    lblProgressPercent.textContent = "20%";
    lblProgressStatus.textContent = "Memeriksa Dependensi & Git...";
  } else if (text.includes("[2/5]") || text.includes("[2/4]")) {
    setStep(2);
    progressBarFill.style.width = "40%";
    lblProgressPercent.textContent = "40%";
    lblProgressStatus.textContent = "Mengunduh & Menyiapkan Java OpenJDK 17...";
  } else if (text.includes("[3/5]") || text.includes("[3/4]")) {
    setStep(3);
    progressBarFill.style.width = "60%";
    lblProgressPercent.textContent = "60%";
    lblProgressStatus.textContent = "Melakukan Clone Flutter SDK (Stable)...";
  } else if (text.includes("[4/5]")) {
    setStep(4);
    progressBarFill.style.width = "80%";
    lblProgressPercent.textContent = "80%";
    lblProgressStatus.textContent = "Menata Environment PATH & JAVA_HOME...";
  } else if (text.includes("[5/5]") || text.includes("flutter doctor")) {
    setStep(5);
    progressBarFill.style.width = "90%";
    lblProgressPercent.textContent = "90%";
    lblProgressStatus.textContent = "Menjalankan Verifikasi Flutter Doctor...";
  }
}

// -----------------------------------------------------------------------------
// Visual Flutter Doctor Runner
// -----------------------------------------------------------------------------
async function runDoctorAnalysis() {
  btnRunDoctor.disabled = true;
  btnRunDoctor.innerHTML = "<span>Memindai Lingkungan...</span>";
  doctorResults.innerHTML = `
    <div class="card empty-doctor">
      <p>Sedang menjalankan analisis <code>flutter doctor -v</code>. Mohon tunggu beberapa detik...</p>
    </div>
  `;

  try {
    const report = await window.installerAPI.runFlutterDoctorParsed();
    doctorResults.innerHTML = "";

    if (!report.items || report.items.length === 0) {
      doctorResults.innerHTML = `
        <div class="card empty-doctor">
          <p>${report.raw || "Tidak ada data pemeriksaan ditemukan."}</p>
        </div>
      `;
      return;
    }

    report.items.forEach((item) => {
      const card = document.createElement("div");
      card.className = `doctor-card ${item.status}`;

      let iconSymbol = "✓";
      if (item.status === "warn") iconSymbol = "!";
      if (item.status === "fail") iconSymbol = "✗";

      let solutionHtml = "";
      if (item.solution) {
        solutionHtml = `
          <div class="doctor-solution-banner">
            <strong>💡 Cara Mengatasi:</strong> ${item.solution}
          </div>
        `;
      }

      let detailsHtml = "";
      if (item.details && item.details.length > 0) {
        detailsHtml = `
          <div class="doctor-details-list">
            ${item.details.map((d) => `<div>• ${escapeHtml(d)}</div>`).join("")}
          </div>
        `;
      }

      card.innerHTML = `
        <div class="doctor-card-top">
          <div class="doctor-card-title-group">
            <span class="doctor-badge-status">${iconSymbol}</span>
            <span class="doctor-title-text">${escapeHtml(item.title)}</span>
          </div>
        </div>
        ${solutionHtml}
        ${detailsHtml}
      `;

      doctorResults.appendChild(card);
    });
  } catch (err) {
    doctorResults.innerHTML = `
      <div class="card empty-doctor">
        <p style="color: var(--danger);">Gagal menjalankan analisis: ${err.message}</p>
      </div>
    `;
  } finally {
    btnRunDoctor.disabled = false;
    btnRunDoctor.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
      <span>Jalankan Analisis Sekarang</span>
    `;
  }
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// -----------------------------------------------------------------------------
// Event Listeners
// -----------------------------------------------------------------------------
btnRefreshStatus.addEventListener("click", refreshStatus);
btnRunDoctor.addEventListener("click", runDoctorAnalysis);
btnCheckUpdate.addEventListener("click", checkFlutterVersionAndUpdates);

btnUpgradeFlutter.addEventListener("click", () => {
  document.querySelector('[data-tab="tab-install"]').click();
  terminalLog.textContent = "=== Memulai Flutter Upgrade ===\n";
  progressBarFill.style.width = "10%";
  lblProgressPercent.textContent = "10%";
  lblProgressStatus.textContent = "Memperbarui Flutter SDK...";
  window.installerAPI.upgradeFlutter();
});

btnClearLog.addEventListener("click", () => {
  terminalLog.textContent = "";
});

btnStartInstall.addEventListener("click", () => {
  if (isRunning) return;
  terminalLog.textContent = "=== Memulai Proses Auto-Installer ===\n";
  progressBarFill.style.width = "5%";
  lblProgressPercent.textContent = "5%";
  lblProgressStatus.textContent = "Memulai proses instalasi...";
  setStep(1);
  window.installerAPI.startInstallation(currentInstallDir);
});

btnCancelInstall.addEventListener("click", () => {
  window.installerAPI.cancelInstallation();
});

btnOpenFlutterFolder.addEventListener("click", () => {
  window.installerAPI.openPath(currentInstallDir);
});

btnAndroidLicenses.addEventListener("click", () => {
  window.installerAPI.runAndroidLicenses();
});

if (btnAutoAcceptLicenses) {
  btnAutoAcceptLicenses.addEventListener("click", async () => {
    btnAutoAcceptLicenses.disabled = true;
    btnAutoAcceptLicenses.textContent = "⏳ Memproses...";
    try {
      const res = await window.installerAPI.autoAcceptAndroidLicenses();
      if (res.success) {
        btnAutoAcceptLicenses.textContent = "✓ Disetujui!";
        btnAutoAcceptLicenses.className = "btn-license-auto done";
        setTimeout(refreshStatus, 1200);
      } else {
        btnAutoAcceptLicenses.disabled = false;
        btnAutoAcceptLicenses.textContent = "⚡ Auto Setujui";
        alert(
          "Gagal menyetujui lisensi otomatis. Silakan gunakan tombol CLI untuk konfirmasi manual.",
        );
      }
    } catch (err) {
      console.error(err);
      btnAutoAcceptLicenses.disabled = false;
      btnAutoAcceptLicenses.textContent = "⚡ Auto Setujui";
    }
  });
}

btnInstallExtensions.addEventListener("click", () => {
  window.installerAPI.openExternalUrl(
    "https://marketplace.visualstudio.com/items?itemName=Dart-Code.flutter",
  );
});

// -----------------------------------------------------------------------------
// Quick Create Project Modal Events
// -----------------------------------------------------------------------------
function openCreateProjectModal() {
  modalCreateProject.style.display = "flex";
  createProjectStatus.style.display = "none";
  btnSubmitCreateProject.disabled = false;
  btnCancelCreateProject.disabled = false;

  // 1. Set default target directory multi-platform
  if (!inputProjectDir.value) {
    if (currentInstallDir) {
      // Gunakan folder parent instalasi jika ada (misal C:\src atau ~/development)
      const parts = currentInstallDir.split(/[/\\]/);
      parts.pop(); // buang 'flutter'
      inputProjectDir.value =
        parts.join(currentInstallDir.includes("/") ? "/" : "\\") ||
        currentInstallDir;
    } else {
      inputProjectDir.value = "C:\\src";
    }
  }

  // 2. Auto-focus & select input nama proyek untuk kenyamanan mengetik
  setTimeout(() => {
    if (inputProjectName) {
      inputProjectName.focus();
      inputProjectName.select();
    }
  }, 50);
}

function closeCreateProjectModal() {
  if (btnSubmitCreateProject && btnSubmitCreateProject.disabled) return; // Jangan tutup jika sedang proses build
  modalCreateProject.style.display = "none";
}

if (btnQuickCreateProject) {
  btnQuickCreateProject.addEventListener("click", openCreateProjectModal);
}

if (btnActionCreateProject) {
  btnActionCreateProject.addEventListener("click", openCreateProjectModal);
}

if (btnCloseModal) {
  btnCloseModal.addEventListener("click", closeCreateProjectModal);
}

if (btnCancelCreateProject) {
  btnCancelCreateProject.addEventListener("click", closeCreateProjectModal);
}

// 3. Pintasan Keyboard: Esc untuk tutup modal & Enter untuk submit
window.addEventListener("keydown", (e) => {
  if (modalCreateProject && modalCreateProject.style.display === "flex") {
    if (e.key === "Escape") {
      closeCreateProjectModal();
    } else if (
      e.key === "Enter" &&
      document.activeElement === inputProjectName
    ) {
      e.preventDefault();
      if (btnSubmitCreateProject && !btnSubmitCreateProject.disabled) {
        btnSubmitCreateProject.click();
      }
    }
  }
});

// Tutup modal jika klik di luar modal-card (backdrop)
if (modalCreateProject) {
  modalCreateProject.addEventListener("click", (e) => {
    if (e.target === modalCreateProject) {
      closeCreateProjectModal();
    }
  });
}

if (btnBrowseProjectDir) {
  btnBrowseProjectDir.addEventListener("click", async () => {
    const selected = await window.installerAPI.selectProjectDirectory();
    if (selected) {
      inputProjectDir.value = selected;
    }
  });
}

if (btnSubmitCreateProject) {
  btnSubmitCreateProject.addEventListener("click", async () => {
    const rawName = inputProjectName.value.trim().toLowerCase();
    const cleanName = rawName.replace(/[^a-z0-9_]/g, "_");
    const targetDir = inputProjectDir.value.trim();

    // Ambil platform yang dipilih
    const selectedPlatforms = [];
    document
      .querySelectorAll('input[name="projPlatform"]:checked')
      .forEach((cb) => selectedPlatforms.push(cb.value));

    if (!cleanName) {
      alert("Nama proyek tidak boleh kosong!");
      return;
    }
    if (!targetDir) {
      alert("Silakan pilih folder lokasi proyek terlebih dahulu!");
      return;
    }
    if (selectedPlatforms.length === 0) {
      alert("Pilih minimal satu target platform untuk proyek!");
      return;
    }

    inputProjectName.value = cleanName;
    btnSubmitCreateProject.disabled = true;
    btnCancelCreateProject.disabled = true;
    createProjectStatus.style.display = "flex";
    createProjectStatusText.textContent = `Menjalankan: flutter create --platforms ${selectedPlatforms.join(",")} ${cleanName}...`;

    try {
      const res = await window.installerAPI.createFlutterProject({
        projectName: cleanName,
        targetDirectory: targetDir,
        platforms: selectedPlatforms,
      });

      if (res.success) {
        createProjectStatusText.textContent = `Proyek ${cleanName} berhasil dibuat! Membuka di VS Code...`;
        window.installerAPI.openProjectInVSCode(res.projectPath);
        setTimeout(() => {
          modalCreateProject.style.display = "none";
          btnSubmitCreateProject.disabled = false;
          btnCancelCreateProject.disabled = false;
        }, 1500);
      } else {
        createProjectStatusText.textContent = `Gagal membuat proyek.`;
        alert(`Gagal membuat proyek:\n${res.error}`);
        btnSubmitCreateProject.disabled = false;
        btnCancelCreateProject.disabled = false;
      }
    } catch (err) {
      alert(`Terjadi error: ${err.message}`);
      btnSubmitCreateProject.disabled = false;
      btnCancelCreateProject.disabled = false;
    }
  });
}

// -----------------------------------------------------------------------------
// IPC Listeners
// -----------------------------------------------------------------------------
window.installerAPI.onInstallStarted(() => {
  isRunning = true;
  btnStartInstall.style.display = "none";
  btnCancelInstall.style.display = "inline-block";
  quickActions.style.display = "none";
});

window.installerAPI.onInstallLog((logText) => {
  appendLog(logText);
});

window.installerAPI.onInstallFinished((data) => {
  isRunning = false;
  btnStartInstall.style.display = "inline-flex";
  btnCancelInstall.style.display = "none";

  if (data.exitCode === 0) {
    progressBarFill.style.width = "100%";
    lblProgressPercent.textContent = "100%";
    lblProgressStatus.textContent = "Instalasi Berhasil Selesai!";
    setStep(6);
    appendLog(
      "\n[SUKSES] Seluruh proses instalasi telah selesai dengan sukses!\n",
    );
    quickActions.style.display = "flex";
  } else if (data.exitCode === -1) {
    lblProgressStatus.textContent = "Instalasi Dibatalkan.";
    appendLog("\n[INFO] Instalasi dibatalkan.\n");
  } else {
    lblProgressStatus.textContent = "Proses selesai dengan catatan.";
    appendLog(
      `\n[INFO] Proses berakhir dengan kode keluar: ${data.exitCode}\n`,
    );
    quickActions.style.display = "flex";
  }

  setTimeout(refreshStatus, 1500);
});

window.installerAPI.onToolInstallFinished((data) => {
  appendLog(`\n[INFO] Proses instalasi ${data.toolId} selesai.\n`);
  setTimeout(refreshStatus, 1500);
});

// -----------------------------------------------------------------------------
// Load About Metadata
// -----------------------------------------------------------------------------
async function loadAboutMetadata() {
  try {
    const meta = await window.installerAPI.getAppMetadata();
    const versionNameEl = document.getElementById("aboutVersionName");
    const buildNumberEl = document.getElementById("aboutBuildNumber");
    const footerVersionText = document.getElementById("footerVersionText");

    if (versionNameEl && meta.version) {
      versionNameEl.textContent = `v${meta.version}`;
    }
    if (buildNumberEl && meta.buildNumber) {
      buildNumberEl.textContent = `Build #${meta.buildNumber}`;
    }
    if (footerVersionText && meta.version) {
      footerVersionText.textContent = `v${meta.version} (Build #${meta.buildNumber || 1})`;
    }
  } catch (err) {
    console.error("Failed loading app metadata:", err);
  }
}

// Init
refreshStatus();
loadAboutMetadata();
