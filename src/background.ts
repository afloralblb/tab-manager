// Background Service Worker for Manifest V3
chrome.runtime.onInstalled.addListener(() => {
  console.log("tab-manager 启动 - Manifest V3");
});

// Keep service worker alive
chrome.runtime.onMessage.addListener((_message, _sender, _sendResponse) => {
  // Handle messages if needed
  return true;
});
