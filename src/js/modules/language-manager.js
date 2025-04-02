/**
 * SSH客户端 - 语言管理模块
 */

// 语言定义
const languages = {
  'zh-CN': {
    // 通用
    'app_name': 'SSH客户端',
    'save': '保存',
    'cancel': '取消',
    'edit': '修改',
    'connect': '连接',
    'delete': '删除',
    'duplicate': '复制',
    'settings': '设置',
    'confirm': '确认',
    
    // 侧边栏
    'connection_management': '连接管理',
    'add_connection': '添加连接',
    'confirm_delete': '确定要删除连接 "{name}" 吗？',
    
    // 连接表单
    'new_connection': '新建连接',
    'edit_connection': '编辑连接',
    'name': '名称',
    'host': '主机',
    'port': '端口',
    'username': '用户名',
    'auth_type': '认证类型',
    'password': '密码',
    'private_key': '私钥路径',
    'passphrase': '密码短语 (可选)',
    'connection_copy': '{name} (复制)',
    
    // 标签页
    'close': '关闭',
    
    // 设置
    'language': '语言',
    'language_zh': '简体中文',
    'language_en': 'English',
    'theme': '主题',
    'theme_dark': '暗色',
    'theme_light': '亮色',
    'font_size': '字体大小',
    'font_family': '字体',
    'terminal': '终端设置',
    'appearance': '外观设置',
    
    // 消息
    'connection_failed': '连接失败: {message}',
    'fill_required': '请填写所有必填字段',
    'init_failed': '初始化失败: {message}'
  },
  'en-US': {
    // General
    'app_name': 'SSH Client',
    'save': 'Save',
    'cancel': 'Cancel',
    'edit': 'Edit',
    'connect': 'Connect',
    'delete': 'Delete',
    'duplicate': 'Duplicate',
    'settings': 'Settings',
    'confirm': 'Confirm',
    
    // Sidebar
    'connection_management': 'Connection Management',
    'add_connection': 'Add Connection',
    'confirm_delete': 'Are you sure you want to delete connection "{name}"?',
    
    // Connection Form
    'new_connection': 'New Connection',
    'edit_connection': 'Edit Connection',
    'name': 'Name',
    'host': 'Host',
    'port': 'Port',
    'username': 'Username',
    'auth_type': 'Authentication Type',
    'password': 'Password',
    'private_key': 'Private Key Path',
    'passphrase': 'Passphrase (Optional)',
    'connection_copy': '{name} (Copy)',
    
    // Tabs
    'close': 'Close',
    
    // Settings
    'language': 'Language',
    'language_zh': 'Simplified Chinese',
    'language_en': 'English',
    'theme': 'Theme',
    'theme_dark': 'Dark',
    'theme_light': 'Light',
    'font_size': 'Font Size',
    'font_family': 'Font Family',
    'terminal': 'Terminal Settings',
    'appearance': 'Appearance',
    
    // Messages
    'connection_failed': 'Connection failed: {message}',
    'fill_required': 'Please fill in all required fields',
    'init_failed': 'Initialization failed: {message}'
  }
};

// 语言管理器类
class LanguageManager {
  constructor() {
    console.log('初始化语言管理器');
    
    // 检查是否有待应用的语言设置
    const pendingLanguage = localStorage.getItem('pendingLanguage');
    if (pendingLanguage) {
      console.log('发现待应用的语言设置:', pendingLanguage);
      // 应用待处理的语言设置
      localStorage.setItem('language', pendingLanguage);
      // 清除待处理标志
      localStorage.removeItem('pendingLanguage');
      console.log('已应用待处理的语言设置，并清除pendingLanguage');
    }
    
    // 默认语言
    this.currentLanguage = localStorage.getItem('language') || 'zh-CN';
    console.log('当前语言设置:', this.currentLanguage);
    
    // 存储所有需要更新的元素
    this.translatedElements = [];
    this.languageChangeCallbacks = [];
    
    // 初始化语言
    this.initLanguage();
  }
  
  // 初始化语言设置
  initLanguage() {
    // 设置文档语言
    document.documentElement.setAttribute('lang', this.currentLanguage);
    
    // 初始翻译整个应用界面
    this.translateAppUI();
    
    // 发布语言变更事件
    this.publishLanguageChange();
  }
  
  // 翻译整个应用程序界面
  translateAppUI() {
    // 应用标题
    document.title = this.getText('app_name');
    
    // 翻译侧边栏
    this.registerElement(
      document.querySelector('.sidebar-header h3'),
      'connection_management'
    );
    
    this.registerElement(
      document.querySelector('#add-connection-btn .btn-text'),
      'add_connection'
    );
    
    // 翻译连接表单
    this.translateConnectionForm();
    
    // 翻译上下文菜单
    this.registerElement(document.getElementById('edit-connection'), 'edit');
    this.registerElement(document.getElementById('duplicate-connection'), 'duplicate');
    this.registerElement(document.getElementById('delete-connection'), 'delete');
    
    // 翻译设置按钮
    const settingsBtn = document.querySelector('#settings-btn .btn-text');
    if (settingsBtn) {
      this.registerElement(settingsBtn, 'settings');
    }
  }
  
