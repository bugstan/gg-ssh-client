/**
 * 模态框组件 - 处理连接表单和模态框交互
 */
class ModalComponent {
  constructor(sidebarComponent, terminalComponent) {
    this.sidebarComponent = sidebarComponent;
    this.terminalComponent = terminalComponent;
    
    this.connectionModal = document.getElementById('connection-modal');
    this.closeModal = document.getElementById('close-modal');
    this.saveConnection = document.getElementById('save-connection');
    this.cancelConnection = document.getElementById('cancel-connection');
    this.authTypeSelect = document.getElementById('authType');
    this.passwordGroup = document.getElementById('password-group');
    this.privatekeyGroup = document.getElementById('privatekey-group');
    
    this.isEditing = false;
    this.editingConnection = null;
    
    this.setupEvents();
  }
  
  /**
   * 设置事件监听
   */
  setupEvents() {
    // 切换认证类型显示
    this.authTypeSelect.addEventListener('change', () => {
      if (this.authTypeSelect.value === 'password') {
        this.passwordGroup.style.display = 'block';
        this.privatekeyGroup.style.display = 'none';
      } else {
        this.passwordGroup.style.display = 'none';
        this.privatekeyGroup.style.display = 'block';
      }
    });
    
    // 关闭模态框
    this.closeModal.addEventListener('click', () => {
      this.connectionModal.style.display = 'none';
    });
    
    this.cancelConnection.addEventListener('click', () => {
      this.connectionModal.style.display = 'none';
    });
    
    // 保存连接
    this.saveConnection.addEventListener('click', () => {
      this.saveConnectionData();
    });
    
    // 监听显示连接模态框事件
    document.addEventListener('show-connection-modal', () => {
      this.showNewConnectionModal();
    });
    
    // 监听编辑连接事件
    document.addEventListener('edit-connection', (event) => {
      const connection = event.detail;
      this.showEditConnectionModal(connection);
    });
  }
  
  /**
   * 显示新建连接模态框
   */
  showNewConnectionModal() {
    // 重置表单
    document.getElementById('name').value = '';
    document.getElementById('host').value = '';
    document.getElementById('port').value = '22';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('privateKey').value = '';
    document.getElementById('passphrase').value = '';
    this.authTypeSelect.value = 'password';
    this.passwordGroup.style.display = 'block';
    this.privatekeyGroup.style.display = 'none';
    
    // 设置为新建模式
    this.isEditing = false;
    this.editingConnection = null;
    document.getElementById('modal-title').textContent = '新建连接';
    
    // 显示模态框
    this.connectionModal.style.display = 'flex';
  }
  
  /**
   * 显示编辑连接模态框
   * @param {Object} connection - 连接对象
   */
  showEditConnectionModal(connection) {
    // 填充表单
    document.getElementById('name').value = connection.name;
    document.getElementById('host').value = connection.host;
    document.getElementById('port').value = connection.port;
    document.getElementById('username').value = connection.username;
    document.getElementById('authType').value = connection.authType;
    document.getElementById('password').value = connection.password || '';
    document.getElementById('privateKey').value = connection.privateKey || '';
    document.getElementById('passphrase').value = connection.passphrase || '';
    
    // 显示/隐藏认证字段
    if (connection.authType === 'password') {
      this.passwordGroup.style.display = 'block';
      this.privatekeyGroup.style.display = 'none';
    } else {
      this.passwordGroup.style.display = 'none';
      this.privatekeyGroup.style.display = 'block';
    }
    
    // 设置为编辑模式
    this.isEditing = true;
    this.editingConnection = connection;
    document.getElementById('modal-title').textContent = '编辑连接';
    
    // 显示模态框
    this.connectionModal.style.display = 'flex';
  }
  
  /**
   * 保存连接数据
   */
  saveConnectionData() {
    // 获取表单数据
    const name = document.getElementById('name').value;
    const host = document.getElementById('host').value;
    const port = parseInt(document.getElementById('port').value, 10);
    const username = document.getElementById('username').value;
    const authType = this.authTypeSelect.value;
    const password = document.getElementById('password').value;
    const privateKey = document.getElementById('privateKey').value;
    const passphrase = document.getElementById('passphrase').value;
    
    // 验证必填字段
    if (!name || !host || !port || !username || 
        (authType === 'password' && !password) || 
        (authType === 'privateKey' && !privateKey)) {
      alert('请填写所有必填字段');
      return;
    }
    
    // 创建连接对象
    const connection = {
      name,
      host,
      port,
      username,
      authType,
      password: authType === 'password' ? password : '',
      privateKey: authType === 'privateKey' ? privateKey : '',
      passphrase: authType === 'privateKey' ? passphrase : ''
    };
    
    // 保存到本地存储
    if (window.electron) {
      window.electron.saveConnection(connection);
    } else {
      // 模拟保存行为（当electron API不可用时）
      if (this.isEditing && this.editingConnection) {
        const index = this.sidebarComponent.connections.findIndex(c => c.name === this.editingConnection.name);
        if (index >= 0) {
          this.sidebarComponent.connections[index] = connection;
        }
      } else {
        this.sidebarComponent.connections.push(connection);
      }
      this.sidebarComponent.renderConnectionList();
    }
    
    // 关闭模态框
    this.connectionModal.style.display = 'none';
  }
}

module.exports = ModalComponent;