import { motion } from "framer-motion";

import Layout from "../components/Layout";
import { getCurrentUser } from "../services/authService";

import "../styles/Profile.css";

function Profile() {
  const user = getCurrentUser();

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "??";

  return (
    <Layout>
      <div className="profile-page">
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">
          Your account details, decoded from your login token.
        </p>

        <motion.div
          className="glass profile-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="profile-avatar">{initials}</div>

          <div className="profile-info">
            <h2>{user?.username || "Unknown user"}</h2>
            <span className="profile-role-chip">
              {user?.role || "No role"}
            </span>
          </div>
        </motion.div>

        <div className="glass panel">
          <h3 className="panel-title">About this page</h3>
          <p className="profile-note">
            The backend doesn't expose a user-profile endpoint beyond
            username and role, so there's nothing else real to show
            here yet — no invented bio, avatar upload, or contact
            fields.
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;
