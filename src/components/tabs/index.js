/**
 * 标签页组件 - 管理终端标签页
 */
class TabsComponent {
  constructor() {
    this.tabsContainer = document.getElementById('tabs-container');
    this.terminalsContainer = document.getElementById('terminals-container');
    this.activeTab = -1; // 当前活动标签页索引
  }
  
  /**
   * 添加标签页
   * @param {string} name - 标签页名称
   * @returns {number} - 新标签页的索引
   */
  addTab(name) {
    const tabIndex = this.tabsContainer.children.length;
    
    const tab = document.createElement('div');
    tab.className = 'tab';
    tab.dataset.index = tabIndex;
    
    const tabName = document.createElement('span');
    tabName.textContent = name;
    tab.appendChild(tabName);
    
    const closeButton = document.createElement('span');
    closeButton.className = 'close-tab';
    closeButton.textContent = '×';
    closeButton.addEventListener('click', (event) => {
      event.stopPropagation();
      this.closeTab(tabIndex);
    });
    tab.appendChild(closeButton);
    
    tab.addEventListener('click', () => {
      this.switchTab(parseInt(tab.dataset.index, 10));
    });
    
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
  
  /**
   * 切换标签页
   * @param {number} index - 标签页索引
   */
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
    
    // 触发标签切换事件
    document.dispatchEvent(new CustomEvent('tab-switched', {
      detail: { index }
    }));
  }
  
  /**
   * 关闭标签页
   * @param {number} index - 标签页索引
   */
  closeTab(index) {
    // 如果只有一个标签，则不关闭
    if (this.tabsContainer.children.length <= 1) {
      return;
    }
    
    // 触发标签关闭事件
    document.dispatchEvent(new CustomEvent('tab-closed', {
      detail: { index }
    }));
    
    // 删除DOM元素
    this.tabsContainer.removeChild(this.tabsContainer.children[index]);
    this.terminalsContainer.removeChild(this.terminalsContainer.children[index]);
    
    // 更新索引
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
  
  /**
   * 获取活动标签页索引
   * @returns {number} - 活动标签页索引
   */
  getActiveTab() {
    return this.activeTab;
  }
  
  /**
   * 获取标签页数量
   * @returns {number} - 标签页数量
   */
  getTabCount() {
    return this.tabsContainer.children.length;
  }
}

module.exports = TabsComponent; 