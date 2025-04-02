/**
 * 终端组件 - 管理终端实例和SSH连接
 */
class TerminalComponent {
  constructor(tabsComponent) {
    this.tabsComponent = tabsComponent;
    this.terminals = []; // 终端实例数组
    this.sshClients = []; // SSH客户端数组
    
    // 监听标签页关闭事件
    document.addEventListener('tab-closed', (event) => {
      const { index } = event.detail;
      this.cleanupTerminal(index);
    });
    
    // 监听标签页切换事件
    document.addEventListener('tab-switched', (event) => {
      const { index } = event.detail;
      this.resizeTerminal(index);
    });
    
    // 监听连接到服务器事件
    document.addEventListener('connect-to-server', (event) => {
      const connection = event.detail;
      this.connectToServer(connection);
    });
  }
  
  /**
   * 连接到服务器
   * @param {Object} connection - 连接信息
   */
  connectToServer(connection) {
    // 创建新标签页
    const tabIndex = this.tabsComponent.addTab(connection.name);
    
    // 切换到新标签页
    this.tabsComponent.switchTab(tabIndex);
    
    // 创建终端
    setTimeout(() => {
      this.createTerminal(tabIndex, connection);
    }, 100);
  }
  
  /**
   * 创建终端实例
   * @param {number} index - 标签页索引
   * @param {Object} connection - 连接信息
   */
  async createTerminal(index, connection) {
    try {
      console.log('开始创建终端...');
      
      // 检查模块是否可用
      if (!window.xtermJS || !window.xtermJS.createTerminalElement) {
        console.error('xtermJS 对象不存在或不完整');
        throw new Error('终端组件未加载');
      }
      
      console.log('xtermJS version:', window.xtermJS.version);
      
      // 终端元素 ID
      const terminalElementId = `terminal-${index}`;
      
      // 创建终端实例
      const term = window.xtermJS.createTerminalElement(terminalElementId, {
        cursorBlink: true,
        fontSize: 14,
        fontFamily: 'Menlo, Monaco, Courier New, monospace',
        theme: {
          background: '#1e1e1e',
          foreground: '#f0f0f0'
        },
        scrollback: 1000,
        allowProposedApi: true
      });
      
      console.log('终端创建成功:', term.id);
      
      // 调整终端大小
      try {
        console.log('调整终端大小...');
        term.fit();
        
        // 监听容器大小变化
        const terminalElement = document.getElementById(terminalElementId);
        const resizeObserver = new ResizeObserver(() => {
          try {
            term.fit();
          } catch (e) {
            console.error('自动调整终端大小失败:', e);
          }
        });
        
        resizeObserver.observe(terminalElement);
      } catch (e) {
        console.error('初始调整终端大小失败:', e);
      }
      
      // 保存终端实例
      this.terminals[index] = { term };
      
      // 显示连接信息
      term.write(`正在连接到 ${connection.host}:${connection.port}...\r\n`);
      
      try {
        // 连接到SSH服务器
        const result = await window.electron.connectSSH(connection);
        console.log('SSH连接结果:', result);
        
        // 设置终端输入事件
        term.onData((data) => {
          window.electron.sendSSHData(result.id, data);
        });
        
        // 监听SSH数据
        window.electron.onSSHData(result.id, (data) => {
          term.write(data);
        });
        
        // 保存SSH客户端ID
        this.sshClients[index] = {
          id: result.id,
          dispose: async () => {
            try {
              await window.electron.disconnectSSH(result.id);
              console.log('已断开连接');
            } catch (e) {
              console.error('断开连接失败:', e);
            }
          }
        };
        
      } catch (error) {
        console.error('SSH连接失败:', error);
        term.write(`\r\n\x1b[31m连接失败: ${error.message}\x1b[0m\r\n`);
      }
      
    } catch (error) {
      console.error('创建终端时出错:', error);
      alert(`创建终端失败: ${error.message}`);
    }
  }
  
  /**
   * 清理终端资源
   * @param {number} index - 标签页索引
   */
  cleanupTerminal(index) {
    // 关闭SSH连接
    if (this.sshClients[index]) {
      try {
        if (this.sshClients[index].dispose) {
          this.sshClients[index].dispose();
        }
      } catch (e) {
        console.error('关闭SSH连接失败:', e);
      }
    }
    
    // 销毁终端
    if (this.terminals[index] && this.terminals[index].term) {
      try {
        this.terminals[index].term.dispose();
      } catch (e) {
        console.error('销毁终端失败:', e);
      }
    }
    
    // 更新数组
    this.terminals.splice(index, 1);
    this.sshClients.splice(index, 1);
  }
  
  /**
   * 调整终端大小
   * @param {number} index - 标签页索引
   */
  resizeTerminal(index) {
    if (index >= 0 && this.terminals[index] && this.terminals[index].term) {
      try {
        // 延迟调用以确保DOM已更新
        setTimeout(() => {
          this.terminals[index].term.fit();
        }, 0);
      } catch (e) {
        console.error('调整终端大小失败:', e);
      }
    }
  }
  
  /**
   * 调整当前活动终端大小
   */
  resizeActiveTerminal() {
    const activeTab = this.tabsComponent.getActiveTab();
    this.resizeTerminal(activeTab);
  }
  
  /**
   * 清空当前活动终端
   */
  clearActiveTerminal() {
    const activeTab = this.tabsComponent.getActiveTab();
    if (activeTab >= 0 && this.terminals[activeTab] && this.terminals[activeTab].term) {
      this.terminals[activeTab].term.clear();
    }
  }
  
  /**
   * 断开当前活动终端连接
   */
  disconnectActiveTerminal() {
    const activeTab = this.tabsComponent.getActiveTab();
    if (activeTab >= 0 && this.sshClients[activeTab]) {
      this.sshClients[activeTab].dispose();
    }
  }
  
  /**
   * 增大字体大小
   */
  increaseFontSize() {
    const activeTab = this.tabsComponent.getActiveTab();
    if (activeTab >= 0 && this.terminals[activeTab] && this.terminals[activeTab].term) {
      // 这里需要适配xterm.js的API
      // 由于我们使用的是安全包装器，无法直接修改fontSize
      // 可以通过IPC发送消息到主进程，然后由主进程更新设置
      if (window.electron) {
        const settings = window.electron.getSettings();
        settings.fontSize = Math.min(settings.fontSize + 1, 32);
        window.electron.saveSettings(settings);
      }
    }
  }
  
  /**
   * 减小字体大小
   */
  decreaseFontSize() {
    const activeTab = this.tabsComponent.getActiveTab();
    if (activeTab >= 0 && this.terminals[activeTab] && this.terminals[activeTab].term) {
      if (window.electron) {
        const settings = window.electron.getSettings();
        settings.fontSize = Math.max(settings.fontSize - 1, 8);
        window.electron.saveSettings(settings);
      }
    }
  }
  
  /**
   * 重置字体大小
   */
  resetFontSize() {
    const activeTab = this.tabsComponent.getActiveTab();
    if (activeTab >= 0 && this.terminals[activeTab] && this.terminals[activeTab].term) {
      if (window.electron) {
        const settings = window.electron.getSettings();
        settings.fontSize = 14; // 默认大小
        window.electron.saveSettings(settings);
      }
    }
  }
}

module.exports = TerminalComponent; 