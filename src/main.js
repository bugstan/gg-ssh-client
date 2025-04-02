const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { createAppMenu } = require('./menu');
const fs = require('fs');

// 防止垃圾回收
let mainWindow;

// 获取储存的语言设置
function getSavedLanguage() {
  try {
    // 尝试从用户数据目录读取语言设置
    const userDataPath = app.getPath('userData');
    const settingsPath = path.join(userDataPath, 'settings.json');
    
    if (fs.existsSync(settingsPath)) {
      const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
      return settings.language || 'zh-CN';
    }
  } catch (error) {
    console.error('读取语言设置失败:', error);
  }
  
  return 'zh-CN'; // 默认为中文
}

// 保存语言设置到文件
function saveLanguageSetting(language) {
  try {
    const userDataPath = app.getPath('userData');
    const settingsPath = path.join(userDataPath, 'settings.json');
    
    let settings = {};
    
    // 如果文件存在，先读取现有内容
    if (fs.existsSync(settingsPath)) {
      settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    }
    
    // 更新语言设置
    settings.language = language;
    
    // 写入文件
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
    
    return true;
  } catch (error) {
    console.error('保存语言设置失败:', error);
    return false;
  }
}

// 创建主窗口
function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: true,
      sandbox: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // 加载入口文件
  mainWindow.loadFile('index.html');

  // 开发环境打开开发者工具
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // 获取语言设置
  const language = getSavedLanguage();
  
  // 创建应用菜单，直接使用获取的语言设置
  createAppMenu(mainWindow, language);

  // 监听语言变更事件
  ipcMain.on('language-changed', (event, language) => {
    // 保存语言设置
    saveLanguageSetting(language);
    // 重新创建菜单
    createAppMenu(mainWindow, language);
  });

  // 监听请求语言事件
  ipcMain.on('request-language', (event) => {
    const language = getSavedLanguage();
    event.sender.send('sync-language', language);
  });

  // DOM加载完成后同步语言设置
  mainWindow.webContents.on('dom-ready', () => {
    mainWindow.webContents.send('sync-language', language);
  });

  // 监听窗口关闭事件
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 应用就绪时创建窗口
app.on('ready', createWindow);

// 当所有窗口关闭时退出应用
app.on('window-all-closed', () => {
  // macOS 中除非用户按下 Cmd + Q 显式退出，否则应用不会退出
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // macOS 中点击 dock 图标时没有已打开的其它窗口则重新创建一个窗口
  if (mainWindow === null) {
    createWindow();
  }
});

// 禁用复用渲染进程以允许远程模块加载
app.allowRendererProcessReuse = false; 