# Tab Manager - Modern Chrome Extension

现代化的Chrome浏览器标签页管理扩展

## ✨ 改造内容

### 架构升级

- ✅ Manifest V3（符合最新Chrome扩展规范）
- ✅ React 18 + TypeScript
- ✅ Vite 构建工具
- ✅ 函数组件 + Hooks（替代Class组件）
- ✅ 严格的TypeScript类型检查

### 主要改进

1. **Manifest V3**：使用service worker替代persistent background page
2. **现代React**：函数组件、Hooks、状态管理优化
3. **TypeScript**：完整的类型定义和类型安全
4. **现代构建**：Vite提供快速开发和优化的生产构建
5. **API更新**：使用`active`替代已废弃的`selected`属性

## 🚀 开发指南

### 安装依赖

\`\`\`bash
npm install
\`\`\`

### 开发模式（带热重载）

\`\`\`bash
npm run dev
\`\`\`

### 构建生产版本

\`\`\`bash
npm run build
\`\`\`

构建产物会输出到 `dist/` 目录。

### 类型检查

\`\`\`bash
npm run type-check
\`\`\`

## 📦 安装扩展

1. 运行 `npm run build` 构建扩展
2. 打开Chrome浏览器，访问 `chrome://extensions/`
3. 启用右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择 `dist` 文件夹

## 🎯 功能特性

- 📑 查看所有窗口的标签页
- 🔍 搜索过滤标签页
- 🗑️ 批量删除标签页
- 📌 固定/取消固定标签页
- 🪟 将选中的标签页移动到新窗口
- 🎨 支持垂直/块状布局
- 🔒 识别隐身模式标签页

## ⌨️ 快捷键

- **Ctrl+Shift+F** (Windows/Linux) 或 **MacCtrl+Shift+F** (macOS)：打开标签页管理器
- **Shift/Ctrl + 点击**：多选标签页
- **拖拽**：重新排列标签页
- **中键点击**：关闭标签页

## 📁 项目结构

\`\`\`
tab-manager/
├── src/
│ ├── components/
│ │ ├── Tab.tsx # 单个标签页组件
│ │ ├── Window.tsx # 窗口组件
│ │ └── TabManager.tsx # 主管理组件
│ ├── types.ts # TypeScript类型定义
│ ├── background.ts # Service Worker
│ └── popup.tsx # 入口文件
├── images/ # 图标资源
├── manifest.json # 扩展清单（V3）
├── popup.html # 弹出页面
├── popup.css # 样式文件
├── vite.config.ts # Vite配置
├── tsconfig.json # TypeScript配置
└── package.json # 项目配置
\`\`\`

## 🔧 技术栈

- **React 18**: 现代UI框架
- **TypeScript 5**: 类型安全
- **Vite 5**: 快速构建工具
- **Chrome Extension Manifest V3**: 最新扩展规范

## 📝 开发注意事项

- 使用`chrome.tabs.update({ active: true })`而非已废弃的`selected`
- Service Worker不支持持久化，需要处理生命周期
- 所有Chrome API调用都是异步的
- 开发时需要在Chrome扩展页面手动重载扩展

## 🎉 与旧版本对比

| 特性       | 旧版本             | 新版本                |
| ---------- | ------------------ | --------------------- |
| Manifest   | V2                 | V3 ✅                 |
| React      | 15.x (createClass) | 18.x (Hooks) ✅       |
| JavaScript | ES5                | TypeScript ✅         |
| 构建工具   | 无                 | Vite ✅               |
| 状态管理   | forceUpdate        | useState/useEffect ✅ |
| Chrome API | 部分过时           | 最新 ✅               |

## 📄 许可证

MIT
