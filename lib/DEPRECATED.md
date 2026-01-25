# ⚠️ 废弃文件夹

此文件夹包含旧版本的JavaScript文件，已被新的TypeScript + React 18版本替代。

## 旧文件映射

| 旧文件                 | 新文件                          | 说明                   |
| ---------------------- | ------------------------------- | ---------------------- |
| `lib/Tab.js`           | `src/components/Tab.tsx`        | 使用函数组件重写       |
| `lib/Window.js`        | `src/components/Window.tsx`     | 使用函数组件重写       |
| `lib/TabManager.js`    | `src/components/TabManager.tsx` | 使用函数组件+Hooks重写 |
| `lib/popup.js`         | `src/popup.tsx`                 | 现代化入口文件         |
| `lib/react.min.js`     | `node_modules/react`            | 通过npm管理            |
| `lib/react-dom.min.js` | `node_modules/react-dom`        | 通过npm管理            |

## 为什么保留？

这些文件保留用于参考，但不再用于构建过程。新的构建系统使用：

- `src/` 目录中的TypeScript文件
- npm管理的依赖
- Vite构建工具

## 可以删除吗？

是的！如果你确定不需要参考旧代码，可以安全删除整个 `lib/` 文件夹。构建过程不再依赖这些文件。

建议先备份到其他地方，以防需要参考旧的实现。
