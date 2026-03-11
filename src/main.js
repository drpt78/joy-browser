const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function getStatePath() {
  return path.join(app.getPath('userData'), 'browser-state.json');
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    titleBarStyle: 'hidden',
    transparent: true,
    backgroundColor: '#00000000',
    roundedCorners: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webviewTag: true,
    },
    icon: path.join(__dirname, 'icon.png'),
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Block close until state is saved
  mainWindow.on('close', (e) => {
    e.preventDefault();
    mainWindow.webContents.executeJavaScript('JSON.stringify(getStateToSave())')
      .then((state) => {
        console.log('[main] saving state on close, activePanel =', JSON.parse(state).activePanel);
        fs.writeFileSync(getStatePath(), state);
      })
      .catch((err) => console.error('[main] save failed:', err))
      .finally(() => mainWindow.destroy());
  });
}

app.whenReady().then(() => {
  session.defaultSession.webRequest.onBeforeRequest(
    { urls: ['*://*/*'] },
    (details, callback) => {
      const blocklist = [
        /doubleclick\.net/,
        /googlesyndication\.com/,
        /googletagmanager\.com/,
        /googletagservices\.com/,
        /google-analytics\.com/,
        /facebook\.net\/en_US\/fbevents\.js/,
        /ads\.twitter\.com/,
        /adservice\.google\./,
        /pagead2\.googlesyndication\.com/,
        /securepubads\.g\.doubleclick\.net/,
      ];
      const shouldBlock = blocklist.some((re) => re.test(details.url));
      callback({ cancel: shouldBlock });
    }
  );

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('window-minimize', () => mainWindow.minimize());
ipcMain.on('window-maximize', () => {
  mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
});
ipcMain.on('window-close', () => mainWindow.close());

ipcMain.handle('save-state', (event, data) => {
  try { fs.writeFileSync(getStatePath(), JSON.stringify(data)); } catch (e) {}
});
ipcMain.handle('load-state', () => {
  try {
    const raw = fs.readFileSync(getStatePath(), 'utf8');
    return JSON.parse(raw);
  } catch (e) { return null; }
});

ipcMain.on('set-zoom', (event, factor) => {
  if (mainWindow) mainWindow.webContents.setZoomFactor(factor);
});
