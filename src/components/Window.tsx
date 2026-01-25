import React from "react";
import { Tab } from "./tab";
import {
  ChromeWindow,
  ChromeTab,
  Layout,
  TabSelection,
  HiddenTabs,
} from "../types";

interface WindowProps {
  window: ChromeWindow;
  tabs: ChromeTab[];
  layout: Layout;
  selection: TabSelection;
  hiddenTabs: HiddenTabs;
  filterTabs: boolean;
  onDelete: (tabId: number) => void;
  onSelect: (tabId: number) => void;
  onDrag: (e: React.DragEvent, tabId: number) => void;
  onDrop: (tabId: number, before: boolean) => void;
}

export const Window: React.FC<WindowProps> = ({
  window,
  tabs,
  layout,
  selection,
  hiddenTabs,
  filterTabs,
  onDelete,
  onSelect,
  onDrag,
  onDrop,
}) => {
  let hideWindow = true;
  const tabsPerRow = 1;

  const tabElements = tabs.map((tab) => {
    const isHidden = !!hiddenTabs[tab.id!] && filterTabs;
    const isSelected = !!selection[tab.id!];
    hideWindow = hideWindow && isHidden;

    return (
      <Tab
        key={tab.id}
        window={window}
        layout={layout}
        tab={tab}
        selected={isSelected}
        hidden={isHidden}
        onDelete={onDelete}
        onSelect={onSelect}
        onDrag={onDrag}
        onDrop={onDrop}
      />
    );
  });

  const handleAddTab = () => {
    chrome.tabs.create({ windowId: window.id });
  };

  const handleClose = () => {
    chrome.windows.remove(window.id!);
  };

  if (hideWindow) {
    return null;
  }

  // Add action buttons
  const actionButtons = (
    <>
      <div
        className={`icon close ${layout === "blocks" ? "" : "windowaction"}`}
        onClick={handleClose}
      />
      <div
        className={`icon add ${layout === "blocks" ? "" : "windowaction"}`}
        onClick={handleAddTab}
      />
    </>
  );

  // Build children array with newliners
  const children: React.ReactNode[] = [];
  for (let j = 0; j < tabElements.length; j++) {
    if (
      j % tabsPerRow === 0 &&
      j &&
      (j < tabElements.length - 1 || layout === "blocks")
    ) {
      children.push(<div key={`newliner-${j}`} className="newliner" />);
    }
    children.push(tabElements[j]);
  }

  return (
    <div
      className={`window ${layout === "blocks" ? "block" : ""} ${
        window.focused ? "focused" : ""
      }`}
    >
      {children}
      {actionButtons}
    </div>
  );
};
