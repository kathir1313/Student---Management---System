import { useEffect, useMemo, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { toast } from "react-toastify";

import Layout from "../components/Layout";
import { getStudents } from "../services/studentService";
import { getDepartments } from "../services/departmentService";

import "../styles/Reports.css";

function Reports() {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [studentsRes, deptRes] = await Promise.all([
          getStudents(),
          getDepartments(),
        ]);
        setStudents(studentsRes.data);
        setDepartments(deptRes.data);
      } catch (error) {
        console.error(error);
        toast.error("Couldn't load report data");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const departmentBreakdown = useMemo(() => {
    const counts = {};
    students.forEach((s) => {
      const name = s.department?.name || "Unassigned";
      counts[name] = (counts[name] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [students]);

  const handleDownloadCsv = () => {
    if (students.length === 0) {
      toast.info("There's no student data to export yet");
      return;
    }

    const header = "Name,Email,Department\n";
    const rows = students
      .map(
        (s) =>
          `"${s.name || ""}","${s.email || ""}","${
            s.department?.name || "Unassigned"
          }"`
      )
      .join("\n");

    const blob = new Blob([header + rows], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "students_report.csv";
    link.click();

    URL.revokeObjectURL(url);
    toast.success("Report downloaded");
  };

  return (
    <Layout>
      <div className="reports-page">
        <div className="reports-header">
          <div>
            <h1 className="page-title">Reports</h1>
            <p className="page-subtitle">
              A live summary built from the actual student register.
              Attendance and financial figures aren't included since
              the backend doesn't track that data.
            </p>
          </div>

          <button className="btn-primary" onClick={handleDownloadCsv}>
            <FiDownload /> Download CSV
          </button>
        </div>

        <div className="glass panel">
          <h3 className="panel-title">Summary</h3>

          {loading ? (
            <div className="skeleton" style={{ height: 100 }} />
          ) : (
            <div className="report-summary">
              <div className="report-summary-item">
                <span>{students.length}</span>
                <p>Total students</p>
              </div>
              <div className="report-summary-item">
                <span>{departments.length}</span>
                <p>Departments</p>
              </div>
              <div className="report-summary-item">
                <span>
                  {departments.length
                    ? Math.round(students.length / departments.length)
                    : 0}
                </span>
                <p>Avg. students / dept</p>
              </div>
            </div>
          )}
        </div>

        <div className="glass panel">
          <h3 className="panel-title">Students per department</h3>

          {loading ? (
            <div className="skeleton" style={{ height: 160 }} />
          ) : departmentBreakdown.length === 0 ? (
            <div className="empty-state">No data to report yet.</div>
          ) : (
            <div className="report-bars">
              {departmentBreakdown.map(([name, count]) => (
                <div key={name} className="report-bar-row">
                  <span className="report-bar-label">{name}</span>
                  <div className="report-bar-track">
                    <div
                      className="report-bar-fill"
                      style={{
                        width: `${
                          (count / students.length) * 100
                        }%`,
                      }}
                    />
                  </div>
                  <span className="report-bar-count">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Reports;
