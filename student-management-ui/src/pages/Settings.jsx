import { useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

import Layout from "../components/Layout";
import { getCurrentUser } from "../services/authService";
import { getStoredTheme, setTheme } from "../utils/theme";

import "../styles/Settings.css";

function Settings() {
  const user = getCurrentUser();
  const [theme, setThemeState] = useState(getStoredTheme());

  const handleSelect = (value) => {
    setTheme(value);
    setThemeState(value);
  };

  return (
    <Layout>
      <div className="settings-page">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">
          Appearance is saved on this device. There's no user-settings
          endpoint on the backend yet, so nothing here is synced to
          your account.
        </p>

        <div className="glass panel">
          <h3 className="panel-title">Appearance</h3>

          <div className="theme-options">
            <button
              className={`theme-option ${
                theme === "dark" ? "is-selected" : ""
              }`}
              onClick={() => handleSelect("dark")}
            >
              <FiMoon />
              <span>Dark</span>
            </button>

            <button
              className={`theme-option ${
                theme === "light" ? "is-selected" : ""
              }`}
              onClick={() => handleSelect("light")}
            >
              <FiSun />
              <span>Light</span>
            </button>
          </div>
        </div>

        <div className="glass panel">
          <h3 className="panel-title">Account</h3>

          <div className="settings-row">
            <span>Username</span>
            <strong>{user?.username || "—"}</strong>
          </div>
          <div className="settings-row">
            <span>Role</span>
            <strong>{user?.role || "—"}</strong>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Settings;
