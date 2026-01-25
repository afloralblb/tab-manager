// Type definitions for Chrome Extension
export interface ChromeTab extends chrome.tabs.Tab {}

export interface ChromeWindow extends chrome.windows.Window {}

export type Layout = "vertical" | "blocks";

export interface TabSelection {
  [tabId: number]: boolean;
}

export interface HiddenTabs {
  [tabId: number]: boolean;
}

export interface TabsById {
  [tabId: number]: ChromeTab;
}

export interface WindowsById {
  [windowId: number]: ChromeWindow;
}
