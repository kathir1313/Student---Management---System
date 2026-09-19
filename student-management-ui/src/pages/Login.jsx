import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";

import { login, isAuthenticated } from "../services/authService";

import "../styles/Auth.css";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    setLoading(true);

    try {
      await login(username, password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);

      if (!err.response) {
        setError(
          "Couldn't reach the server. Check the backend is running " +
            "and this app's port is allowed in its CORS settings."
        );
      } else {
        setError(
          err.response?.data?.message || "Invalid username or password"
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

        <h1>Log in to your account</h1>
        <p className="auth-subtitle">
          Welcome back. Enter your staff credentials to continue.
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <label className="field-label" htmlFor="username">
            Username
          </label>
          <div className="input-with-icon">
            <FiMail className="input-icon" />
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

          <button
            type="submit"
            className="btn-primary auth-submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Log in"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/register">Create an account</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;
