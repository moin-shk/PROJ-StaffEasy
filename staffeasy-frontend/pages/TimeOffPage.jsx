import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const TimeOffPage = () => {
  const { isAuthenticated } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTimeOffData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/employees");
        const data = response.data;
        const withTimeOff = data.filter(emp => emp.timeOffRequests && emp.timeOffRequests.length > 0);
        setEmployees(withTimeOff);
      } catch (err) {
        setError("Failed to load time off requests.");
      }
    };
    fetchTimeOffData();
  }, []);

  if (!isAuthenticated) return <div className="text-center text-red-500">Access Denied</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Time Off Requests</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {employees.length === 0 ? (
        <p>No time off requests found.</p>
      ) : (
        <div className="space-y-6">
          {employees.map(emp => (
            <div key={emp._id} className="bg-white shadow rounded-lg p-4 border">
              <h2 className="text-xl font-semibold mb-2">{emp.name}</h2>
              <ul className="space-y-2">
                {emp.timeOffRequests.map((req, index) => (
                  <li key={index} className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                    {new Date(req.startDate).toLocaleDateString()} – {new Date(req.endDate).toLocaleDateString()} | {req.status.toUpperCase()} | {req.reason}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimeOffPage;
