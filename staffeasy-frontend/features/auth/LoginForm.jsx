import React, { useState } from 'react';

export default function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting login:", form);
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      console.log("Response:", data);
      if (!response.ok) {
        setMessage(data.message || 'Login failed');
      } else {
        setMessage('Login successful');
      }
    } catch (error) {
      console.error("Error during login:", error);
      setMessage('An error occurred during login.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">Login</h2>
      
      <label className="block mb-2 font-medium text-gray-600">Email</label>
      <input 
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 rounded p-2 mb-4"
      />
      
      <label className="block mb-2 font-medium text-gray-600">Password</label>
      <input 
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 rounded p-2 mb-4"
      />
      
      <button 
        type="submit"
        className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        Login
      </button>
      
      {message && <p className="mt-4 text-center text-red-600">{message}</p>}
    </form>
  );
}
