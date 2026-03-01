#!/bin/bash
# Build script for Chrome Extension

# Run the build
npm run build

# Copy necessary files to dist
cp -r images dist/
cp manifest.json dist/
cp README.md dist/README.md

echo "✅ Build complete! Extension is ready in the dist/ directory"
echo "📦 To install:"
echo "   1. Open chrome://extensions/"
echo "   2. Enable 'Developer mode'"
echo "   3. Click 'Load unpacked'"
echo "   4. Select the 'dist' folder"
