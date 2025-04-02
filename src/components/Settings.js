/**
 * 设置模块 - 处理应用程序设置和首选项
 */
class SettingsComponent {
  constructor(app) {
    this.app = app;
    this.storageService = app.storageService;
    this.defaultSettings = {
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, Courier New, monospace',
      theme: 'dark',
      cursorBlink: true,
      scrollback: 1000,
      keepAliveInterval: 10000
    };
  }
  
  /**
   * 初始化设置
   */
  init() {
    this.settings = this.storageService.getSettings() || { ...this.defaultSettings };
    this.setupEvents();
  }
  
  /**
   * 设置事件监听
   */
  setupEvents() {
    // 监听设置保存事件
    window.electron.on('settings-saved', (settings) => {
      this.settings = settings;
      this.app.updateTerminalSettings(settings);
    });
    
    // 监听设置表单事件
    document.addEventListener('click', (event) => {
      if (event.target.matches('#settings-btn')) {
        this.showSettingsForm();
      }
    });
  }
  
  /**
   * 显示设置表单
   */
  showSettingsForm() {
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close">&times;</span>
        <h2>设置</h2>
        
        <div class="form-group">
          <label for="fontSize">字体大小</label>
          <input type="number" id="fontSize" value="${this.settings.fontSize}" min="8" max="32">
        </div>
        
        <div class="form-group">
          <label for="fontFamily">字体</label>
          <select id="fontFamily">
            <option value="Menlo, Monaco, Courier New, monospace" ${this.settings.fontFamily === 'Menlo, Monaco, Courier New, monospace' ? 'selected' : ''}>
              Menlo, Monaco, Courier New
            </option>
            <option value="'Source Code Pro', monospace" ${this.settings.fontFamily === "'Source Code Pro', monospace" ? 'selected' : ''}>
              Source Code Pro
            </option>
            <option value="'Fira Code', monospace" ${this.settings.fontFamily === "'Fira Code', monospace" ? 'selected' : ''}>
              Fira Code
            </option>
            <option value="'JetBrains Mono', monospace" ${this.settings.fontFamily === "'JetBrains Mono', monospace" ? 'selected' : ''}>
              JetBrains Mono
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="theme">主题</label>
          <select id="theme">
            <option value="dark" ${this.settings.theme === 'dark' ? 'selected' : ''}>深色</option>
            <option value="light" ${this.settings.theme === 'light' ? 'selected' : ''}>浅色</option>
            <option value="dracula" ${this.settings.theme === 'dracula' ? 'selected' : ''}>Dracula</option>
            <option value="github" ${this.settings.theme === 'github' ? 'selected' : ''}>GitHub</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="cursorBlink">光标闪烁</label>
          <input type="checkbox" id="cursorBlink" ${this.settings.cursorBlink ? 'checked' : ''}>
        </div>
        
        <div class="form-group">
          <label for="scrollback">滚动缓冲区行数</label>
          <input type="number" id="scrollback" value="${this.settings.scrollback}" min="500" max="10000">
        </div>
        
        <div class="form-group">
          <label for="keepAliveInterval">保持连接间隔(毫秒)</label>
          <input type="number" id="keepAliveInterval" value="${this.settings.keepAliveInterval}" min="5000" max="60000" step="1000">
        </div>
        
        <div class="form-group">
          <button id="save-settings" class="save-btn">保存</button>
          <button id="cancel-settings" class="cancel-btn">取消</button>
        </div>
      </div>
    `;
    
    // 添加到页面
    document.body.appendChild(modal);
    
    // 设置事件监听
    modal.querySelector('.close').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    modal.querySelector('#cancel-settings').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    modal.querySelector('#save-settings').addEventListener('click', () => {
      this.saveSettings(modal);
    });
  }
  
  /**
   * 保存设置
   * @param {Element} modal - 模态框元素
   */
  saveSettings(modal) {
    // 获取表单值
    const fontSize = parseInt(modal.querySelector('#fontSize').value, 10);
    const fontFamily = modal.querySelector('#fontFamily').value;
    const theme = modal.querySelector('#theme').value;
    const cursorBlink = modal.querySelector('#cursorBlink').checked;
    const scrollback = parseInt(modal.querySelector('#scrollback').value, 10);
    const keepAliveInterval = parseInt(modal.querySelector('#keepAliveInterval').value, 10);
    
    // 更新设置
    this.settings = {
      ...this.settings,
      fontSize,
      fontFamily,
      theme,
      cursorBlink,
      scrollback,
      keepAliveInterval
    };
    
    // 保存设置
    this.storageService.saveSettings(this.settings);
    
    // 关闭模态框
    document.body.removeChild(modal);
    
    // 通知应用更新设置
    this.app.updateTerminalSettings(this.settings);
  }
  
  /**
   * 获取当前设置
   * @returns {Object} - 当前设置
   */
  getSettings() {
    return this.settings;
  }
  
  /**
   * 根据主题获取终端颜色方案
   * @returns {Object} - 终端颜色方案
   */
  getThemeColors() {
    const themes = {
      dark: {
        background: '#1e1e1e',
        foreground: '#f0f0f0',
        cursor: '#f0f0f0',
        selection: 'rgba(255, 255, 255, 0.3)',
        black: '#000000',
        red: '#cd3131',
        green: '#0dbc79',
        yellow: '#e5e510',
        blue: '#2472c8',
        magenta: '#bc3fbc',
        cyan: '#11a8cd',
        white: '#e5e5e5',
        brightBlack: '#666666',
        brightRed: '#f14c4c',
        brightGreen: '#23d18b',
        brightYellow: '#f5f543',
        brightBlue: '#3b8eea',
        brightMagenta: '#d670d6',
        brightCyan: '#29b8db',
        brightWhite: '#e5e5e5'
      },
      light: {
        background: '#ffffff',
        foreground: '#000000',
        cursor: '#000000',
        selection: 'rgba(0, 0, 0, 0.3)',
        black: '#000000',
        red: '#cd3131',
        green: '#00bc00',
        yellow: '#949800',
        blue: '#0451a5',
        magenta: '#bc05bc',
        cyan: '#0598bc',
        white: '#555555',
        brightBlack: '#666666',
        brightRed: '#cd3131',
        brightGreen: '#14ce14',
        brightYellow: '#b5ba00',
        brightBlue: '#0451a5',
        brightMagenta: '#bc05bc',
        brightCyan: '#0598bc',
        brightWhite: '#a5a5a5'
      },
      dracula: {
        background: '#282a36',
        foreground: '#f8f8f2',
        cursor: '#f8f8f2',
        selection: 'rgba(255, 255, 255, 0.3)',
        black: '#21222c',
        red: '#ff5555',
        green: '#50fa7b',
        yellow: '#f1fa8c',
        blue: '#bd93f9',
        magenta: '#ff79c6',
        cyan: '#8be9fd',
        white: '#f8f8f2',
        brightBlack: '#6272a4',
        brightRed: '#ff6e6e',
        brightGreen: '#69ff94',
        brightYellow: '#ffffa5',
        brightBlue: '#d6acff',
        brightMagenta: '#ff92df',
        brightCyan: '#a4ffff',
        brightWhite: '#ffffff'
      },
      github: {
        background: '#ffffff',
        foreground: '#24292e',
        cursor: '#24292e',
        selection: 'rgba(0, 0, 0, 0.3)',
        black: '#24292e',
        red: '#d73a49',
        green: '#22863a',
        yellow: '#b08800',
        blue: '#0366d6',
        magenta: '#6f42c1',
        cyan: '#1b7c83',
        white: '#fafbfc',
        brightBlack: '#586069',
        brightRed: '#cb2431',
        brightGreen: '#28a745',
        brightYellow: '#dbab09',
        brightBlue: '#2188ff',
        brightMagenta: '#8a63d2',
        brightCyan: '#3192aa',
        brightWhite: '#ffffff'
      }
    };
    
    return themes[this.settings.theme] || themes.dark;
  }
}

module.exports = SettingsComponent;
