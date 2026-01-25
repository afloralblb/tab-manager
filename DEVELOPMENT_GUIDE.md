# 开发调试指南 🛠️

## 📋 目录

- [快速开始](#快速开始)
- [开发模式](#开发模式)
- [调试技巧](#调试技巧)
- [常见问题](#常见问题)
- [最佳实践](#最佳实践)

---

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 首次构建

```bash
npm run build:full
```

### 3. 加载扩展到Chrome

1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 右上角打开 **"开发者模式"** 开关
4. 点击 **"加载已解压的扩展程序"**
5. 选择项目的 **`dist`** 文件夹
6. 扩展已加载成功！

---

## 💻 开发模式

### 方式一：Vite开发模式（推荐用于UI调试）

```bash
npm run dev
```

**特点：**

- ✅ 热重载（修改代码自动刷新）
- ✅ 快速编译（毫秒级）
- ✅ 实时错误提示
- ✅ 适合快速迭代UI

**访问：** 浏览器打开 `http://localhost:5173`

**注意：** 这个模式下可以预览UI，但某些Chrome扩展API无法使用（因为不在扩展环境中）

---

### 方式二：监听模式 + 手动重载（推荐用于扩展功能调试）

#### 步骤1: 启动监听模式

```bash
# 在终端1运行
npm run dev
```

或者使用构建监听：

```bash
# 更精确的监听模式
npx vite build --watch
```

#### 步骤2: 自动复制资源

在另一个终端运行监听脚本：

```bash
# 在终端2运行（监听文件变化并复制）
while true; do
  npm run build:full
  echo "等待文件变化..."
  sleep 2
done
```

或者使用更优雅的方式，创建一个监听脚本：

```bash
# 创建监听脚本
cat > watch.sh << 'EOF'
#!/bin/bash
echo "🔍 监听文件变化..."
while true; do
  npm run build
  cp -r images dist/
  cp manifest.json dist/
  echo "✅ 构建完成 $(date '+%H:%M:%S')"
  sleep 1
done
EOF

chmod +x watch.sh
./watch.sh
```

#### 步骤3: 在Chrome中重载扩展

每次修改代码后：

1. 打开 `chrome://extensions/`
2. 找到你的扩展
3. 点击 **🔄 重新加载** 按钮

---

## 🔍 调试技巧

### 1. Popup页面调试

**打开开发者工具：**

- 右键点击扩展图标 → **"检查"** 或 **"审查弹出内容"**
- 或者：打开popup后按 `F12`

**调试内容：**

```typescript
// 在组件中添加console.log
export const TabManager: React.FC = () => {
  console.log('TabManager 渲染');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('搜索值:', e.target.value);
    // ...
  };

  return (/* ... */);
};
```

**查看React组件树：**

1. 安装 [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
2. 打开popup的开发者工具
3. 切换到 "Components" 标签

---

### 2. Background Service Worker调试

**查看Service Worker：**

1. 访问 `chrome://extensions/`
2. 找到你的扩展
3. 点击 **"service worker"** 链接（在"检查视图"下）

**调试代码：**

```typescript
// src/background.ts
chrome.runtime.onInstalled.addListener(() => {
  console.log("✅ 扩展已安装/更新");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("收到消息:", message);
  console.log("发送者:", sender);
  return true;
});
```

**注意事项：**

- Service Worker会在不活动时自动休眠
- 重新触发扩展功能会唤醒它
- 查看日志需要在Service Worker激活时打开控制台

---

### 3. TypeScript类型检查

**实时类型检查：**

```bash
npm run type-check
```

**在VSCode中启用：**

1. 安装推荐的扩展（TypeScript and JavaScript Language Features）
2. 打开设置 → 搜索 "TypeScript: Check Js"
3. 保存文件时自动显示类型错误

**修复类型错误：**

```typescript
// ❌ 错误
const tab = tabs[0];
chrome.tabs.update(tab.id, { active: true });

// ✅ 正确（添加类型守卫）
const tab = tabs[0];
if (tab?.id) {
  chrome.tabs.update(tab.id, { active: true });
}
```

---

### 4. Chrome API调试

**查看权限：**

```typescript
// 在popup中检查权限
chrome.permissions.getAll((permissions) => {
  console.log("当前权限:", permissions);
});
```

**监听标签事件：**

```typescript
// src/components/TabManager.tsx
useEffect(() => {
  const handleTabUpdate = (tabId: number, changeInfo: any, tab: any) => {
    console.log("标签更新:", { tabId, changeInfo, tab });
  };

  chrome.tabs.onUpdated.addListener(handleTabUpdate);

  return () => {
    chrome.tabs.onUpdated.removeListener(handleTabUpdate);
  };
}, []);
```

**调试异步API：**

```typescript
// 使用 async/await（更清晰）
const getTabs = async () => {
  try {
    const windows = await chrome.windows.getAll({ populate: true });
    console.log("获取到的窗口:", windows);
  } catch (error) {
    console.error("获取窗口失败:", error);
  }
};
```

---

### 5. 网络请求调试

**查看扩展的网络请求：**

1. 打开popup的开发者工具
2. 切换到 "Network" 标签
3. 重新打开popup查看请求

---

### 6. 性能调试

**React性能分析：**

```typescript
import { Profiler } from 'react';

export const TabManager: React.FC = () => {
  const onRenderCallback = (
    id: string,
    phase: "mount" | "update",
    actualDuration: number
  ) => {
    console.log(`${id} ${phase} 耗时: ${actualDuration}ms`);
  };

  return (
    <Profiler id="TabManager" onRender={onRenderCallback}>
      {/* 组件内容 */}
    </Profiler>
  );
};
```

**内存泄漏检测：**

1. 打开开发者工具 → Performance
2. 录制一段操作
3. 查看内存使用情况

---

## 🐛 常见问题

### 问题1: 修改代码后没有变化

**解决方案：**

```bash
# 1. 重新构建
npm run build:full

# 2. 在 chrome://extensions/ 重新加载扩展

# 3. 如果popup已打开，关闭后重新打开
```

---

### 问题2: TypeScript编译错误

**检查错误：**

```bash
npm run type-check
```

**常见错误修复：**

```typescript
// 问题：Property 'id' does not exist on type 'Tab'
const tabId = tab.id; // ❌

// 解决：使用可选链
const tabId = tab.id!; // ✅（确定存在时）
const tabId = tab?.id; // ✅（不确定时）
```

---

### 问题3: Chrome API调用失败

**检查权限：**

```json
// manifest.json
{
  "permissions": ["storage", "tabs"]
}
```

**正确使用API：**

```typescript
// ❌ 错误（Manifest V2 API）
chrome.tabs.update(tabId, { selected: true });

// ✅ 正确（Manifest V3 API）
chrome.tabs.update(tabId, { active: true });
```

---

### 问题4: Service Worker未运行

**检查方法：**

1. 访问 `chrome://extensions/`
2. 查看扩展卡片下是否有 "service worker" 链接
3. 如果显示 "inactive"，触发一个扩展操作（如打开popup）

**排查代码：**

```typescript
// src/background.ts
chrome.runtime.onInstalled.addListener(() => {
  console.log("Service Worker 启动"); // 应该能看到这条日志
});
```

---

### 问题5: 热重载不工作

**原因：** Chrome扩展的popup每次打开都是新实例

**解决方案：**

- 使用 `npm run dev` 在浏览器中预览（`http://localhost:5173`）
- 或者使用监听模式 + 手动重载

---

## 🎯 开发工作流

### 推荐工作流

```bash
# 终端1: 启动开发服务器
npm run dev

# 终端2: 监听构建（可选）
npx vite build --watch
```

**开发步骤：**

1. 修改 `src/` 中的代码
2. 保存文件（Vite自动编译）
3. 如果在浏览器预览（localhost:5173）：
   - ✅ 自动刷新，立即看到效果
4. 如果在Chrome扩展中测试：
   - 运行 `npm run build:full`
   - 在 `chrome://extensions/` 重新加载扩展
   - 重新打开popup

---

## 📊 调试工具推荐

### VSCode扩展

- **ESLint** - 代码规范检查
- **Prettier** - 代码格式化
- **TypeScript Vue Plugin (Volar)** - TypeScript支持
- **Error Lens** - 行内错误提示
- **GitLens** - Git增强

### Chrome扩展

- **React Developer Tools** - React调试
- **Redux DevTools** - 状态管理调试（如果用Redux）

---

## 💡 最佳实践

### 1. 使用TypeScript严格模式

```typescript
// ✅ 好的实践
const tab: ChromeTab | undefined = tabs[0];
if (tab?.id) {
  chrome.tabs.update(tab.id, { active: true });
}

// ❌ 避免
const tab: any = tabs[0];
chrome.tabs.update(tab.id, { active: true });
```

### 2. 添加错误处理

```typescript
const updateWindows = useCallback(async () => {
  try {
    const windows = await chrome.windows.getAll({ populate: true });
    setWindows(windows);
  } catch (error) {
    console.error("更新窗口失败:", error);
  }
}, []);
```

### 3. 使用React DevTools

- 检查组件props
- 查看组件state
- 分析渲染性能

### 4. 日志记录

```typescript
// 添加详细的日志
console.group("TabManager 更新");
console.log("当前窗口数:", windows.length);
console.log("选中标签数:", Object.keys(selection).length);
console.groupEnd();
```

### 5. 定期类型检查

```bash
# 提交代码前检查
npm run type-check
```

---

## 🚀 快速命令参考

```bash
# 安装依赖
npm install

# 开发模式（浏览器预览）
npm run dev

# 类型检查
npm run type-check

# 完整构建
npm run build:full

# 仅构建（不复制资源）
npm run build

# 监听模式构建
npx vite build --watch
```

---

## 📝 调试检查清单

开始调试前：

- [ ] 依赖已安装（`npm install`）
- [ ] 扩展已构建（`npm run build:full`）
- [ ] 扩展已加载到Chrome
- [ ] 开发者模式已启用

遇到问题时：

- [ ] 检查控制台错误
- [ ] 运行类型检查（`npm run type-check`）
- [ ] 重新构建扩展
- [ ] 重新加载扩展
- [ ] 检查Chrome版本是否支持Manifest V3

---

## 🎓 学习资源

- [Chrome Extension API文档](https://developer.chrome.com/docs/extensions/reference/)
- [Manifest V3迁移指南](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [React Hooks文档](https://react.dev/reference/react)
- [TypeScript手册](https://www.typescriptlang.org/docs/)
- [Vite文档](https://vitejs.dev/)

---

## 💬 需要帮助？

1. 查看 [常见问题](#常见问题)
2. 检查 Chrome控制台错误信息
3. 运行 `npm run type-check` 查看类型错误
4. 查看 [QUICKSTART.md](QUICKSTART.md) 了解基础使用

---

**祝开发愉快！** 🎉
