# SSH 客户端

一个基于 Electron 的轻量级、跨平台 SSH 客户端，提供简洁高效的远程服务器连接体验。

## 功能特性

- 🚀 轻量级设计，快速启动
- 💻 跨平台支持 (Windows, macOS, Linux)
- 🔒 支持密码和 SSH 密钥认证
- 📝 多标签页管理多个连接
- 🎨 可自定义终端主题和字体
- 📋 支持连接配置导入导出
- 🔄 自动重连和心跳检测
- ⌨️ 完整的终端仿真功能

## 技术栈

- Electron - 跨平台桌面应用框架
- node-ssh - SSH 连接库
- xterm.js - 终端模拟器
- electron-store - 本地数据存储
- Vue.js - 前端框架

## 安装

### 开发环境

1. 克隆仓库
```bash
git clone [repository-url]
cd electron-ssh-client
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

### 生产环境

1. 构建应用
```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux
```

2. 安装包位于 `dist` 目录

## 使用说明

### 基本操作

1. 新建连接
   - 点击侧边栏底部的"添加连接"按钮
   - 填写连接信息（主机、端口、用户名等）
   - 选择认证方式（密码/私钥）

2. 连接到服务器
   - 点击侧边栏中的连接名称
   - 等待连接建立
   - 开始使用终端

3. 管理连接
   - 右键点击连接可进行编辑、复制、删除等操作
   - 支持连接配置的导入导出

### 终端操作

- 支持标准终端快捷键
- 自动调整终端大小
- 支持复制粘贴
- 可自定义字体大小和主题

### 快捷键

- `Ctrl+N`: 新建连接
- `Ctrl+W`: 关闭当前标签页
- `Ctrl+Tab`: 切换到下一个标签页
- `Ctrl+Shift+Tab`: 切换到上一个标签页
- `Ctrl+K`: 清空终端
- `Ctrl+D`: 断开当前连接
- `Ctrl+Plus`: 增大字体
- `Ctrl+Minus`: 减小字体
- `Ctrl+0`: 重置字体大小

## 项目结构

```
electron-ssh-client/
├── src/                # 源代码目录
│   ├── components/    # 组件
│   ├── services/      # 服务
│   └── utils/         # 工具函数
├── styles/            # 样式文件
├── assets/            # 静态资源
├── main.js           # 主进程入口
├── preload.js        # 预加载脚本
└── index.html        # 主窗口
```

## 开发计划

- [ ] 添加 SFTP 文件传输功能
- [ ] 支持终端分屏
- [ ] 添加命令历史记录
- [ ] 支持自定义快捷键
- [ ] 添加连接分组功能

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目。

## 许可证

MIT License
