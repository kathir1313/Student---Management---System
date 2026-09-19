import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";

import { register } from "../services/authService";

import "../styles/Auth.css";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter a username and password");
      return;
    }

    setLoading(true);

    try {
      await register(username, password, role);
      toast.success("Account created — you can log in now.");
      navigate("/");
    } catch (err) {
      console.error(err);

      if (!err.response) {
        setError("Couldn't reach the server. Check the backend is running.");
      } else {
        setError(
          err.response?.data?.message || "Could not create the account"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <motion.div
        className="auth-card glass"
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="auth-emblem">SM</div>

        <h1>Create an account</h1>
        <p className="auth-subtitle">
          Register a staff account to access the system.
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleRegister}>
          <label className="field-label" htmlFor="username">
            Username
          </label>
          <div className="input-with-icon">
            <FiUser className="input-icon" />
            <input
              id="username"
              type="text"
              className="field-input has-icon"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your.username"
            />
          </div>

          <label className="field-label" htmlFor="password">
            Password
          </label>
          <div className="input-with-icon">
            <FiLock className="input-icon" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="field-input has-icon"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <button
              type="button"
              className="input-icon-btn"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <label className="field-label" htmlFor="role">
            Role
          </label>
          <select
            id="role"
            className="field-input"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="USER">Student</option>
            <option value="ADMIN">Admin</option>
          </select>

          <button
            type="submit"
            className="btn-primary auth-submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Register;
