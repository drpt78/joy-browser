const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimize:  () => ipcRenderer.send('window-minimize'),
  maximize:  () => ipcRenderer.send('window-maximize'),
  close:     () => ipcRenderer.send('window-close'),
  saveState: (data) => ipcRenderer.invoke('save-state', data),
  loadState: () => ipcRenderer.invoke('load-state'),
  setZoom:   (factor) => ipcRenderer.send('set-zoom', factor),
  onDownloadStarted:  (cb) => ipcRenderer.on('download-started',  (_, data) => cb(data)),
  onDownloadProgress: (cb) => ipcRenderer.on('download-progress', (_, data) => cb(data)),
  onDownloadDone:     (cb) => ipcRenderer.on('download-done',     (_, data) => cb(data)),
});
