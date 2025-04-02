// 在页面加载完成后运行调试脚本
document.addEventListener('DOMContentLoaded', () => {
  console.log('调试脚本已加载');
  
  // 获取调试按钮
  const debugBtn = document.getElementById('debug-btn');
  if (debugBtn) {
    console.log('调试按钮已找到');
    debugBtn.addEventListener('click', () => {
      console.log('调试按钮被点击');
      
      // 测试直接操作DOM显示模态框
      const modal = document.querySelector('.modal');
      if (modal) {
        console.log('模态框找到，修改显示状态');
        modal.style.display = 'flex';
      } else {
        console.error('找不到模态框元素');
      }
    });
  }
});

// 在窗口加载完成后获取Vue实例
window.addEventListener('load', () => {
  console.log('窗口已完全加载');
  
  // 输出所有Vue组件
  setTimeout(() => {
    console.log('当前DOM树:', document.body.innerHTML);
    console.log('模态框状态:', document.querySelector('.modal') ? '存在' : '不存在');
  }, 1000);
});
