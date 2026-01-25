# 快速开始指南 🚀

## 第一次使用？从这里开始！

### 1️⃣ 构建扩展

\`\`\`bash
npm run build:full
\`\`\`

这会在 `dist/` 文件夹中生成可安装的扩展。

### 2️⃣ 安装到Chrome

1. 打开Chrome浏览器
2. 地址栏输入: `chrome://extensions/`
3. 打开右上角的 **"开发者模式"** 开关
4. 点击 **"加载已解压的扩展程序"**
5. 选择项目中的 **`dist`** 文件夹
6. 完成！

### 3️⃣ 使用扩展

- 点击浏览器工具栏的扩展图标
- 或使用快捷键：
  - Windows/Linux: `Ctrl+Shift+F`
  - Mac: `MacCtrl+Shift+F`

### 4️⃣ 开发模式（可选）

如果你想修改代码：

\`\`\`bash

# 启动开发服务器（带热重载）

npm run dev

# 修改 src/ 目录下的文件

# 保存后自动重新编译

# 重新构建扩展

npm run build:full

# 在 chrome://extensions/ 页面点击"重新加载"按钮

\`\`\`

---

## 🎯 功能说明

- **查看所有标签**: 一目了然看到所有窗口的所有标签页
- **搜索标签**: 输入关键词快速查找标签
- **批量操作**:
  - `Shift/Ctrl + 点击`：多选标签
  - 点击垃圾桶图标：删除选中的标签
  - 点击📌图标：固定/取消固定标签
  - 拖拽标签：重新排序
- **新建窗口**: 将选中的标签移动到新窗口

---

## ❓ 遇到问题？

### 扩展无法加载？

- 确保已运行 `npm run build:full`
- 检查 `dist/` 文件夹是否存在
- 查看Chrome扩展页面的错误信息

### 修改代码后没有变化？

- 重新运行 `npm run build:full`
- 在 `chrome://extensions/` 点击扩展的"重新加载"按钮

### 找不到某个标签？

- 使用搜索框输入标签标题或URL
- 点击过滤图标切换过滤模式

---

## 📚 更多信息

- 完整文档: [README_NEW.md](README_NEW.md)
- 迁移说明: [MIGRATION_COMPLETE.md](MIGRATION_COMPLETE.md)
- 原始README: [README.md](README.md)

---

享受使用吧！ 🎉
