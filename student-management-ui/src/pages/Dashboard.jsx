import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  FiUsers,
  FiLayers,
  FiUserPlus,
  FiBarChart2,
  FiActivity,
} from "react-icons/fi";

import Layout from "../components/Layout";
import { isAdmin } from "../services/authService";
import { getStudents, countStudents } from "../services/studentService";
import { getDepartments } from "../services/departmentService";

import "../styles/Dashboard.css";

const CHART_COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#06b6d4",
  "#22c55e",
  "#f59e0b",
  "#ec4899",
];

function StatCard({ icon: Icon, label, value, loading, index }) {
  return (
    <motion.div
      className="stat-card glass"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <div className="stat-card-icon">
        <Icon />
      </div>
      <div>
        <p className="stat-card-value">
          {loading ? <span className="skeleton stat-skel" /> : value}
        </p>
        <p className="stat-card-label">{label}</p>
      </div>
    </motion.div>
  );
}

function Dashboard() {
  const admin = isAdmin();
  const [totalStudents, setTotalStudents] = useState(0);
  const [departments, setDepartments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [countRes, deptRes, studentsRes] = await Promise.all([
          countStudents(),
          getDepartments(),
          getStudents(),
        ]);

        setTotalStudents(countRes.data);
        setDepartments(deptRes.data);
        setStudents(studentsRes.data);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const departmentDistribution = useMemo(() => {
    const counts = {};

    students.forEach((student) => {
      const name = student.department?.name || "Unassigned";
      counts[name] = (counts[name] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [students]);

  const recentStudents = useMemo(() => {
    return [...students]
      .sort((a, b) => b.id - a.id)
      .slice(0, 5);
  }, [students]);

  return (
    <Layout>
      <div className="dashboard-page">
        <div className="dashboard-header">
          <div>
            <h1 className="page-title">Overview</h1>
            <p className="page-subtitle">
              A live snapshot of your student register.
            </p>
          </div>
        </div>

        <div className="stat-grid">
          <StatCard
            icon={FiUsers}
            label="Total students"
            value={totalStudents}
            loading={loading}
            index={0}
          />
          <StatCard
            icon={FiLayers}
            label="Departments"
            value={departments.length}
            loading={loading}
            index={1}
          />
          <StatCard
            icon={FiBarChart2}
            label="Avg. per department"
            value={
              departments.length
                ? Math.round(totalStudents / departments.length)
                : 0
            }
            loading={loading}
            index={2}
          />
        </div>

        <div className="dashboard-grid">
          <motion.div
            className="glass panel"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
          >
            <h3 className="panel-title">Department distribution</h3>

            {loading ? (
              <div className="skeleton chart-skel" />
            ) : departmentDistribution.length === 0 ? (
              <div className="empty-state">
                No students on record yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={departmentDistribution}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                  >
                    {departmentDistribution.map((entry, i) => (
                      <Cell
                        key={entry.name}
                        fill={CHART_COLORS[i % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#1e293b",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: 10,
                      color: "#f1f5f9",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    wrapperStyle={{ fontSize: 12, color: "#94a3b8" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          <motion.div
            className="glass panel"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <h3 className="panel-title">Quick actions</h3>

            <div className="quick-actions">
              {admin && (
                <Link to="/add-student" className="quick-action">
                  <FiUserPlus />
                  <span>Add student</span>
                </Link>
              )}
              <Link to="/departments" className="quick-action">
                <FiLayers />
                <span>Manage departments</span>
              </Link>
              <Link to="/reports" className="quick-action">
                <FiBarChart2 />
                <span>View reports</span>
              </Link>
            </div>

            <h3 className="panel-title panel-title-spaced">
              Activity timeline
            </h3>
            <div className="empty-state">
              <FiActivity style={{ marginBottom: 6, fontSize: 18 }} />
              <br />
              Activity history isn't tracked by the backend yet, so
              there's nothing real to show here.
            </div>
          </motion.div>
        </div>

        <motion.div
          className="glass panel"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
        >
          <h3 className="panel-title">Recently added students</h3>

          {loading ? (
            <div className="skeleton table-skel" />
          ) : recentStudents.length === 0 ? (
            <div className="empty-state">No students yet.</div>
          ) : (
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                </tr>
              </thead>
              <tbody>
                {recentStudents.map((student) => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>
                      <span className="dept-chip">
                        {student.department?.name || "Unassigned"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}

export default Dashboard;
