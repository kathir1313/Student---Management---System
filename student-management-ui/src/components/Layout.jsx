import { useState } from "react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("sidebar_collapsed") === "true";
  });

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar_collapsed", String(next));
      return next;
    });
  };

  return (
    <div className="dashboard-container">
      <Sidebar collapsed={collapsed} onToggle={toggleCollapsed} />

      <div className={`main-content ${collapsed ? "is-collapsed" : ""}`}>
        <Navbar />
        {children}
      </div>
    </div>
  );
}

export default Layout;
