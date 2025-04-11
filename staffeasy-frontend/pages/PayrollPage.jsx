import React, { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "../context/AuthContext"



const PayrollPage = () => {
  const { isAuthenticated } = useAuth()

  const [employees, setEmployees] = useState([])
  const [error, setError] = useState("")


  useEffect(() => {
    const fetchPayrollData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/employees")
        setEmployees(response.data)
      } catch (err) {
        setError("Failed to load payroll data.")
      }
    }

    fetchPayrollData()
  }, [])


  if (!isAuthenticated) {
    return (
      <div className="text-center text-red-500">Access Denied</div>
    )
  }


  return (
    <div className="max-w-6xl mx-auto p-4">

      <h1 className="text-2xl font-bold mb-6">Payroll</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}


      {employees.length === 0 ? (
        <p>No payroll data available.</p>
      ) : (

        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 uppercase">Name</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 uppercase">Email</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 uppercase">Salary</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 uppercase">Last Increment</th>
            </tr>
          </thead>

          <tbody>
            {employees.map(emp => {
              const last = emp.increments?.length
                ? new Date(emp.increments[emp.increments.length - 1].incrementDate).toLocaleDateString()
                : "—"

              return (
                <tr key={emp._id} className="border-t">
                  <td className="px-6 py-4 text-sm text-gray-900">{emp.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{emp.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">${emp.salary}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{last}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}



export default PayrollPage
