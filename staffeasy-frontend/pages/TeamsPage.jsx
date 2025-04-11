import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const TeamsPage = () => {
  const { isAuthenticated } = useAuth();
  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teamRes = await axios.get('http://localhost:5000/api/teams');
        const empRes = await axios.get('http://localhost:5000/api/employees');
        setTeams(teamRes.data);
        setEmployees(empRes.data);
      } catch (err) {
        setMessage('Failed to load data');
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleMemberToggle = (id) => {
    setSelectedMembers(prev =>
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/teams', {
        name: teamName,
        members: selectedMembers,
      });
      setMessage('✅ Team created!');
      setTeamName('');
      setSelectedMembers([]);
      const updated = await axios.get('http://localhost:5000/api/teams');
      setTeams(updated.data);
    } catch (err) {
      setMessage('❌ Failed to create team.');
      console.error(err);
    }
  };

  if (!isAuthenticated) return <div className="text-center text-red-500">Access Denied</div>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Teams</h1>

      <div className="bg-white shadow rounded p-4 mb-8">
        <h2 className="text-lg font-semibold mb-2">Create New Team</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />

          <div>
            <p className="mb-2 font-medium">Select Members:</p>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {employees.map(emp => (
                <label key={emp._id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={emp._id}
                    checked={selectedMembers.includes(emp._id)}
                    onChange={() => handleMemberToggle(emp._id)}
                  />
                  <span>{emp.name} – {emp.position}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Create Team
          </button>
        </form>
        {message && <p className="mt-3 text-sm text-gray-600">{message}</p>}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">All Teams</h2>
        {teams.length === 0 ? (
          <p>No teams found.</p>
        ) : (
          teams.map(team => (
            <div key={team._id} className="mb-6 bg-white p-4 shadow rounded border">
              <h3 className="text-xl font-semibold mb-2">{team.name}</h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                {team.members.length > 0 ? (
                  team.members.map(member => (
                    <li key={member._id}>{member.name} – {member.position}</li>
                  ))
                ) : (
                  <li>No members assigned.</li>
                )}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeamsPage;
