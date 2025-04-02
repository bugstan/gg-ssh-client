/**
 * SSH客户端 - UI管理模块
 */

// UI管理器类
class UIManager {
  constructor() {
    // 获取DOM元素
    this.addConnectionBtn = document.getElementById('add-connection-btn');
    this.connectionModal = document.getElementById('connection-modal');
    this.closeModalBtn = document.getElementById('close-modal');
    this.connectionForm = document.getElementById('connection-form');
    this.saveConnectionBtn = document.getElementById('save-connection');
    this.cancelConnectionBtn = document.getElementById('cancel-connection');
    this.contextMenu = document.getElementById('context-menu');
    
    // 认证类型切换
    this.authType = document.getElementById('authType');
    this.passwordGroup = document.getElementById('password-group');
    this.privatekeyGroup = document.getElementById('privatekey-group');
    
    // 监听添加连接按钮
    this.addConnectionBtn.addEventListener('click', () => {
      this.showConnectionModal();
    });
    
    // 监听关闭按钮
    this.closeModalBtn.addEventListener('click', () => {
      this.hideConnectionModal();
    });
    
    // 监听取消按钮
    this.cancelConnectionBtn.addEventListener('click', () => {
      this.hideConnectionModal();
    });
    
    // 监听认证类型变化
    this.authType.addEventListener('change', () => {
      this.toggleAuthType();
    });
    
    // 监听点击空白区域关闭上下文菜单
    document.addEventListener('click', (event) => {
      if (this.contextMenu.style.display === 'block' && !this.contextMenu.contains(event.target)) {
        this.hideContextMenu();
      }
    });
    
    // 新建连接表单翻译
    if (window.languageManager) {
      window.languageManager.translateConnectionForm();
    }
    
    // 初始化UI状态
    this.initUI();
  }
  
  // 初始化UI
  initUI() {
    // 设置初始主题
    this.setTheme('dark');
    
    // 添加全局事件监听
    this.setupGlobalEventListeners();
  }
  
  // 设置全局事件监听
  setupGlobalEventListeners() {
    // 窗口大小调整事件
    window.addEventListener('resize', this.handleWindowResize.bind(this));
    
    // 按键事件
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }
  
  // 处理窗口大小调整
  handleWindowResize() {
    // 触发窗口大小改变事件，让终端等组件响应
    document.dispatchEvent(new CustomEvent('window-resize'));
  }
  
  // 处理按键事件
  handleKeyDown(event) {
    // ESC键 - 关闭模态框
    if (event.key === 'Escape') {
      const visibleModals = document.querySelectorAll('.modal[style*="display: flex"]');
      if (visibleModals.length > 0) {
        visibleModals.forEach(modal => {
          modal.style.display = 'none';
        });
        event.preventDefault();
      }
    }
  }
  
  // 设置主题
  setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
  }
  
  // 显示连接表单
  showConnectionModal(connection = null) {
    // 重置表单字段
    document.getElementById('name').value = '';
    document.getElementById('host').value = '';
    document.getElementById('port').value = '22';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('privateKey').value = '';
    document.getElementById('passphrase').value = '';
    document.getElementById('authType').value = 'password';
    
    // 默认显示密码认证
    this.passwordGroup.style.display = 'block';
    this.privatekeyGroup.style.display = 'none';
    
    // 设置标题为新建连接
    document.getElementById('modal-title').textContent = 
      window.languageManager ? window.languageManager.getText('new_connection') : '新建连接';
    
    // 如果传入了连接对象，则填充表单
    if (connection) {
      document.getElementById('name').value = connection.name;
      document.getElementById('host').value = connection.host;
      document.getElementById('port').value = connection.port;
      document.getElementById('username').value = connection.username;
      document.getElementById('authType').value = connection.authType;
      
      if (connection.authType === 'password') {
        document.getElementById('password').value = connection.password || '';
        this.passwordGroup.style.display = 'block';
        this.privatekeyGroup.style.display = 'none';
      } else {
        document.getElementById('privateKey').value = connection.privateKey || '';
        document.getElementById('passphrase').value = connection.passphrase || '';
        this.passwordGroup.style.display = 'none';
        this.privatekeyGroup.style.display = 'block';
      }
      
      // 设置标题为编辑连接
      document.getElementById('modal-title').textContent = 
        window.languageManager ? window.languageManager.getText('edit_connection') : '编辑连接';
    }
    
    // 重新翻译表单
    if (window.languageManager) {
      window.languageManager.translateConnectionForm();
    }
    
    // 显示模态框
    this.connectionModal.style.display = 'flex';
  }
  
  // 隐藏连接表单
  hideConnectionModal() {
    this.connectionModal.style.display = 'none';
  }
  
  // 切换认证类型
  toggleAuthType() {
    if (this.authType.value === 'password') {
      this.passwordGroup.style.display = 'block';
      this.privatekeyGroup.style.display = 'none';
    } else {
      this.passwordGroup.style.display = 'none';
      this.privatekeyGroup.style.display = 'block';
    }
  }
  
  // 显示上下文菜单
  showContextMenu(event, connectionId) {
    // 检查参数
    if (!event || !connectionId) {
      console.error('显示上下文菜单的参数无效', { event, connectionId });
      return;
    }
    
    console.log('UI管理器 - 显示上下文菜单, 连接ID:', connectionId);
    
    // 获取上下文菜单元素
    const contextMenu = document.getElementById('context-menu');
    if (!contextMenu) {
      console.error('找不到上下文菜单元素');
      return;
    }
    
    // 设置位置
    contextMenu.style.top = `${event.clientY}px`;
    contextMenu.style.left = `${event.clientX}px`;
    
    // 确保连接管理器可用
    if (!window.connectionManager) {
      console.error('连接管理器不可用，无法显示上下文菜单');
      return;
    }
    
    // 设置当前连接ID
    window.connectionManager.setContextMenuConnectionId(connectionId);
    
    // 显示上下文菜单
    contextMenu.style.display = 'block';
    
    // 阻止默认行为和冒泡
    event.preventDefault();
    event.stopPropagation();
    
    // 添加点击事件监听器以关闭菜单
    document.addEventListener('click', () => {
      contextMenu.style.display = 'none';
    }, { once: true });
  }
  
  // 隐藏上下文菜单
  hideContextMenu() {
    this.contextMenu.style.display = 'none';
  }
}

// 确保类在全局作用域中可用
window.UIManager = UIManager; 