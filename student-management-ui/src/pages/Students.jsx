import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiPlus,
  FiChevronUp,
  FiChevronDown,
  FiEye,
  FiX,
} from "react-icons/fi";
import { toast } from "react-toastify";

import Layout from "../components/Layout";
import { isAdmin } from "../services/authService";
import {
  getStudentsPaginated,
  searchStudents,
  getStudentsSorted,
  deleteStudent,
  getStudentById,
} from "../services/studentService";

import "../styles/Students.css";

const SortIcon = ({ field, sortField, sortDirection }) => {
  if (sortField !== field) return null;
  return sortDirection === "asc" ? <FiChevronUp /> : <FiChevronDown />;
};

const PAGE_SIZE = 6;

function Students() {
  const location = useLocation();
  const admin = isAdmin();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(
    location.state?.initialSearch || ""
  );
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  // Server-side pagination only applies to the default (no search, no
  // custom sort) view, since the backend's /search and /sort endpoints
  // return full result sets rather than pages.
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [clientPage, setClientPage] = useState(0);

  const [viewingStudent, setViewingStudent] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const isFiltered = Boolean(search) || Boolean(sortField);

  const loadData = async () => {
    setLoading(true);

    try {
      if (search) {
        const res = await searchStudents(search);
        setStudents(res.data);
        setClientPage(0);
      } else if (sortField) {
        const res = await getStudentsSorted(sortField, sortDirection);
        setStudents(res.data);
        setClientPage(0);
      } else {
        const res = await getStudentsPaginated(page, PAGE_SIZE, "id");
        setStudents(res.data.content);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (error) {
      console.error("Failed to load students:", error);
      toast.error("Couldn't load students from the server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, sortField, sortDirection]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSortField(null);
    setPage(0);
  };

  const clearSearch = () => {
    setSearch("");
    setSortField(null);
    setPage(0);
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setSearch("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );
    if (!confirmed) return;

    try {
      await deleteStudent(id);
      toast.success("Student deleted");
      loadData();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete student");
    }
  };

  const handleViewDetails = async (id) => {
    setViewingStudent({});
    setDetailsLoading(true);

    try {
      const res = await getStudentById(id);
      setViewingStudent(res.data);
    } catch (error) {
      console.error("Failed to load student:", error);
      toast.error("Couldn't load student details");
      setViewingStudent(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  // Client-side pagination over a full (search/sort) result set.
  const visibleStudents = isFiltered
    ? students.slice(
        clientPage * PAGE_SIZE,
        clientPage * PAGE_SIZE + PAGE_SIZE
      )
    : students;

  const visibleTotalPages = isFiltered
    ? Math.max(1, Math.ceil(students.length / PAGE_SIZE))
    : totalPages;

  const currentPage = isFiltered ? clientPage : page;

  const goToPage = (next) => {
    if (isFiltered) {
      setClientPage(next);
    } else {
      setPage(next);
    }
  };

  return (
    <Layout>
      <div className="students-page">
        <div className="students-header">
          <div>
            <h1 className="page-title">Students</h1>
            <p className="page-subtitle">
              Every enrolled student, searchable and sortable straight
              from the backend.
            </p>
          </div>

          {admin && (
            <Link to="/add-student" className="btn-primary">
              <FiPlus /> Add student
            </Link>
          )}
        </div>

        <form className="students-search glass" onSubmit={handleSearchSubmit}>
          <FiSearch />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className="students-search-clear"
              onClick={clearSearch}
            >
              <FiX />
            </button>
          )}
        </form>

        <div className="glass panel students-table-panel">
          {loading ? (
            <div className="skeleton table-skel-lg" />
          ) : visibleStudents.length === 0 ? (
            <div className="empty-state">
              No students match this view.
            </div>
          ) : (
            <table className="glass-table">
              <thead>
                <tr>
                  <th
                    className="sortable-th"
                    onClick={() => toggleSort("name")}
                  >
                    Name{" "}
                    <SortIcon
                      field="name"
                      sortField={sortField}
                      sortDirection={sortDirection}
                    />
                  </th>
                  <th
                    className="sortable-th"
                    onClick={() => toggleSort("email")}
                  >
                    Email{" "}
                    <SortIcon
                      field="email"
                      sortField={sortField}
                      sortDirection={sortDirection}
                    />
                  </th>
                  <th>Department</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {visibleStudents.map((student) => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>
                      <span className="dept-chip">
                        {student.department?.name || "Unassigned"}
                      </span>
                    </td>
                    <td className="student-row-actions">
                      <button
                        className="icon-action"
                        title="View details"
                        onClick={() => handleViewDetails(student.id)}
                      >
                        <FiEye />
                      </button>
                      {admin && (
                        <>
                          <Link
                            to={`/edit-student/${student.id}`}
                            className="row-link"
                          >
                            Edit
                          </Link>
                          <button
                            className="row-link row-link-danger"
                            onClick={() => handleDelete(student.id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!loading && visibleTotalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 0}
                onClick={() => goToPage(currentPage - 1)}
              >
                Previous
              </button>
              <span>
                Page {currentPage + 1} of {visibleTotalPages}
              </span>
              <button
                disabled={currentPage >= visibleTotalPages - 1}
                onClick={() => goToPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {viewingStudent && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setViewingStudent(null)}
          >
            <motion.div
              className="modal-card glass"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close"
                onClick={() => setViewingStudent(null)}
              >
                <FiX />
              </button>

              {detailsLoading ? (
                <div className="skeleton" style={{ height: 120 }} />
              ) : (
                <>
                  <h2 className="modal-title">
                    {viewingStudent.name}
                  </h2>
                  <div className="modal-row">
                    <span>Email</span>
                    <strong>{viewingStudent.email}</strong>
                  </div>
                  <div className="modal-row">
                    <span>Department</span>
                    <strong>
                      {viewingStudent.department?.name || "Unassigned"}
                    </strong>
                  </div>
                  <div className="modal-row">
                    <span>Student ID</span>
                    <strong>#{viewingStudent.id}</strong>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}

export default Students;
