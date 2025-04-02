/**
 * SSH客户端 - 预加载脚本
 * 为渲染进程提供安全的Node.js API访问
 */
const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');
const os = require('os');

// 导出到渲染进程的API
contextBridge.exposeInMainWorld('electron', {
  // 版本信息
  versions: {
    node: process.versions.node,
    electron: process.versions.electron
  },
  
  // 操作系统信息
  os: {
    platform: process.platform,
    arch: process.arch,
    release: os.release(),
    homedir: os.homedir()
  },
  
  // 路径辅助函数
  path: {
    join: (...args) => path.join(...args),
    resolve: (...args) => path.resolve(...args)
  },
  
  // SSH连接相关
  connectSSH: (connection) => {
    return ipcRenderer.invoke('ssh:connect', connection);
  },
  
  disconnectSSH: (id) => {
    return ipcRenderer.invoke('ssh:disconnect', id);
  },
  
  sendSSHData: (id, data) => {
    ipcRenderer.send('ssh:data', { id, data });
  },
  
  onSSHData: (id, callback) => {
    const listener = (event, data) => {
      if (data.id === id) {
        callback(data.data);
      }
    };
    
    ipcRenderer.on('ssh:data', listener);
    
    return () => {
      ipcRenderer.removeListener('ssh:data', listener);
    };
  },
  
  // 文件操作相关
  saveFile: async (options) => {
    return ipcRenderer.invoke('dialog:saveFile', options);
  },
  
  openFile: async (options) => {
    return ipcRenderer.invoke('dialog:openFile', options);
  },
  
  // 与主进程的通信
  setLanguage: (language) => {
    ipcRenderer.send('language-changed', language);
  },
  
  // 监听主进程同步的语言设置
  onSyncLanguage: (callback) => {
    const listener = (event, language) => {
      callback(language);
    };
    
    ipcRenderer.on('sync-language', listener);
    
    return () => {
      ipcRenderer.removeListener('sync-language', listener);
    };
  },
  
  // 获取主进程保存的语言
  requestLanguage: () => {
    ipcRenderer.send('request-language');
  },
  
  // 菜单事件监听
  onMenuEvent: (callback) => {
    const listener = (event, action) => {
      callback(action);
    };
    
    ipcRenderer.on('menu-event', listener);
    
    return () => {
      ipcRenderer.removeListener('menu-event', listener);
    };
  }
});

// 导出xtermJS对象
contextBridge.exposeInMainWorld('xtermJS', {
  // 创建终端元素
  createTerminalElement: (elementId, options = {}) => {
    try {
      // 导入xterm模块
      const { Terminal } = require('@xterm/xterm');
      const { FitAddon } = require('@xterm/addon-fit');
      
      // 创建终端实例
      const term = new Terminal(options);
      
      // 创建适配插件
      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      
      // 渲染到指定元素
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Element with id '${elementId}' not found`);
      }
      
      term.open(element);
      
      // 尝试调整大小
      try {
        fitAddon.fit();
      } catch (e) {
        console.error('Failed to fit terminal:', e);
      }
      
      // 返回包含终端、适配器的对象，并提供简化API
      return {
        id: elementId,
        term,
        fitAddon,
        
        // 简便方法
        write: (data) => term.write(data),
        onData: (callback) => term.onData(callback),
        clear: () => term.clear(),
        focus: () => term.focus(),
        fit: () => fitAddon.fit(),
        dispose: () => term.dispose()
      };
    } catch (error) {
      console.error('Failed to create terminal:', error);
      return null;
    }
  },
  
  // xterm版本信息
  version: '5.2.1'
}); 