import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const EmployeesPage = () => {
  const { isAuthenticated } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: '',
    email: '',
    phone: '',
    salary: '',
  });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/employees");
      setEmployees(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
      setError("Could not load employees.");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/employees", {
        ...formData,
        salary: parseFloat(formData.salary),
        salaryHistory: [],
        timeOffRequests: [],
        reports: [],
        increments: [],
      });
      setSuccessMsg("✅ Employee added successfully!");
      setErrorMsg('');
      setFormData({
        name: '',
        position: '',
        department: '',
        email: '',
        phone: '',
        salary: '',
      });
      fetchEmployees(); // Refresh the list
    } catch (error) {
      console.error(error);
      setErrorMsg("❌ Failed to add employee.");
      setSuccessMsg('');
    }
  };

  if (!isAuthenticated) {
    return <div className="text-center text-red-500">Access Denied</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Employees</h1>

      {/* Add Employee Form */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Add New Employee</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['name', 'position', 'department', 'email', 'phone', 'salary'].map((field) => (
            <input
              key={field}
              type={field === 'salary' ? 'number' : 'text'}
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={formData[field]}
              onChange={handleChange}
              required
              className="border px-3 py-2 rounded"
            />
          ))}
          <button type="submit" className="col-span-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add Employee
          </button>
        </form>
        {successMsg && <p className="text-green-600 mt-3">{successMsg}</p>}
        {errorMsg && <p className="text-red-600 mt-3">{errorMsg}</p>}
      </div>

      {/* Employee Table */}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 uppercase">Name</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 uppercase">Position</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 uppercase">Department</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 uppercase">Email</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 uppercase">Phone</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 uppercase">Salary</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id} className="border-t">
                <td className="px-6 py-4 text-sm text-gray-900">{emp.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{emp.position}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{emp.department}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{emp.email}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{emp.phone}</td>
                <td className="px-6 py-4 text-sm text-gray-700">${emp.salary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeesPage;
