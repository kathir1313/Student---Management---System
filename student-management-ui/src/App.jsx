import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import AddStudent from "./pages/AddStudent";
import EditStudent from "./pages/EditStudent";
import Departments from "./pages/Departments";
import Profile from "./pages/Profile";
import Attendance from "./pages/Attendance";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

import ProtectedRoute from "./components/ProtectedRoute";
import PageTransition from "./components/PageTransition";

import "./App.css";

function AnimatedRoutes() {
  const location = useLocation();

  const protect = (element) => (
    <ProtectedRoute>
      <PageTransition>{element}</PageTransition>
    </ProtectedRoute>
  );

  const protectAdmin = (element) => (
    <ProtectedRoute adminOnly>
      <PageTransition>{element}</PageTransition>
    </ProtectedRoute>
  );

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={protect(<Dashboard />)} />
        <Route path="/students" element={protect(<Students />)} />
        <Route
          path="/add-student"
          element={protectAdmin(<AddStudent />)}
        />
        <Route
          path="/edit-student/:id"
          element={protectAdmin(<EditStudent />)}
        />
        <Route path="/departments" element={protect(<Departments />)} />
        <Route path="/attendance" element={protect(<Attendance />)} />
        <Route path="/reports" element={protect(<Reports />)} />
        <Route path="/profile" element={protect(<Profile />)} />
        <Route path="/settings" element={protect(<Settings />)} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-background" />

      <AnimatedRoutes />

      <ToastContainer
        position="top-right"
        theme="dark"
        autoClose={3000}
        hideProgressBar
      />
    </BrowserRouter>
  );
}

export default App;
