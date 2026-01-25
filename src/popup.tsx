import React from "react";
import ReactDOM from "react-dom/client";
import { TabManager } from "./components/TabManager";
import "../popup.css";

const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <TabManager />
    </React.StrictMode>,
  );
}
