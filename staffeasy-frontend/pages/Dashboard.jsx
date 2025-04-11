import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useLocation } from 'react-router-dom'


const Dashboard = () => {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  const [employeeCount, setEmployeeCount] = useState(0)
  const [teamCount, setTeamCount] = useState(0)
  const [timeOffCount, setTimeOffCount] = useState(0)

  const [pendingCount, setPendingCount] = useState(0)
  const [totalPayroll, setTotalPayroll] = useState(0)
  const [error, setError] = useState('')


  useEffect(() => {

    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/employees')
        const employees = res.data

        setEmployeeCount(employees.length)

        const teams = new Set(employees.map(emp => emp.department))
        setTeamCount(teams.size)

        let timeOff = 0
        let pending = 0
        let payroll = 0

        employees.forEach(emp => {
          if (Array.isArray(emp.timeOffRequests)) {
            timeOff += emp.timeOffRequests.length
            pending += emp.timeOffRequests.filter(r => r.status === 'pending').length
          }

          payroll += emp.salary || 0
        })

        setTimeOffCount(timeOff)
        setPendingCount(pending)
        setTotalPayroll(payroll)

      } catch (err) {
        setError('Failed to load dashboard data.')
      }
    }

    fetchStats()
  }, [])


  const accessDenied = location.state?.accessDenied
  const accessMessage = location.state?.message


  let username = user?.username || 'User'
  try {
    if (!user) {
      const stored = JSON.parse(localStorage.getItem('staffeasy_user'))
      if (stored) {
        username = stored.username || stored.email || 'User'
      }
    }
  } catch (_) {}


  const dashboardCards = [

    {
      title: 'Employees',
      value: employeeCount,
      change: '+12%',
      positive: true,
      icon: '👥',
      bgColor: 'bg-blue-50'
    },

    {
      title: 'Teams',
      value: teamCount,
      change: '+1',
      positive: true,
      icon: '🏢',
      bgColor: 'bg-green-50'
    },

    {
      title: 'Time-off Requests',
      value: timeOffCount,
      change: `${pendingCount} pending`,
      positive: null,
      icon: '📅',
      bgColor: 'bg-yellow-50'
    },

    {
      title: 'Payroll',
      value: `$${totalPayroll.toLocaleString()}`,
      change: 'Next: Apr 15',
      positive: null,
      icon: '💰',
      bgColor: 'bg-purple-50'
    }

  ]


  return (
    <div className="max-w-6xl mx-auto">

      {accessDenied && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{accessMessage || 'You do not have permission to access the requested page.'}</p>
            </div>
          </div>
        </div>
      )}

      <section className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {username}
        </h1>
        <p className="text-gray-600">Here's what's happening with your organization today.</p>
      </section>


      {error && <p className="text-red-500 mb-4">{error}</p>}


      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardCards.map((card, i) => (
          <DashboardCard key={i} {...card} />
        ))}
      </section>


      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="bg-white rounded-lg shadow-md p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickAction icon="👤" title="Add Employee" path="/employees" />
          <QuickAction icon="🗂️" title="Manage Teams" path="/teams" />
          <QuickAction icon="📋" title="Review Time-off" path="/time-off" />
          <QuickAction icon="📊" title="View Analytics" path="/analytics" />
        </div>
      </section>


      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <p className="text-gray-500 mb-4">i accidentaly got rid of this part dont ask how</p>
      </section>
    </div>
  )
}


const DashboardCard = ({ title, value, change, positive, icon, bgColor }) => (
  <div className={`${bgColor} rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        {change && (
          <p className={`text-sm mt-1 ${positive === true ? 'text-green-600' : positive === false ? 'text-red-600' : 'text-gray-500'}`}>
            {change}
          </p>
        )}
      </div>
      <div className="text-3xl">{icon}</div>
    </div>
  </div>
)


const QuickAction = ({ icon, title, path }) => (
  <a href={path} className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-gray-50 transition-colors text-center">
    <span className="text-2xl mb-2">{icon}</span>
    <span className="text-sm font-medium text-gray-700">{title}</span>
  </a>
)


export default Dashboard
