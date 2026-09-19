import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import Layout from "../components/Layout";
import { addStudent } from "../services/studentService";
import { getDepartments } from "../services/departmentService";

import "../styles/StudentForm.css";

function AddStudent() {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [saving, setSaving] = useState(false);

  const [student, setStudent] = useState({
    name: "",
    email: "",
    departmentId: "",
  });

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const response = await getDepartments();
        setDepartments(response.data);
      } catch (error) {
        console.error("Failed to load departments:", error);
        toast.error("Failed to load departments");
      }
    };

    loadDepartments();
  }, []);

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!student.name || !student.email || !student.departmentId) {
      toast.error("Please fill all fields");
      return;
    }

    setSaving(true);

    try {
      await addStudent({
        name: student.name,
        email: student.email,
        department: { id: Number(student.departmentId) },
      });

      toast.success("Student added");
      navigate("/students");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to add student"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="form-page">
        <h1 className="page-title">Add student</h1>
        <p className="page-subtitle">
          Enter their details to add them to the register.
        </p>

        <motion.form
          className="glass form-card"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
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
            placeholder="Jane Doe"
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
            placeholder="jane.doe@college.edu"
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
            {saving ? "Saving..." : "Save student"}
          </button>
        </motion.form>
      </div>
    </Layout>
  );
}

export default AddStudent;
