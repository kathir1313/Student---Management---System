import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiGrid,
  FiUsers,
  FiUserPlus,
  FiLayers,
  FiCheckSquare,
  FiBarChart2,
  FiUser,
  FiSettings,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";

import { isAdmin } from "../services/authService";

import "../styles/Sidebar.css";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/students", label: "Students", icon: FiUsers },
  {
    to: "/add-student",
    label: "Add student",
    icon: FiUserPlus,
    adminOnly: true,
  },
  { to: "/departments", label: "Departments", icon: FiLayers },
  { to: "/attendance", label: "Attendance", icon: FiCheckSquare },
  { to: "/reports", label: "Reports", icon: FiBarChart2 },
  { to: "/profile", label: "Profile", icon: FiUser },
  { to: "/settings", label: "Settings", icon: FiSettings },
];

function Sidebar({ collapsed, onToggle }) {
  const admin = isAdmin();
  const visibleLinks = links.filter((link) => !link.adminOnly || admin);

  return (
    <motion.aside
      className={`sidebar glass ${collapsed ? "is-collapsed" : ""}`}
      animate={{ width: collapsed ? 76 : 250 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <div className="sidebar-mark">
        <span className="sidebar-mark-glyph">SM</span>
        {!collapsed && (
          <div className="sidebar-mark-text">
            <strong>Student</strong>
            <span>Management</span>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {visibleLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              isActive ? "sidebar-link is-active" : "sidebar-link"
            }
            title={collapsed ? label : undefined}
          >
            <Icon className="sidebar-icon" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <button
        className="sidebar-collapse-btn"
        onClick={onToggle}
        aria-label="Toggle sidebar"
      >
        {collapsed ? <FiChevronsRight /> : <FiChevronsLeft />}
        {!collapsed && <span>Collapse</span>}
      </button>
    </motion.aside>
  );
}

export default Sidebar;
