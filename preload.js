const { ipcRenderer, contextBridge } = require('electron');

// 添加简单的消息通道，用于在主进程中创建和管理终端
let uniqueId = 1;

// 暴露安全的API给渲染进程
contextBridge.exposeInMainWorld('xtermJS', {
  // 版本信息
  version: '5.5.0',
  
  // 只暴露必要的 API
  createTerminalElement: (containerId, options) => {
    try {
      const { Terminal } = require('@xterm/xterm');
      const { FitAddon } = require('@xterm/addon-fit');
      const { WebLinksAddon } = require('@xterm/addon-web-links');
      
      // 创建终端
      const term = new Terminal(options);
      
      // 创建插件
      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      
      const webLinksAddon = new WebLinksAddon();
      term.loadAddon(webLinksAddon);
      
      // 找到容器元素并打开终端
      const container = document.getElementById(containerId);
      if (!container) {
        throw new Error(`Terminal container not found: ${containerId}`);
      }
      
      term.open(container);
      
      // 创建唯一 ID
      const id = `terminal_${Date.now()}_${uniqueId++}`;
      
      // 创建对象引用
      const reference = { id, term, fitAddon };
      
      // 返回安全包装器
      return {
        id,
        write: (data) => term.write(data),
        onData: (callback) => term.onData(callback),
        fit: () => fitAddon.fit(),
        dispose: () => {
          try {
            term.dispose();
          } catch (e) {
            console.error('Terminal dispose error:', e);
          }
        }
      };
    } catch (error) {
      console.error('Failed to create terminal:', error);
      throw error;
    }
  }
});

// 暴露安全的API给渲染进程
contextBridge.exposeInMainWorld('electron', {
  // 连接管理
  saveConnection: (connection) => {
    ipcRenderer.send('save-connection', connection);
  },
  
  getConnections: () => {
    ipcRenderer.send('get-connections');
  },
  
  deleteConnection: (name) => {
    ipcRenderer.send('delete-connection', name);
  },
  
  // 设置管理
  saveSettings: (settings) => {
    ipcRenderer.send('save-settings', settings);
  },
  
  getSettings: () => {
    ipcRenderer.send('get-settings');
  },
  
  // 导入导出
  exportConnections: (connections) => {
    ipcRenderer.send('export-connections', connections);
  },
  
  // SSH操作
  connectSSH: (config) => {
    return ipcRenderer.invoke('ssh-connect', config);
  },
  
  disconnectSSH: (connectionId) => {
    return ipcRenderer.invoke('ssh-disconnect', connectionId);
  },
  
  sendSSHData: (connectionId, data) => {
    ipcRenderer.send('ssh-send-data', { connectionId, data });
  },
  
  onSSHData: (connectionId, callback) => {
    const channel = `ssh-data-${connectionId}`;
    const listener = (_, data) => callback(data);
    ipcRenderer.on(channel, listener);
    
    return () => {
      ipcRenderer.removeListener(channel, listener);
    };
  },
  
  // 事件监听器
  on: (channel, callback) => {
    // 白名单通道
    const validChannels = [
      'connection-saved', 
      'connections-loaded', 
      'connection-deleted',
      'settings-saved',
      'settings-loaded',
      'export-connections-success',
      'export-connections-error',
      'window-resize',
      'menu-new-connection',
      'menu-clear-terminal',
      'menu-disconnect',
      'menu-font-size-increase',
      'menu-font-size-decrease',
      'menu-font-size-reset',
      'menu-export-connections',
      'import-connections'
    ];
    
    if (validChannels.includes(channel)) {
      // 使用一个自定义的监听器，这样我们就可以在必要时移除它
      const listener = (_, ...args) => callback(...args);
      ipcRenderer.on(channel, listener);
      
      // 返回一个移除监听器的函数
      return () => {
        ipcRenderer.removeListener(channel, listener);
      };
    }
  },
  
  // 移除事件监听器
  removeListener: (channel, removeCallback) => {
    if (removeCallback && typeof removeCallback === 'function') {
      removeCallback();
    }
  }
});
