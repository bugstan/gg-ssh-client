/**
 * 侧边栏组件 - 管理连接列表和侧边栏交互
 */
class SidebarComponent {
  constructor() {
    this.connections = [];
    this.currentConnectionForContext = null;
    
    // 获取DOM元素
    this.connectionList = document.getElementById('connection-list');
    this.toggleSidebar = document.getElementById('toggle-sidebar');
    this.addConnectionBtn = document.getElementById('add-connection-btn');
    this.contextMenu = document.getElementById('context-menu');
    this.editConnection = document.getElementById('edit-connection');
    this.duplicateConnection = document.getElementById('duplicate-connection');
    this.deleteConnection = document.getElementById('delete-connection');
    
    // 初始化事件
    this.setupEvents();
  }
  
  /**
   * 设置事件监听
   */
  setupEvents() {
    // 切换侧边栏
    this.toggleSidebar.addEventListener('click', () => {
      const sidebar = document.querySelector('.sidebar');
      sidebar.classList.toggle('collapsed');
      this.toggleSidebar.textContent = sidebar.classList.contains('collapsed') ? '»' : '«';
    });
    
    // 点击body时隐藏上下文菜单
    document.body.addEventListener('click', () => {
      this.contextMenu.style.display = 'none';
    });
    
    // 添加连接按钮点击事件
    this.addConnectionBtn.addEventListener('click', () => {
      // 触发显示连接模态框事件
      document.dispatchEvent(new CustomEvent('show-connection-modal'));
    });
    
    // 编辑连接
    this.editConnection.addEventListener('click', () => {
      if (!this.currentConnectionForContext) return;
      
      // 触发编辑连接事件
      document.dispatchEvent(new CustomEvent('edit-connection', {
        detail: this.currentConnectionForContext
      }));
      
      this.contextMenu.style.display = 'none';
    });
    
    // 复制连接
    this.duplicateConnection.addEventListener('click', () => {
      if (!this.currentConnectionForContext) return;
      
      const duplicate = {...this.currentConnectionForContext};
      duplicate.name = `${duplicate.name} (复制)`;
      
      if (window.electron) {
        window.electron.saveConnection(duplicate);
      } else {
        this.connections.push(duplicate);
        this.renderConnectionList();
      }
      
      this.contextMenu.style.display = 'none';
    });
    
    // 删除连接
    this.deleteConnection.addEventListener('click', () => {
      if (!this.currentConnectionForContext) return;
      
      if (confirm(`确定要删除连接 "${this.currentConnectionForContext.name}" 吗？`)) {
        if (window.electron) {
          window.electron.deleteConnection(this.currentConnectionForContext.name);
        } else {
          this.connections = this.connections.filter(c => c.name !== this.currentConnectionForContext.name);
          this.renderConnectionList();
        }
      }
      
      this.contextMenu.style.display = 'none';
    });
  }
  
  /**
   * 加载连接列表
   */
  loadConnections() {
    if (window.electron) {
      window.electron.getConnections();
      window.electron.on('connections-loaded', (loadedConnections) => {
        this.connections = loadedConnections;
        this.renderConnectionList();
      });
      
      // 监听保存连接后的事件
      window.electron.on('connection-saved', (savedConnections) => {
        this.connections = savedConnections;
        this.renderConnectionList();
      });
      
      // 监听删除连接后的事件
      window.electron.on('connection-deleted', (remainingConnections) => {
        this.connections = remainingConnections;
        this.renderConnectionList();
      });
    }
  }
  
  /**
   * 渲染连接列表
   */
  renderConnectionList() {
    this.connectionList.innerHTML = '';
    this.connections.forEach((conn) => {
      const item = document.createElement('div');
      item.className = 'connection-item';
      
      // 添加连接图标
      const icon = document.createElement('span');
      icon.className = 'icon';
      icon.textContent = '🖥️';
      icon.style.marginRight = '8px';
      item.appendChild(icon);
      
      // 添加连接名称文本
      const text = document.createElement('span');
      text.textContent = `${conn.name} (${conn.host})`;
      item.appendChild(text);
      
      // 设置工具提示，在收起时显示连接名称
      item.title = `${conn.name} (${conn.host})`;
      
      // 点击连接到服务器
      item.addEventListener('click', () => {
        // 触发连接到服务器事件
        document.dispatchEvent(new CustomEvent('connect-to-server', {
          detail: conn
        }));
      });
      
      // 右键显示上下文菜单
      item.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        this.showContextMenu(event, conn);
      });
      
      this.connectionList.appendChild(item);
    });
  }
  
  /**
   * 显示上下文菜单
   * @param {Event} event - 事件对象
   * @param {Object} conn - 连接对象
   */
  showContextMenu(event, conn) {
    this.contextMenu.style.top = `${event.clientY}px`;
    this.contextMenu.style.left = `${event.clientX}px`;
    this.contextMenu.style.display = 'block';
    this.currentConnectionForContext = conn;
    
    // 阻止冒泡，避免立即隐藏菜单
    event.stopPropagation();
  }
  
  /**
   * 导出连接
   */
  exportConnections() {
    if (window.electron) {
      window.electron.exportConnections(this.connections);
    }
  }
  
  /**
   * 导入连接
   * @param {Array} connections - 连接数组
   */
  importConnections(connections) {
    if (Array.isArray(connections)) {
      connections.forEach(conn => {
        if (window.electron) {
          window.electron.saveConnection(conn);
        }
      });
    }
  }
}

module.exports = SidebarComponent; 