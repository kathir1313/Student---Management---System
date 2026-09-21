import axios from "axios";

const API_URL = "https://distinguished-analysis-production-145f.up.railway.app/api/students";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getStudents = () =>
  axios.get(API_URL, getAuthHeader());

export const getStudentById = (id) =>
  axios.get(`${API_URL}/${id}`, getAuthHeader());

export const addStudent = (student) =>
  axios.post(API_URL, student, getAuthHeader());

export const updateStudent = (id, student) =>
  axios.put(`${API_URL}/${id}`, student, getAuthHeader());

export const deleteStudent = (id) =>
  axios.delete(`${API_URL}/${id}`, getAuthHeader());

export const countStudents = () =>
  axios.get(`${API_URL}/count`, getAuthHeader());

// Server-side search by keyword (name/email, per backend impl)
export const searchStudents = (keyword) =>
  axios.get(`${API_URL}/search`, {
    ...getAuthHeader(),
    params: { keyword },
  });

// Server-side dynamic sorting
export const getStudentsSorted = (field, direction = "asc") =>
  axios.get(`${API_URL}/sort`, {
    ...getAuthHeader(),
    params: { field, direction },
  });

// Server-side pagination + sorting
export const getStudentsPaginated = (page = 0, size = 5, sortBy = "id") =>
  axios.get(`${API_URL}/pagination`, {
    ...getAuthHeader(),
    params: { page, size, sortBy },
  });

// Filter by department name
export const filterStudentsByDepartment = (department) =>
  axios.get(`${API_URL}/filter`, {
    ...getAuthHeader(),
    params: { department },
  });
