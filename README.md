# Tab Manager - Chrome Extension

Tab Manager.

LESS TAB, HIGHER EFFICIENCY!

## ✨ 效果预览

Click extension icon: ![Image text](images/icon.png)

You will get: ![Image text](images/snapshot.png)

## 🎯 功能特性

- 📑 查看所有窗口的标签页
- 🔍 搜索过滤标签页
- 🗑️ 批量删除标签页
- 📌 固定/取消固定标签页
- 🪟 将选中的标签页移动到新窗口
- 🔒 识别隐身模式标签页

## ⌨️ 快捷键

- **Ctrl+Shift+F** (Windows/Linux) 或 **MacCtrl+Shift+F** (macOS)：打开标签页管理器
- **Shift/Ctrl + 点击**：多选标签页
- **拖拽**：重新排列标签页
- **中键点击**：关闭标签页

## 📦 安装扩展

1. 运行 `npm run build:full` 构建扩展
2. 打开 Chrome 浏览器，访问 `chrome://extensions/`
3. 启用右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择 `dist` 文件夹

## 🚀 开发指南

### 安装依赖

\`\`\`bash
npm install
\`\`\`

### 常用命令

\`\`\`bash

# 开发模式（浏览器预览，带热重载）

npm run dev

# 完整构建（含图标、manifest 等资源）

npm run build:full

# 仅构建

npm run build

# 监听模式构建

npx vite build --watch

# 类型检查

npm run type-check
\`\`\`

> **注意：** `npm run dev` 可在 `http://localhost:5173` 预览 UI，但某些 Chrome 扩展 API 无法使用。扩展功能调试需使用 `npm run build:full` 后在 Chrome 中重载。

### 开发工作流

1. 修改 `src/` 中的代码
2. 运行 `npm run build:full`
3. 打开 `chrome://extensions/`，点击扩展的 **🔄 重新加载** 按钮
4. 重新打开 popup 查看效果

## 🔍 调试技巧

### Popup 页面调试

右键点击扩展图标 → **"检查"** 打开开发者工具，可查看控制台日志、React 组件树（需安装 [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)）。

### Background Service Worker 调试

1. 访问 `chrome://extensions/`
2. 点击扩展卡片下的 **"service worker"** 链接查看日志

### TypeScript 类型检查

\`\`\`bash
npm run type-check
\`\`\`

常见写法：

\`\`\`typescript
// ✅ 使用可选链
if (tab?.id) {
chrome.tabs.update(tab.id, { active: true });
}
\`\`\`

## 🐛 常见问题

**修改代码后没有变化？**
重新运行 `npm run build:full`，然后在 `chrome://extensions/` 重新加载扩展。

**扩展无法加载？**
确保已运行 `npm run build:full`，检查 `dist/` 文件夹是否存在。

**TypeScript 编译错误？**
运行 `npm run type-check` 查看具体错误位置。

**图标不显示？**
确认 `manifest.json` 中包含 `"favicon"` 权限。

## 📁 项目结构

\`\`\`
tab-manager/
├── src/
│ ├── components/
│ │ ├── tab.tsx # 单个标签页组件
│ │ ├── window.tsx # 窗口组件
│ │ └── tab-manager.tsx # 主管理组件
│ ├── types.ts # TypeScript 类型定义
│ ├── background.ts # Service Worker
│ └── popup.tsx # 入口文件
├── images/ # 图标资源
├── manifest.json # 扩展清单（V3）
├── popup.html # 弹出页面
├── popup.css # 样式文件
├── vite.config.ts # Vite 配置
├── tsconfig.json # TypeScript 配置
└── package.json # 项目配置
\`\`\`

## 🔧 技术栈

- **React 18** - 现代 UI 框架
- **TypeScript 5** - 类型安全
- **Vite 5** - 快速构建工具
- **Chrome Extension Manifest V3** - 最新扩展规范

## 📄 许可证

MIT
