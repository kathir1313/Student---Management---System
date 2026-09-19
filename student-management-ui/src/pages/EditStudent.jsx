import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import Layout from "../components/Layout";
import {
  getStudentById,
  updateStudent,
} from "../services/studentService";
import { getDepartments } from "../services/departmentService";

import "../styles/StudentForm.css";

function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [student, setStudent] = useState({
    name: "",
    email: "",
    departmentId: "",
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const [studentRes, deptRes] = await Promise.all([
          getStudentById(id),
          getDepartments(),
        ]);

        const data = studentRes.data;

        setStudent({
          name: data.name || "",
          email: data.email || "",
          departmentId: data.department?.id || "",
        });

        setDepartments(deptRes.data);
      } catch (error) {
        console.error("Failed to load student:", error);
        toast.error("Failed to load student details");
        navigate("/students");
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!student.name || !student.email || !student.departmentId) {
      toast.error("Please fill all fields");
      return;
    }

    setSaving(true);

    try {
      await updateStudent(id, {
        name: student.name,
        email: student.email,
        department: { id: Number(student.departmentId) },
      });

      toast.success("Student updated");
      navigate("/students");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(
        error.response?.data?.message || "Failed to update student"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="form-page">
        <h1 className="page-title">Edit student</h1>
        <p className="page-subtitle">Update their record below.</p>

        <motion.form
          className="glass form-card"
          onSubmit={handleUpdate}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {loading ? (
            <div className="skeleton" style={{ height: 180 }} />
          ) : (
            <>
              <label className="field-label" htmlFor="name">
                Full name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                className="field-input"
                value={student.name}
                onChange={handleChange}
              />

              <label className="field-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                className="field-input"
                value={student.email}
                onChange={handleChange}
              />

              <label className="field-label" htmlFor="departmentId">
                Department
              </label>
              <select
                id="departmentId"
                name="departmentId"
                className="field-input"
                value={student.departmentId}
                onChange={handleChange}
              >
                <option value="">Select department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="btn-primary form-submit"
                disabled={saving}
              >
                {saving ? "Updating..." : "Update student"}
              </button>
            </>
          )}
        </motion.form>
      </div>
    </Layout>
  );
}

export default EditStudent;
