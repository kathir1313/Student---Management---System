import axios from "axios";

const API_URL = "https://distinguished-analysis-production-145f.up.railway.app/auth";

// Decode a JWT payload without any extra dependency.
// Returns null if the token is missing or malformed.
const decodeToken = (token) => {
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    const decoded = atob(
      payload.replace(/-/g, "+").replace(/_/g, "/")
    );
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    username,
    password,
  });

  const { token } = response.data;
  localStorage.setItem("token", token);

  return token;
};

export const register = async (username, password, role) => {
  const response = await axios.post(`${API_URL}/register`, {
    username,
    password,
    role,
  });

  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getToken = () => localStorage.getItem("token");

export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return true;

  // exp is in seconds, Date.now() is in ms
  return decoded.exp * 1000 < Date.now();
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  if (isTokenExpired(token)) {
    logout();
    return false;
  }

  return true;
};

export const getCurrentUser = () => {
  const token = getToken();
  if (!token || !isAuthenticated()) return null;

  const decoded = decodeToken(token);
  if (!decoded) return null;

  return {
    username: decoded.sub,
    role: decoded.role,
  };
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.role?.toUpperCase() === "ADMIN";
};
