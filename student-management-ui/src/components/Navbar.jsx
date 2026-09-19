import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiBell,
  FiSun,
  FiMoon,
  FiLogOut,
  FiUser,
} from "react-icons/fi";

import { getCurrentUser, logout } from "../services/authService";
import { getStoredTheme, setTheme } from "../utils/theme";

import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [search, setSearch] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setThemeState] = useState(getStoredTheme());

  const notifRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    navigate("/students", { state: { initialSearch: search.trim() } });
  };

  const handleToggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setThemeState(next);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="topbar glass">
      <form className="topbar-search" onSubmit={handleSearchSubmit}>
        <FiSearch className="topbar-search-icon" />
        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>

      <div className="topbar-actions">
        <button
          className="icon-btn"
          onClick={handleToggleTheme}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <FiSun /> : <FiMoon />}
        </button>

        <div className="topbar-popover-wrap" ref={notifRef}>
          <button
            className="icon-btn"
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notifications"
          >
            <FiBell />
          </button>

          {notifOpen && (
            <div className="topbar-popover glass">
              <p className="topbar-popover-title">Notifications</p>
              <div className="empty-state">
                No notifications yet — this isn't wired to the
                backend, so nothing is fabricated here.
              </div>
            </div>
          )}
        </div>

        <div className="topbar-popover-wrap" ref={menuRef}>
          <button
            className="topbar-avatar"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {user?.username?.slice(0, 1).toUpperCase() || "?"}
          </button>

          {menuOpen && (
            <div className="topbar-popover glass topbar-menu">
              <div className="topbar-menu-header">
                <strong>{user?.username || "Guest"}</strong>
                <span>{user?.role || ""}</span>
              </div>

              <button
                className="topbar-menu-item"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/profile");
                }}
              >
                <FiUser /> Profile
              </button>

              <button
                className="topbar-menu-item topbar-menu-item-danger"
                onClick={handleLogout}
              >
                <FiLogOut /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
