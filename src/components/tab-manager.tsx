import React, { useState, useEffect, useRef, useCallback } from "react";
import { Window } from "./window";
import {
  ChromeWindow,
  Layout,
  TabSelection,
  HiddenTabs,
  TabsById,
} from "../types";

export const TabManager: React.FC = () => {
  const [layout] = useState<Layout>("vertical");
  const [windows, setWindows] = useState<ChromeWindow[]>([]);
  const [selection, setSelection] = useState<TabSelection>({});
  const [hiddenTabs, setHiddenTabs] = useState<HiddenTabs>({});
  const [tabsById, setTabsById] = useState<TabsById>({});
  const [filterTabs, setFilterTabs] = useState<boolean>(
    !!localStorage.getItem("filter-tabs"),
  );
  const searchBoxRef = useRef<HTMLInputElement>(null);

  const updateWindows = useCallback(() => {
    chrome.windows.getLastFocused(
      { windowTypes: ["normal"] },
      (lastFocused) => {
        chrome.windows.getAll({ populate: true }, (chromeWindows) => {
          const newTabsById: TabsById = {};

          chromeWindows.forEach((window) => {
            window.tabs?.forEach((tab) => {
              newTabsById[tab.id!] = tab;
            });
          });

          // popup 打开时会抢占焦点，导致所有窗口 focused=false
          // 使用 getLastFocused 获取上一个聚焦的普通窗口并手动标记
          const lastFocusedId = lastFocused?.id;
          const windowsWithFocus = chromeWindows.map((w) => ({
            ...w,
            focused: w.id === lastFocusedId,
          }));

          setWindows(windowsWithFocus);
          setTabsById(newTabsById);

          // 清理已关闭标签的选择状态（不依赖外部 selection）
          setSelection((prevSelection) => {
            const newSelection = { ...prevSelection };
            let hasChanges = false;

            Object.keys(newSelection).forEach((id) => {
              if (!newTabsById[Number(id)]) {
                delete newSelection[Number(id)];
                hasChanges = true;
              }
            });

            return hasChanges ? newSelection : prevSelection;
          });
        });
      },
    );
  }, []); // 不依赖任何状态，避免循环更新

  useEffect(() => {
    updateWindows();

    // Set up Chrome event listeners
    chrome.windows.onCreated.addListener(updateWindows);
    chrome.windows.onRemoved.addListener(updateWindows);
    chrome.tabs.onCreated.addListener(updateWindows);
    chrome.tabs.onUpdated.addListener(updateWindows);
    chrome.tabs.onMoved.addListener(updateWindows);
    chrome.tabs.onDetached.addListener(updateWindows);
    chrome.tabs.onRemoved.addListener(updateWindows);
    chrome.tabs.onReplaced.addListener(updateWindows);

    // Focus search box
    if (searchBoxRef.current) {
      searchBoxRef.current.focus();
      searchBoxRef.current.select();
    }

    return () => {
      // Cleanup would go here if needed
    };
  }, [updateWindows]);

  const handleDeleteTab = (tabId: number) => {
    chrome.tabs.remove(tabId);
  };

  const handleDeleteTabs = () => {
    const tabs = Object.keys(selection).map((id) => tabsById[Number(id)]);
    if (tabs.length) {
      tabs.forEach((tab) => {
        if (tab?.id) chrome.tabs.remove(tab.id);
      });
    } else {
      console.warn("No tabs selected");
    }
  };

  const handleSelect = (id: number) => {
    setSelection((prev) => {
      const newSelection = { ...prev };
      if (newSelection[id]) {
        delete newSelection[id];
      } else {
        newSelection[id] = true;
      }
      return newSelection;
    });
  };

  const handleDrag = (_e: React.DragEvent, id: number) => {
    if (!selection[id]) {
      setSelection({ [id]: true });
    }
  };

  const handleDrop = (id: number, before: boolean) => {
    const tab = tabsById[id];
    if (!tab) return;

    const tabs = Object.keys(selection).map((tabId) => tabsById[Number(tabId)]);
    const index = (tab.index ?? 0) + (before ? 0 : 1);

    tabs.forEach((t) => {
      if (t?.id) {
        chrome.tabs.move(t.id, { windowId: tab.windowId, index }, () => {
          if (t?.id) chrome.tabs.update(t.id, { pinned: t.pinned ?? false });
        });
      }
    });
  };

  const handleAddWindow = () => {
    const tabs = Object.keys(selection).map((id) => tabsById[Number(id)]);
    const first = tabs.shift();

    if (first?.id) {
      chrome.windows.create({ tabId: first.id }, (w) => {
        if (first?.id)
          chrome.tabs.update(first.id, { pinned: first.pinned ?? false });
        tabs.forEach((tab) => {
          if (tab?.id && w?.id) {
            chrome.tabs.move(tab.id, { windowId: w.id, index: 1 }, () => {
              if (tab?.id)
                chrome.tabs.update(tab.id, { pinned: tab.pinned ?? false });
            });
          }
        });
      });
    } else {
      chrome.windows.create({});
    }
  };

  const handlePinTabs = () => {
    const tabs = Object.keys(selection)
      .map((id) => tabsById[Number(id)])
      .sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

    if (tabs.length) {
      const shouldUnpin = tabs[0].pinned;
      tabs.forEach((tab) => {
        if (tab?.id) chrome.tabs.update(tab.id, { pinned: !shouldUnpin });
      });
    } else {
      chrome.windows.getCurrent((w) => {
        chrome.tabs.query({ active: true, windowId: w.id }, (activeTabs) => {
          const activeTab = activeTabs[0];
          if (activeTab?.id) {
            chrome.tabs.update(activeTab.id, { pinned: !activeTab.pinned });
          }
        });
      });
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value || "";

    // 如果搜索框为空，清空选择和隐藏状态
    if (!searchValue) {
      setSelection({});
      setHiddenTabs({});
      return;
    }

    // 每次都从所有标签中搜索，而不是基于上次结果
    // 这样可以避免逐步搜索时丢失标签的问题
    const newSelection: TabSelection = {};
    const newHiddenTabs: HiddenTabs = {};

    // 遍历所有标签页
    Object.keys(tabsById).forEach((id) => {
      const tab = tabsById[Number(id)];
      const searchText = ((tab.title || "") + (tab.url || "")).toLowerCase();
      const searchLower = searchValue.toLowerCase();

      // 匹配的标签加入选择，不匹配的标签隐藏
      if (searchText.indexOf(searchLower) >= 0) {
        newSelection[Number(id)] = true;
      } else {
        newHiddenTabs[Number(id)] = true;
      }
    });

    setSelection(newSelection);
    setHiddenTabs(newHiddenTabs);
  };

  const handleCheckEnter = (e: React.KeyboardEvent) => {
    if (e.keyCode === 13) handleAddWindow();
  };

  const handleToggleFilterMismatchedTabs = () => {
    const newFilterTabs = !filterTabs;
    setFilterTabs(newFilterTabs);
    localStorage.setItem("filter-tabs", newFilterTabs ? "1" : "");
  };

  return (
    <>
      {windows.map((window) => (
        <Window
          key={window.id}
          window={window}
          tabs={window.tabs || []}
          layout={layout}
          selection={selection}
          hiddenTabs={hiddenTabs}
          filterTabs={filterTabs}
          onDelete={handleDeleteTab}
          onSelect={handleSelect}
          onDrag={handleDrag}
          onDrop={handleDrop}
        />
      ))}
      <div className="window searchbox">
        <input
          type="text"
          onChange={handleSearch}
          onKeyDown={handleCheckEnter}
          ref={searchBoxRef}
        />
        <div
          className={`icon windowaction filter${filterTabs ? " enabled" : ""}`}
          title="Filter tabs"
          onClick={handleToggleFilterMismatchedTabs}
        />
        <div
          className="icon windowaction trash"
          title="Delete Tabs"
          onClick={handleDeleteTabs}
        />
        <div
          className="icon windowaction pin"
          title="Pin Tabs"
          onClick={handlePinTabs}
        />
        <div
          className="icon windowaction new"
          title="Add Window"
          onClick={handleAddWindow}
        />
      </div>
      <div className="window placeholder" />
    </>
  );
};
