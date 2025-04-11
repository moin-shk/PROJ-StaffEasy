import React, { useState } from 'react';
import axios from 'axios';

export default function AddEmployeeForm() {
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
      const response = await axios.post('http://localhost:5000/api/employees', {
        ...formData,
        salary: parseFloat(formData.salary),
        salaryHistory: [],
        timeOffRequests: [],
        reports: [],
        increments: [],
      });
      setSuccessMsg('Employee added successfully!');
      setErrorMsg('');
      console.log(response.data);
    } catch (error) {
      setErrorMsg('Failed to add employee.');
      setSuccessMsg('');
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Add New Employee</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        {['name', 'position', 'department', 'email', 'phone', 'salary'].map((field) => (
          <input
            key={field}
            type={field === 'salary' ? 'number' : 'text'}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={formData[field]}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        ))}

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Employee
        </button>
      </form>

      {successMsg && <p className="text-green-600 mt-3">{successMsg}</p>}
      {errorMsg && <p className="text-red-600 mt-3">{errorMsg}</p>}
    </div>
  );
}
