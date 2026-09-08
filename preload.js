const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("installerAPI", {
  checkSystemStatus: () => ipcRenderer.invoke("check-system-status"),
  getAppMetadata: () => ipcRenderer.invoke("get-app-metadata"),
  checkFlutterUpdate: () => ipcRenderer.invoke("check-flutter-update"),
  upgradeFlutter: () => ipcRenderer.send("flutter-upgrade"),
  runFlutterDoctorParsed: () => ipcRenderer.invoke("run-flutter-doctor-parsed"),
  startInstallation: (installDir) =>
    ipcRenderer.send("start-installation", installDir),
  installTool: (toolId) => ipcRenderer.send("install-tool", toolId),
  runAndroidLicenses: () => ipcRenderer.send("run-android-licenses"),
  autoAcceptAndroidLicenses: () =>
    ipcRenderer.invoke("auto-accept-android-licenses"),
  selectProjectDirectory: () => ipcRenderer.invoke("select-project-directory"),
  createFlutterProject: (data) =>
    ipcRenderer.invoke("create-flutter-project", data),
  openProjectInVSCode: (projectPath) =>
    ipcRenderer.send("open-project-in-vscode", projectPath),
  cancelInstallation: () => ipcRenderer.send("cancel-installation"),
  openPath: (targetPath) => ipcRenderer.send("open-path", targetPath),
  openExternalUrl: (url) => ipcRenderer.send("open-external-url", url),

  onInstallStarted: (callback) =>
    ipcRenderer.on("install-started", () => callback()),
  onInstallLog: (callback) =>
    ipcRenderer.on("install-log", (event, data) => callback(data)),
  onInstallFinished: (callback) =>
    ipcRenderer.on("install-finished", (event, data) => callback(data)),
  onToolInstallFinished: (callback) =>
    ipcRenderer.on("tool-install-finished", (event, data) => callback(data)),
});
