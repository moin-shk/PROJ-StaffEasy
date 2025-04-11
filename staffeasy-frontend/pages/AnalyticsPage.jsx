import React, { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "../context/AuthContext"



const AnalyticsPage = () => {
  const { isAuthenticated } = useAuth()
  const [data, setData] = useState([])
  const [error, setError] = useState("")



  useEffect(() => {

    const fetchAnalytics = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/employees")
        const employees = res.data

        const grouped = {}

        employees.forEach(emp => {
          if (!grouped[emp.department]) {
            grouped[emp.department] = { count: 0, totalSalary: 0 }
          }

          grouped[emp.department].count += 1
          grouped[emp.department].totalSalary += emp.salary
        })


        const analytics = Object.entries(grouped).map(([dept, stats]) => ({
          department: dept,
          count: stats.count,
          averageSalary: Math.round(stats.totalSalary / stats.count)
        }))


        setData(analytics)

      } catch (err) {
        setError("Failed to load analytics data.")
      }
    }

    fetchAnalytics()

  }, [])



  if (!isAuthenticated) {
    return (
      <div className="text-center text-red-500">Access Denied</div>
    )
  }



  return (
    <div className="max-w-4xl mx-auto p-4">

      <h1 className="text-2xl font-bold mb-6">Department Analytics</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}


      {data.length === 0 ? (
        <p>No data available.</p>
      ) : (
        <table className="min-w-full bg-white shadow rounded overflow-hidden">

          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 uppercase">Department</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 uppercase">Employees</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 uppercase">Avg. Salary</th>
            </tr>
          </thead>


          <tbody>
            {data.map((d, i) => (
              <tr key={i} className="border-t">
                <td className="px-6 py-4 text-sm text-gray-900">{d.department}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{d.count}</td>
                <td className="px-6 py-4 text-sm text-gray-700">${d.averageSalary}</td>
              </tr>
            ))}
          </tbody>

        </table>
      )}

    </div>
  )
}


export default AnalyticsPage
