# 项目合并说明

## 合并目标

将 `src/components` 目录中的组件转换为浏览器兼容的IIFE风格，并合并到 `src/js/modules` 目录中，实现统一的项目结构。

## 已完成的合并

1. 已将 `src/components/sidebar/index.js` 转换为 `src/js/modules/sidebar-component.js`
   - 将NodeJS风格的模块导出改为浏览器兼容的IIFE模式
   - 将组件暴露到全局window对象
   - 保留了所有功能

2. 更新了 `index.html`
   - 添加新的组件脚本引用
   - 保持脚本加载顺序

3. 更新了 `app.js`
   - 添加sidebarComponent实例化
   - 确保侧边栏功能正常工作

## 待完成的合并

以下组件尚未合并，可以按照相同的方式进行转换：

1. `src/components/tabs/index.js` → `src/js/modules/tabs-component.js`
2. `src/components/terminal/index.js` → `src/js/modules/terminal-component.js`
3. `src/components/modal/index.js` → `src/js/modules/modal-component.js`
4. `src/components/Settings.js` → `src/js/modules/settings-component.js`

## 合并注意事项

1. 合并时保持功能完整性，不要丢失任何功能
2. 采用统一的代码风格和命名约定
3. 使用IIFE模式并将组件暴露到全局window对象
4. 确保在index.html中添加新组件的脚本引用
5. 在app.js中正确初始化和使用新组件

完成所有合并后，可以删除 `src/components` 目录，以避免代码冗余和混淆。 