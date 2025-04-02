# SSH客户端项目结构

## 核心文件

- `main.js` - Electron主进程入口文件
- `preload.js` - Electron预加载脚本，提供安全的API桥接
- `index.html` - 应用程序UI的主要HTML文件

## 前端模块

### src/js 目录 (正在使用)

- `src/js/app.js` - 应用程序的主要入口点，初始化各模块
- `src/js/renderer.js` - 渲染进程初始化脚本
- `src/js/modules/` - 使用IIFE模式的浏览器兼容模块:
  - `connection-manager.js` - 连接管理模块
  - `tab-manager.js` - 标签页管理模块
  - `terminal-manager.js` - 终端管理模块
  - `ui-manager.js` - UI交互管理模块
  - `sidebar-component.js` - 新合并的侧边栏组件（从components目录转换）

### src/components 目录 (正在合并中)

- 原使用Node.js风格的模块系统
- 正在逐步合并到 `src/js/modules` 目录
- 合并过程参见 `MERGE.md` 文件

## 服务模块

- `src/services/` - 核心服务:
  - `ssh.js` - SSH连接服务
  - `storage.js` - 数据存储服务
  - `terminal.js` - 终端功能服务

## 样式文件

- `src/styles/` - CSS样式文件
- `styles/` - 根目录的样式文件

## 工具

- `src/utils/` - 辅助工具函数和模块
- `src/menu.js` - 应用程序菜单定义

## 预留目录

- `src/ui/` - 预留用于未来UI组件
- `src/templates/` - 预留用于HTML模板

## 当前使用情况

- 项目主要使用 `src/js` 目录下的模块实现功能
- 模块通过在 `index.html` 中的script标签按顺序引入
- 模块使用浏览器兼容的IIFE模式，将类暴露到全局window对象
- 正在进行从 `src/components` 到 `src/js/modules` 的合并，使用统一的IIFE模式 