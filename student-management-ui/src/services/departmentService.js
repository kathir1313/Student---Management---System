import axios from "axios";

const API_URL = "https://distinguished-analysis-production-145f.up.railway.app/api/departments";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getDepartments = () =>
  axios.get(API_URL, getAuthHeader());

export const getDepartmentById = (id) =>
  axios.get(`${API_URL}/${id}`, getAuthHeader());

export const addDepartment = (department) =>
  axios.post(API_URL, department, getAuthHeader());
