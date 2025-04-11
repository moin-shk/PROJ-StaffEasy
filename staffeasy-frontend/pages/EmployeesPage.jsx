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

  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/employees");
      setEmployees(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError("Could not load employees.");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
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
      setFormData({ name: '', position: '', department: '', email: '', phone: '', salary: '' });
      fetchEmployees();
    } catch (err) {
      setError("Failed to add employee.");
    }
  };

  const handleEditClick = (emp) => {
    setEditing(emp._id);
    setEditForm({ ...emp });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/employees/${editing}`, {
        ...editForm,
        salary: parseFloat(editForm.salary),
      });
      setEditing(null);
      fetchEmployees();
    } catch (err) {
      setError("Failed to update employee.");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`);
      fetchEmployees();
    } catch (err) {
      setError("Failed to delete employee.");
    }
  };

  if (!isAuthenticated) {
    return <div className="text-center text-red-500">Access Denied</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Employees</h1>

      {/* Add Employee Form */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-8">
        <h2 className="text-lg font-semibold mb-4">Add New Employee</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["name", "position", "department", "email", "phone", "salary"].map((field) => (
            <input
              key={field}
              type={field === "salary" ? "number" : "text"}
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
        {error && <p className="text-red-500 mt-3">{error}</p>}
      </div>

      {/* Employee Table */}
      {employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Position</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Department</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Salary</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id} className="border-t">
                <td className="px-6 py-4">{emp.name}</td>
                <td className="px-6 py-4">{emp.position}</td>
                <td className="px-6 py-4">{emp.department}</td>
                <td className="px-6 py-4">{emp.email}</td>
                <td className="px-6 py-4">{emp.phone}</td>
                <td className="px-6 py-4">${emp.salary}</td>
                <td className="px-6 py-4 space-x-3">
                  <button className="text-blue-600 hover:underline text-sm" onClick={() => handleEditClick(emp)}>
                    Edit
                  </button>
                  <button className="text-red-600 hover:underline text-sm" onClick={() => handleDelete(emp._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit Form */}
      {editing && (
        <div className="mt-8 bg-gray-50 p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-3">Edit Employee</h2>
          <form onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["name", "position", "department", "email", "phone", "salary"].map((field) => (
              <input
                key={field}
                name={field}
                type={field === "salary" ? "number" : "text"}
                value={editForm[field]}
                onChange={handleEditChange}
                required
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                className="border px-3 py-2 rounded"
              />
            ))}
            <div className="col-span-full flex gap-4">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EmployeesPage;
