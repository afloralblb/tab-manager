import React, { useState } from "react";
import { ChromeTab, ChromeWindow, Layout } from "../types";

interface TabProps {
  tab: ChromeTab;
  window: ChromeWindow;
  layout: Layout;
  selected: boolean;
  hidden: boolean;
  onDelete: (tabId: number) => void;
  onSelect: (tabId: number) => void;
  onDrag: (e: React.DragEvent, tabId: number) => void;
  onDrop: (tabId: number, before: boolean) => void;
}

export const Tab: React.FC<TabProps> = ({
  tab,
  window,
  layout,
  selected,
  hidden,
  onDelete,
  onSelect,
  onDrag,
  onDrop,
}) => {
  const [draggingOver, setDraggingOver] = useState<string>("");

  const resolveFavIconUrl = (): string => {
    if (!tab.url || tab.url.indexOf("chrome://") !== 0) {
      return tab.favIconUrl ? `url(${tab.favIconUrl})` : "";
    } else {
      const favIcons = [
        "bookmarks",
        "chrome",
        "crashes",
        "downloads",
        "extensions",
        "flags",
        "history",
        "settings",
      ];
      const iconName = tab.url.slice(9).match(/^\w+/g);
      return !iconName || favIcons.indexOf(iconName[0]) < 0
        ? ""
        : `url(../images/chrome/${iconName[0]}.png)`;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (e.button === 1) {
      onDelete(tab.id!);
    } else if (e.shiftKey || e.ctrlKey) {
      onSelect(tab.id!);
    } else {
      chrome.tabs.update(tab.id!, { active: true });
      chrome.windows.update(window.id!, { focused: true });
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    onDrag(e, tab.id!);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;

    if (layout === "vertical") {
      const newState =
        e.nativeEvent.offsetY > target.clientHeight / 2 ? "bottom" : "top";
      setDraggingOver(newState);
    } else {
      const newState =
        e.nativeEvent.offsetX > target.clientWidth / 2 ? "right" : "left";
      setDraggingOver(newState);
    }
  };

  const handleDragLeave = () => {
    setDraggingOver("");
  };

  const handleDrop = () => {
    const before = draggingOver === "top" || draggingOver === "left";
    setDraggingOver("");
    onDrop(tab.id!, before);
  };

  const handleDelete = () => {
    onDelete(tab.id!);
  };

  return (
    <div className="tabItem">
      <div
        className={`icon tab ${selected ? "selected " : ""}${
          hidden ? "hidden " : ""
        }${layout === "vertical" ? "full " : ""}${
          tab.incognito ? "incognito " : ""
        }${draggingOver}`}
        style={{
          backgroundImage: resolveFavIconUrl(),
          paddingLeft: layout === "vertical" ? "20px" : "",
        }}
        title={tab.title}
        onClick={handleClick}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        draggable
      >
        <div className="tabtitle">{tab.title}</div>
        <div className="limiter" />
      </div>
      <div
        className={`icon close ${layout === "blocks" ? "" : "windowaction"}`}
        onClick={handleDelete}
      />
    </div>
  );
};
