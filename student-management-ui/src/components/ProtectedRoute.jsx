import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

import { isAuthenticated, isAdmin } from "../services/authService";

function ProtectedRoute({ children, adminOnly = false }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  if (adminOnly && !isAdmin()) {
    toast.error("Only admins can access that page");
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
