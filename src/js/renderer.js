/**
 * SSH客户端 - 渲染进程脚本
 */

// 当DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  try {
    // 创建并初始化应用
    if (typeof App !== 'undefined') {
      const app = new App();
      app.init();
      console.log('SSH客户端已加载');
      
      // 设置Electron IPC通道监听器
      setupIpcListeners();
    } else {
      throw new Error('App类未定义，请检查app.js是否正确加载');
    }
  } catch (error) {
    console.error('加载应用程序失败:', error);
    alert(`初始化失败: ${error.message}`);
  }
});

// 设置Electron IPC监听器
function setupIpcListeners() {
  if (window.electron) {
    console.log('设置Electron IPC监听器');
    
    // 监听设置菜单事件
    window.electron.on('show-settings', () => {
      console.log('接收到主进程的显示设置事件');
      document.dispatchEvent(new Event('show-settings'));
    });
    
    // 其他IPC事件可以在这里添加
  } else {
    console.warn('Electron API未找到，可能不是在Electron环境中运行');
  }
} 