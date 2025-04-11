import React, { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "../context/AuthContext"


const TeamsPage = () => {
  const { isAuthenticated } = useAuth()
  const [teams, setTeams] = useState({})
  const [error, setError] = useState("")


  useEffect(() => {

    const fetchTeams = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/employees")
        const employees = res.data

        const grouped = employees.reduce((acc, emp) => {
          if (!acc[emp.department]) {
            acc[emp.department] = []
          }
          acc[emp.department].push(emp)
          return acc
        }, {})

        setTeams(grouped)

      } catch (err) {
        setError("Failed to load teams.")
      }
    }

    fetchTeams()

  }, [])



  if (!isAuthenticated) return (
    <div className="text-center text-red-500">Access Denied</div>
  )


  return (
    <div className="max-w-6xl mx-auto p-4">

      <h1 className="text-2xl font-bold mb-6">Teams</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}


      {Object.keys(teams).length === 0 ? (
        <p>No team data found.</p>
      ) : (

        Object.entries(teams).map(([dept, members]) => (
          <div key={dept} className="mb-8 bg-white shadow p-4 rounded border">
            <h2 className="text-xl font-semibold mb-3">{dept}</h2>
            <ul className="space-y-1">
              {members.map(emp => (
                <li key={emp._id} className="text-sm text-gray-700">
                  {emp.name} – {emp.position}
                </li>
              ))}
            </ul>
          </div>
        ))

      )}

    </div>
  )
}


export default TeamsPage
    