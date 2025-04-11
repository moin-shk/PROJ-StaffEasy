import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleProfileDropdown = () => setProfileDropdownOpen(!profileDropdownOpen);

  const isPrivileged = user?.role === 'admin' || user?.role === 'manager';

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left side */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-blue-600">StaffEasy</Link>

            {isAuthenticated && (
              <div className="flex space-x-6">
                <Link to="/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
                {isPrivileged && (
                  <>
                    <Link to="/employees" className="text-gray-600 hover:text-blue-600">Employees</Link>
                    <Link to="/teams" className="text-gray-600 hover:text-blue-600">Teams</Link>
                    <Link to="/analytics" className="text-gray-600 hover:text-blue-600">Analytics</Link>
                    <Link to="/time-off" className="text-gray-600 hover:text-blue-600">Time Off</Link>
                    <Link to="/payroll" className="text-gray-600 hover:text-blue-600">Payroll</Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right side (auth/profile) */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleProfileDropdown}
                  className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold"
                >
                  {user?.username?.charAt(0).toLowerCase() || 'U'}
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700">
                      Signed in as <strong>{user?.username || user?.email}</strong>
                    </div>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Your Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-600 hover:text-blue-600">Login</Link>
                <Link to="/register" className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
