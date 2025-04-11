import { useState, useEffect } from "react";
import axios from "axios";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("staffeasy_user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing saved user data", error);
        localStorage.removeItem("staffeasy_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });

      const userData = res.data;

      localStorage.setItem("staffeasy_user", JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);

      // ✅ Force refresh so navbar and other auth-dependent components update
      window.location.href = "/dashboard";

      return true;
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      return false;
    }
  };

  const logout = async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("staffeasy_user");
    return true;
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
};

export default useAuth;
