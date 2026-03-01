#!/bin/bash
# 自动监听构建脚本

echo "🔍 启动文件监听模式..."
echo "📝 修改 src/ 目录下的文件将自动重新构建"
echo ""

# 使用trap捕获Ctrl+C，优雅退出
trap 'echo ""; echo "👋 停止监听"; exit 0' INT

# 启动Vite监听模式（后台运行）
npx vite build --watch &
VITE_PID=$!

# 监听构建产物变化，自动复制资源文件
while true; do
  # 等待dist目录变化
  if [ -f "dist/popup.html" ]; then
    # 复制必要的资源文件
    cp -r images dist/ 2>/dev/null
    cp manifest.json dist/ 2>/dev/null
    cp README.md dist/README.md 2>/dev/null
    
    echo "✅ 资源文件已更新 $(date '+%H:%M:%S')"
  fi
  
  sleep 3
done

# 清理：如果脚本被终止，杀死后台进程
kill $VITE_PID 2>/dev/null
