const { app, BrowserWindow } = require('electron');
const path = require('path');

// Configure live reload for Electron
require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
});

function createWindow() {
  // Cria uma janela de navegação.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // Ativar integração Node.js no processo de renderização
      contextIsolation: false, // Configurações importantes para este projeto (altere para produção!)
      enableRemoteModule: true, // Permite o uso do módulo remoto, se necessário
    }
  });

  // Carrega o arquivo index.html da aplicação.
  mainWindow.loadFile('index.html');

  // Abre o DevTools.
  mainWindow.webContents.openDevTools(); // Descomente esta linha para abrir o DevTools
}

app.whenReady().then(createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
