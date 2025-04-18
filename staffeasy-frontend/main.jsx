import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./navbar.jsx";
import "./index.css";

import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import EmployeesPage from "./pages/EmployeesPage.jsx";
import TeamsPage from "./pages/TeamsPage.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import TimeOffPage from "./pages/TimeOffPage.jsx";
import PayrollPage from "./pages/PayrollPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

import { AuthProvider } from "./context/AuthContext.jsx";

const App = () => {
  return (
    <div className="app min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="container mx-auto p-4 pt-6 flex-grow">
        <Routes>
          {}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/time-off" element={<TimeOffPage />} />
          <Route path="/payroll" element={<PayrollPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {}
          <Route
            path="*"
            element={
              <div className="text-center py-20">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Page Not Found
                </h2>
                <p className="text-gray-600 mb-8">
                  The page you're looking for doesn't exist or has been moved.
                </p>
                <a
                  href="/"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition-colors"
                >
                  Go Home
                </a>
              </div>
            }
          />
        </Routes>
      </main>

      <footer className="bg-white shadow-inner py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2025 StaffEasy. All rights reserved.</p>
          <p className="mt-1">Developed by Tech Titans - Web Dev 2 Project</p>
        </div>
      </footer>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