  // 获取翻译文本
  getText(key, replacements = {}) {
    const languageData = languages[this.currentLanguage] || languages['zh-CN'];
    let text = languageData[key] || key;
    
    // 替换参数
    Object.keys(replacements).forEach(param => {
      text = text.replace(`{${param}}`, replacements[param]);
    });
    
    return text;
  }
  
  /**
   * 设置当前语言
   * @param {string} language 语言代码
   * @param {boolean} notifyMainProcess 是否通知主进程
   */
  setLanguage(language, notifyMainProcess = true) {
    try {
      console.log(`设置语言: ${language}, 通知主进程: ${notifyMainProcess}`);
      
      // 检查语言代码是否有效
      if (!languages[language]) {
        console.warn(`未找到语言: ${language}, 使用默认语言: zh-CN`);
        language = 'zh-CN';
      }
      
      // 更新当前语言
      this.currentLanguage = language;
      
      // 保存到本地存储
      localStorage.setItem('language', language);
      
      // 通知主进程更新菜单
      if (notifyMainProcess && window.electron && window.electron.setLanguage) {
        window.electron.setLanguage(language);
      }
      
      // 触发语言变更事件
      document.dispatchEvent(new CustomEvent('language-changed', {
        detail: { language }
      }));
      
      // 更新所有注册的元素
      this.updateAllElements();
      
      console.log(`语言已设置为: ${language}`);
      return true;
    } catch (error) {
      console.error('设置语言失败:', error);
      return false;
    }
  }
  
  // 获取当前语言
  getCurrentLanguage() {
    return this.currentLanguage;
  }
  
  // 获取所有支持的语言
  getSupportedLanguages() {
    return Object.keys(languages).map(code => ({
      code,
      name: this.getText(`language_${code.split('-')[0].toLowerCase()}`)
    }));
  }
  
  // 注册元素进行翻译
  registerElement(element, textKey, attribute = 'textContent', replacements = {}) {
    if (!element) {
      console.warn(`尝试注册不存在的元素用于文本键 "${textKey}"`);
      return this;
    }
    
    this.translatedElements.push({
      element,
      textKey,
      attribute,
      replacements
    });
    
    // 立即翻译
    this.translateElement(element, textKey, attribute, replacements);
    
    return this;
  }
  
  // 注册语言变更回调
  onLanguageChange(callback) {
    if (typeof callback === 'function') {
      this.languageChangeCallbacks.push(callback);
    }
    return this;
  }
  
  // 发布语言变更事件
  publishLanguageChange() {
    // 更新所有已注册的元素
    this.translatedElements.forEach(item => {
      this.translateElement(item.element, item.textKey, item.attribute, item.replacements);
    });
    
    // 调用所有已注册的回调
    this.languageChangeCallbacks.forEach(callback => {
      try {
        callback(this.currentLanguage);
      } catch (error) {
        console.error('Language change callback error:', error);
      }
    });
    
    // 触发自定义事件，方便其他组件监听
    document.dispatchEvent(new CustomEvent('language-changed', {
      detail: { language: this.currentLanguage }
    }));
  }
  
  // 翻译单个元素
  translateElement(element, textKey, attribute = 'textContent', replacements = {}) {
    if (element && textKey) {
      const translatedText = this.getText(textKey, replacements);
      
      if (attribute === 'textContent') {
        element.textContent = translatedText;
      } else if (attribute === 'innerHTML') {
        element.innerHTML = translatedText;
      } else {
        element.setAttribute(attribute, translatedText);
      }
    }
  }
  
  // 翻译连接表单
  translateConnectionForm() {
    const elements = [
      { id: 'modal-title', key: 'new_connection' },
      { id: 'name-label', key: 'name' },
      { id: 'host-label', key: 'host' },
      { id: 'port-label', key: 'port' },
      { id: 'username-label', key: 'username' },
      { id: 'auth-type-label', key: 'auth_type' },
      { id: 'password-label', key: 'password' },
      { id: 'privatekey-label', key: 'private_key' },
      { id: 'passphrase-label', key: 'passphrase' },
      { id: 'save-connection', key: 'save' },
      { id: 'cancel-connection', key: 'cancel' }
    ];
    
    elements.forEach(item => {
      const element = document.getElementById(item.id);
      if (element) {
        this.registerElement(element, item.key);
      } else {
        console.warn(`连接表单元素未找到: ${item.id}`);
      }
    });

    // 翻译下拉菜单选项
    const authTypeSelect = document.getElementById('authType');
    if (authTypeSelect) {
      Array.from(authTypeSelect.options).forEach(option => {
        if (option.value === 'password') {
          option.textContent = this.getText('password');
        } else if (option.value === 'privateKey') {
          option.textContent = this.getText('private_key');
        }
      });
    }
  }
  
  // 更新所有已注册的元素
  updateAllElements() {
    try {
      console.log('更新所有已翻译的元素');
      
      // 更新所有已注册的元素
      this.translatedElements.forEach(item => {
        this.translateElement(item.element, item.textKey, item.attribute, item.replacements);
      });
      
      console.log(`已更新 ${this.translatedElements.length} 个元素的翻译`);
    } catch (error) {
      console.error('更新翻译元素失败:', error);
    }
  }
}

// 将LanguageManager类暴露到全局作用域
window.LanguageManager = LanguageManager;

// 通知其他模块LanguageManager已加载
document.dispatchEvent(new CustomEvent('language-manager-loaded')); 