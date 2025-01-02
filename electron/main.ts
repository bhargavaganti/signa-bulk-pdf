import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:8080');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Expose directory picker to renderer
  mainWindow.webContents.executeJavaScript(`
    window.electron = {
      showDirectoryPicker: () => ipcMain.invoke('show-directory-picker'),
      signPDFs: (data) => ipcMain.invoke('sign-pdfs', data),
    };
  `);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Handle directory picker
ipcMain.handle('show-directory-picker', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  
  if (!result.canceled) {
    return result.filePaths[0];
  }
  return null;
});

// Handle PDF signing
ipcMain.handle('sign-pdfs', async (event, { files, signaturePosition, destinationPath }) => {
  // This is where we'll implement the actual PDF signing logic
  // using the DSC token and node-signpdf
  // For now, we'll just return true
  return true;
});