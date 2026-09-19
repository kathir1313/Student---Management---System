import { useEffect, useState } from "react";
import { FiCheckSquare, FiUsers } from "react-icons/fi";

import Layout from "../components/Layout";
import { countStudents } from "../services/studentService";

import "../styles/Attendance.css";

function Attendance() {
  const [totalStudents, setTotalStudents] = useState(null);

  useEffect(() => {
    countStudents()
      .then((res) => setTotalStudents(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Layout>
      <div className="attendance-page">
        <h1 className="page-title">Attendance</h1>
        <p className="page-subtitle">
          There's no attendance data in the backend yet, so this page
          shows what's real (your student count) rather than making up
          numbers for the rest.
        </p>

        <div className="glass panel attendance-empty">
          <div className="attendance-icon">
            <FiCheckSquare />
          </div>
          <h3>Attendance tracking isn't connected yet</h3>
          <p>
            Once the backend has an attendance model and endpoints,
            this page can show real daily records, trends and a
            per-department breakdown.
          </p>

          {totalStudents !== null && (
            <div className="attendance-fact">
              <FiUsers />
              <span>
                <strong>{totalStudents}</strong> students are currently
                on record and would be covered once this is wired up.
              </span>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Attendance;
