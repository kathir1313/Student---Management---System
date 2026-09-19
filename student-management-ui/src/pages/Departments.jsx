import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiPlus, FiLayers, FiUsers } from "react-icons/fi";
import { toast } from "react-toastify";

import Layout from "../components/Layout";
import { getDepartments, addDepartment } from "../services/departmentService";
import { getStudents } from "../services/studentService";
import { isAdmin } from "../services/authService";

import "../styles/Departments.css";

function Departments() {
  const admin = isAdmin();

  const [departments, setDepartments] = useState([]);
  const [studentCounts, setStudentCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [newDeptName, setNewDeptName] = useState("");
  const [adding, setAdding] = useState(false);

  const loadData = async () => {
    setLoading(true);

    try {
      const [deptRes, studentsRes] = await Promise.all([
        getDepartments(),
        getStudents(),
      ]);

      setDepartments(deptRes.data);

      const counts = {};
      studentsRes.data.forEach((student) => {
        const deptId = student.department?.id;
        if (deptId) counts[deptId] = (counts[deptId] || 0) + 1;
      });
      setStudentCounts(counts);
    } catch (error) {
      console.error("Failed to load departments:", error);
      toast.error("Couldn't load departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!newDeptName.trim()) {
      toast.error("Enter a department name");
      return;
    }

    setAdding(true);

    try {
      await addDepartment({ name: newDeptName.trim() });
      toast.success("Department added");
      setNewDeptName("");
      loadData();
    } catch (error) {
      console.error("Failed to add department:", error);
      toast.error(
        error.response?.data?.message || "Failed to add department"
      );
    } finally {
      setAdding(false);
    }
  };

  return (
    <Layout>
      <div className="departments-page">
        <h1 className="page-title">Departments</h1>
        <p className="page-subtitle">
          Departments on record, and how many students belong to each.
          The backend doesn't yet support editing or deleting a
          department, so those actions aren't offered here.
        </p>

        {admin && (
          <form className="glass add-dept-form" onSubmit={handleAdd}>
            <input
              type="text"
              placeholder="New department name (e.g. Computer Science)"
              value={newDeptName}
              onChange={(e) => setNewDeptName(e.target.value)}
              className="field-input"
            />
            <button type="submit" className="btn-primary" disabled={adding}>
              <FiPlus /> {adding ? "Adding..." : "Add department"}
            </button>
          </form>
        )}

        {loading ? (
          <div className="dept-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton dept-card-skel" />
            ))}
          </div>
        ) : departments.length === 0 ? (
          <div className="glass empty-state">No departments yet.</div>
        ) : (
          <div className="dept-grid">
            {departments.map((dept, i) => (
              <motion.div
                key={dept.id}
                className="glass dept-card"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.25 }}
                whileHover={{ y: -3 }}
              >
                <div className="dept-card-icon">
                  <FiLayers />
                </div>
                <h3>{dept.name}</h3>
                <p>
                  <FiUsers />
                  {studentCounts[dept.id] || 0} students
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Departments;
