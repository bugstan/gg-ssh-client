/* 主菜单设置 */
const { app, Menu, BrowserWindow, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

/**
 * 创建应用菜单
 * @param {BrowserWindow} mainWindow - 主窗口实例
 */
function createAppMenu(mainWindow) {
  const isMac = process.platform === 'darwin';
  
  const template = [
    // 应用菜单 (仅macOS)
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about', label: '关于' },
        { type: 'separator' },
        { role: 'services', label: '服务' },
        { type: 'separator' },
        { role: 'hide', label: '隐藏' },
        { role: 'hideOthers', label: '隐藏其他' },
        { role: 'unhide', label: '显示全部' },
        { type: 'separator' },
        { role: 'quit', label: '退出' }
      ]
    }] : []),
    
    // 文件菜单
    {
      label: '文件',
      submenu: [
        {
          label: '新建连接',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('menu-new-connection');
          }
        },
        {
          label: '导入连接',
          accelerator: 'CmdOrCtrl+I',
          click: async () => {
            const { canceled, filePaths } = await dialog.showOpenDialog({
              title: '导入连接',
              filters: [{ name: 'JSON文件', extensions: ['json'] }],
              properties: ['openFile']
            });
            
            if (!canceled && filePaths.length > 0) {
              try {
                const data = fs.readFileSync(filePaths[0], 'utf8');
                const connections = JSON.parse(data);
                mainWindow.webContents.send('import-connections', connections);
              } catch (error) {
                dialog.showErrorBox('导入失败', `无法导入连接: ${error.message}`);
              }
            }
          }
        },
        {
          label: '导出连接',
          accelerator: 'CmdOrCtrl+E',
          click: async () => {
            mainWindow.webContents.send('request-export-connections');
            
            // 导出事件将在渲染进程处理，并通过IPC发送回主进程
          }
        },
        { type: 'separator' },
        isMac ? { role: 'close', label: '关闭' } : { role: 'quit', label: '退出' }
      ]
    },
    
    // 编辑菜单
    {
      label: '编辑',
      submenu: [
        { role: 'undo', label: '撤销' },
        { role: 'redo', label: '重做' },
        { type: 'separator' },
        { role: 'cut', label: '剪切' },
        { role: 'copy', label: '复制' },
        { role: 'paste', label: '粘贴' },
        ...(isMac ? [
          { role: 'pasteAndMatchStyle', label: '粘贴并匹配样式' },
          { role: 'delete', label: '删除' },
          { role: 'selectAll', label: '全选' },
          { type: 'separator' },
        ] : [
          { role: 'delete', label: '删除' },
          { type: 'separator' },
          { role: 'selectAll', label: '全选' }
        ])
      ]
    },
    
    // 视图菜单
    {
      label: '视图',
      submenu: [
        { role: 'reload', label: '重新加载' },
        { role: 'forceReload', label: '强制重新加载' },
        ...(process.env.NODE_ENV === 'development' 
            ? [{ role: 'toggleDevTools', label: '开发者工具' }] 
            : []),
        { type: 'separator' },
        { role: 'resetZoom', label: '重置缩放' },
        { role: 'zoomIn', label: '放大' },
        { role: 'zoomOut', label: '缩小' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: '切换全屏' }
      ]
    },
    
    // 终端菜单
    {
      label: '终端',
      submenu: [
        {
          label: '清空终端',
          accelerator: 'CmdOrCtrl+K',
          click: () => {
            mainWindow.webContents.send('menu-clear-terminal');
          }
        },
        {
          label: '断开连接',
          accelerator: 'CmdOrCtrl+D',
          click: () => {
            mainWindow.webContents.send('menu-disconnect');
          }
        },
        { type: 'separator' },
        {
          label: '字体大小',
          submenu: [
            {
              label: '增大字体',
              accelerator: 'CmdOrCtrl+Plus',
              click: () => {
                mainWindow.webContents.send('menu-font-size-increase');
              }
            },
            {
              label: '减小字体',
              accelerator: 'CmdOrCtrl+-',
              click: () => {
                mainWindow.webContents.send('menu-font-size-decrease');
              }
            },
            {
              label: '重置字体',
              accelerator: 'CmdOrCtrl+0',
              click: () => {
                mainWindow.webContents.send('menu-font-size-reset');
              }
            }
          ]
        }
      ]
    },
    
    // 窗口菜单
    {
      label: '窗口',
      submenu: [
        { role: 'minimize', label: '最小化' },
        { role: 'zoom', label: '缩放' },
        ...(isMac ? [
          { type: 'separator' },
          { role: 'front', label: '前置所有窗口' },
          { type: 'separator' },
          { role: 'window', label: '窗口' }
        ] : [
          { role: 'close', label: '关闭' }
        ])
      ]
    },
    
    // 帮助菜单
    {
      role: 'help',
      label: '帮助',
      submenu: [
        {
          label: '帮助文档',
          click: async () => {
            const helpWindow = new BrowserWindow({
              width: 900,
              height: 700,
              parent: mainWindow,
              modal: false,
              icon: path.join(__dirname, 'assets/icon.png'),
              webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
              }
            });
            
            helpWindow.loadFile('help.html');
            helpWindow.setMenuBarVisibility(false);
          }
        },
        {
          label: '关于',
          click: async () => {
            const aboutWindow = new BrowserWindow({
              width: 600,
              height: 600,
              parent: mainWindow,
              modal: true,
              icon: path.join(__dirname, 'assets/icon.png'),
              webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
              }
            });
            
            aboutWindow.loadFile('about.html');
            aboutWindow.setMenuBarVisibility(false);
          }
        }
      ]
    }
  ];
  
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

module.exports = { createAppMenu };
