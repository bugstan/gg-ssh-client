/**
 * 组件索引文件 - 统一导出所有组件
 */

// 导入组件
const SidebarComponent = require('./sidebar/index');
const TabsComponent = require('./tabs/index');
const TerminalComponent = require('./terminal/index');
const ModalComponent = require('./modal/index');
const SettingsComponent = require('./Settings');

// 导出组件
module.exports = {
  SidebarComponent,
  TabsComponent,
  TerminalComponent,
  ModalComponent,
  SettingsComponent
}; 