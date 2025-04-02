/**
 * SSH客户端 - 标签页管理模块
 */

// 标签页管理器类
class TabManager {
  constructor() {
    // 标签页状态
    this.activeTab = -1;
    
    // 获取DOM元素
    this.tabsContainer = document.getElementById('tabs-container');
    this.terminalsContainer = document.getElementById('terminals-container');
  }
  
  // 添加标签页
  addTab(name) {
    const tabIndex = this.tabsContainer.children.length;
    
    // 创建标签元素
    const tab = document.createElement('div');
    tab.className = 'tab';
    tab.dataset.index = tabIndex;
    
    // 标签名
    const tabName = document.createElement('span');
    tabName.textContent = name;
    tab.appendChild(tabName);
    
    // 关闭按钮
    const closeButton = document.createElement('span');
    closeButton.className = 'close-tab';
    closeButton.textContent = '×';
    closeButton.addEventListener('click', (event) => {
      event.stopPropagation();
      this.closeTab(tabIndex);
    });
    tab.appendChild(closeButton);
    
    // 点击切换标签
    tab.addEventListener('click', () => {
      this.switchTab(parseInt(tab.dataset.index, 10));
    });
    
    // 添加到DOM
    this.tabsContainer.appendChild(tab);
    
    // 创建终端容器
    const terminalWrapper = document.createElement('div');
    terminalWrapper.className = 'terminal-wrapper';
    terminalWrapper.style.display = 'none';
    
    const terminalElement = document.createElement('div');
    terminalElement.id = `terminal-${tabIndex}`;
    terminalElement.className = 'terminal';
    
    terminalWrapper.appendChild(terminalElement);
    this.terminalsContainer.appendChild(terminalWrapper);
    
    return tabIndex;
  }
  
  // 切换标签页
  switchTab(index) {
    // 更新活动标签
    this.activeTab = index;
    
    // 更新标签样式
    const tabs = this.tabsContainer.children;
    for (let i = 0; i < tabs.length; i++) {
      if (i === index) {
        tabs[i].classList.add('active');
      } else {
        tabs[i].classList.remove('active');
      }
    }
    
    // 更新终端显示
    const terminalWrappers = this.terminalsContainer.children;
    for (let i = 0; i < terminalWrappers.length; i++) {
      if (i === index) {
        terminalWrappers[i].style.display = 'block';
      } else {
        terminalWrappers[i].style.display = 'none';
      }
    }
    
    // 发布标签切换事件
    document.dispatchEvent(new CustomEvent('tab-switched', { detail: { index } }));
  }
  
  // 关闭标签页
  closeTab(index) {
    // 发布关闭标签事件，让其他模块处理清理工作
    document.dispatchEvent(new CustomEvent('tab-closed', { detail: { index } }));
    
    // 删除DOM元素
    this.tabsContainer.removeChild(this.tabsContainer.children[index]);
    this.terminalsContainer.removeChild(this.terminalsContainer.children[index]);
    
    // 更新标签索引
    for (let i = index + 1; i < this.tabsContainer.children.length + 1; i++) {
      if (this.tabsContainer.children[i - 1]) {
        this.tabsContainer.children[i - 1].dataset.index = i - 1;
      }
    }
    
    // 更新活动标签页
    if (this.activeTab === index) {
      if (index > 0) {
        this.switchTab(index - 1);
      } else if (this.tabsContainer.children.length > 0) {
        this.switchTab(0);
      } else {
        this.activeTab = -1;
      }
    } else if (this.activeTab > index) {
      this.switchTab(this.activeTab - 1);
    }
  }
  
  // 获取当前活动标签索引
  getActiveTabIndex() {
    return this.activeTab;
  }
  
  // 获取标签页总数
  getTabCount() {
    return this.tabsContainer.children.length;
  }
}

// 确保类在全局作用域中可用
window.TabManager = TabManager; 