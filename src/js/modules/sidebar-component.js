/**
 * SSH客户端 - 侧边栏组件
 */

// 侧边栏组件
class SidebarComponent {
  constructor() {
    // 获取DOM元素
    this.sidebar = document.querySelector('.sidebar');
    this.connectionList = document.getElementById('connection-list');
    this.toggleSidebarBtn = document.getElementById('toggle-sidebar');
    this.addConnectionBtn = document.getElementById('add-connection-btn');
    
    // 初始化事件监听
    this.initEventListeners();
    
    // 侧边栏展开状态
    this.isSidebarExpanded = true;
    
    // 确保连接管理器存在
    this.connectionManager = window.connectionManager;
    
    console.log('侧边栏组件已初始化', this.connectionManager ? '连接管理器已加载' : '连接管理器未加载');
  }
  
  // 初始化事件监听
  initEventListeners() {
    // 侧边栏切换按钮
    this.toggleSidebarBtn.addEventListener('click', () => {
      this.toggleSidebar();
    });
    
    // 监听连接更新事件
    document.addEventListener('connections-updated', (event) => {
      this.loadConnections();
    });
    
    // 翻译侧边栏
    document.addEventListener('language-changed', () => {
      this.translateSidebar();
    });
    
    // 当DOM完全加载后再次尝试加载连接列表
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        this.loadConnections();
      }, 500);
    });
    
    // 监听连接管理器初始化完成事件
    document.addEventListener('connection-manager-ready', () => {
      console.log('连接管理器准备就绪，正在加载连接列表');
      this.connectionManager = window.connectionManager;
      this.loadConnections();
    });
  }
  
  // 翻译侧边栏
  translateSidebar() {
    if (window.languageManager) {
      const langManager = window.languageManager;
      
      // 翻译标题
      const headerTitle = this.sidebar.querySelector('.sidebar-header h3');
      if (headerTitle) {
        langManager.registerElement(headerTitle, 'connection_management');
      }
      
      // 翻译按钮
      const addBtnText = this.addConnectionBtn.querySelector('.btn-text');
      if (addBtnText) {
        langManager.registerElement(addBtnText, 'add_connection');
      }
      
      // 翻译设置按钮
      const settingsBtn = document.getElementById('settings-btn');
      if (settingsBtn) {
        const settingsBtnText = settingsBtn.querySelector('.btn-text');
        if (settingsBtnText) {
          langManager.registerElement(settingsBtnText, 'settings');
        }
      }
    }
  }
  
  // 切换侧边栏
  toggleSidebar() {
    if (this.isSidebarExpanded) {
      this.sidebar.classList.add('collapsed');
      this.toggleSidebarBtn.textContent = '»';
    } else {
      this.sidebar.classList.remove('collapsed');
      this.toggleSidebarBtn.textContent = '«';
    }
    
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }
  
  // 加载连接列表
  loadConnections() {
    // 清空连接列表
    this.connectionList.innerHTML = '';
    
    // 检查连接管理器是否可用
    if (!this.connectionManager && window.connectionManager) {
      this.connectionManager = window.connectionManager;
    }
    
    // 再次检查连接管理器
    if (!this.connectionManager) {
      console.error('连接管理器未初始化');
      // 添加错误消息到列表中
      const errorItem = document.createElement('div');
      errorItem.className = 'connection-item error-item';
      errorItem.textContent = '连接管理器未初始化';
      this.connectionList.appendChild(errorItem);
      return;
    }
    
    try {
      // 获取所有连接
      const connections = this.connectionManager.getConnections();
      
      // 检查连接数组
      if (!connections || connections.length === 0) {
        console.log('没有可用的连接');
        const emptyItem = document.createElement('div');
        emptyItem.className = 'connection-item empty-item';
        emptyItem.textContent = '没有保存的连接';
        this.connectionList.appendChild(emptyItem);
        return;
      }
      
      console.log('加载连接列表:', connections.length, '个连接');
      
      // 渲染连接列表
      this.renderConnectionList();
    } catch (error) {
      console.error('加载连接列表失败:', error);
      const errorItem = document.createElement('div');
      errorItem.className = 'connection-item error-item';
      errorItem.textContent = `加载失败: ${error.message}`;
      this.connectionList.appendChild(errorItem);
    }
  }
  
  // 渲染连接列表
  renderConnectionList() {
    // 清空列表
    this.connectionList.innerHTML = '';
    
    // 获取连接列表
    const connections = this.connectionManager.getConnections();
    
    // 如果连接列表为空，显示空状态
    if (connections.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'empty-connection-list';
      
      // 设置空状态文本，如果可以使用多语言
      if (window.languageManager) {
        emptyState.textContent = window.languageManager.getText('no_connections');
      } else {
        emptyState.textContent = '没有保存的连接';
      }
      
      this.connectionList.appendChild(emptyState);
      return;
    }
    
    // 渲染每个连接
    connections.forEach(connection => {
      const item = this.renderConnectionItem(connection);
      this.connectionList.appendChild(item);
    });
    
    console.log(`渲染了 ${connections.length} 个连接`);
  }
  
  // 渲染单个连接项
  renderConnectionItem(connection) {
    const item = document.createElement('div');
    item.className = 'connection-item';
    item.setAttribute('data-connection-id', connection.id);
    
    // 创建左侧区域（图标和名称）
    const leftSection = document.createElement('div');
    leftSection.className = 'connection-left';
    
    // 小电脑图标 (左侧)
    const computerIcon = document.createElement('div');
    computerIcon.className = 'connection-computer-icon';
    computerIcon.innerHTML = '🖥️';
    leftSection.appendChild(computerIcon);
    
    // 连接名称 - 仅显示名称，不包含主机信息
    const name = document.createElement('div');
    name.className = 'connection-name';
    name.textContent = connection.name || '未命名连接';
    leftSection.appendChild(name);
    
    // 创建右侧箭头图标作为连接按钮
    const arrowIcon = document.createElement('div');
    arrowIcon.className = 'connection-arrow-icon';
    arrowIcon.innerHTML = '➤';
    arrowIcon.title = '连接';
    
    // 添加元素到连接项
    item.appendChild(leftSection);
    item.appendChild(arrowIcon);
    
    // 点击箭头连接到服务器
    arrowIcon.addEventListener('click', (event) => {
      console.log('点击连接按钮:', connection.name);
      
      // 触发连接到服务器事件
      const connectEvent = new CustomEvent('connect-to-server', { detail: connection });
      document.dispatchEvent(connectEvent);
      
      // 阻止事件冒泡
      event.stopPropagation();
    });
    
    // 点击连接项连接到服务器
    item.addEventListener('click', () => {
      console.log('点击连接项:', connection.name);
      
      // 触发连接到服务器事件
      const connectEvent = new CustomEvent('connect-to-server', { detail: connection });
      document.dispatchEvent(connectEvent);
    });
    
    // 右键显示上下文菜单
    item.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      
      console.log('显示连接上下文菜单:', connection.id);
      
      // 使用UI管理器显示上下文菜单
      if (window.uiManager) {
        window.uiManager.showContextMenu(event, connection.id);
      } else {
        // 兼容直接调用连接管理器的方法
        if (window.connectionManager) {
          window.connectionManager.setContextMenuConnectionId(connection.id);
          window.connectionManager.showContextMenu(event, connection);
        } else {
          console.error('无法显示上下文菜单: 未找到UI管理器或连接管理器');
        }
      }
    });
    
    return item;
  }
}

// 确保类在全局作用域中可用
window.SidebarComponent = SidebarComponent; 