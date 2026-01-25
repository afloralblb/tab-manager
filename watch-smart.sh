#!/bin/bash
# 智能文件监听脚本 - 使用fswatch

echo "🚀 Tab Manager - 智能监听模式"
echo "================================"
echo ""

# 检查是否安装了fswatch
if ! command -v fswatch &> /dev/null; then
    echo "⚠️  未安装 fswatch，正在安装..."
    echo "   运行: brew install fswatch"
    echo ""
    echo "   或使用简单监听模式: npm run watch"
    exit 1
fi

echo "📂 监听目录: src/"
echo "📝 文件类型: .ts, .tsx, .css"
echo "🔄 自动重建: 启用"
echo ""
echo "提示: 按 Ctrl+C 停止"
echo "================================"
echo ""

# 初始构建
echo "🔨 初始构建中..."
npm run build:full
echo ""

# 监听src目录的变化
fswatch -o src/ popup.css manifest.json | while read change; do
    clear
    echo "🔄 检测到文件变化 - $(date '+%Y-%m-%d %H:%M:%S')"
    echo "================================"
    echo ""
    
    # 重新构建
    npm run build:full
    
    echo ""
    echo "✅ 构建完成！"
    echo "💡 在 chrome://extensions/ 重新加载扩展查看效果"
    echo ""
    echo "等待下次文件变化..."
    echo "================================"
done
