import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        const allUsers = response.data;
        const found = allUsers.find(u => u.email === user.email);
        setProfile(found);
      } catch (err) {
        setError("Could not load profile.");
      }
    };

    if (user?.email) fetchProfile();
  }, [user]);

  if (!isAuthenticated) return <div className="text-center text-red-500">Access Denied</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      {error && <p className="text-red-500">{error}</p>}
      {profile ? (
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-700"><strong>Username:</strong> {profile.username}</p>
          <p className="text-gray-700"><strong>Email:</strong> {profile.email}</p>
          <p className="text-gray-700"><strong>Role:</strong> {profile.role}</p>
          <p className="text-gray-700"><strong>Joined:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default ProfilePage;
