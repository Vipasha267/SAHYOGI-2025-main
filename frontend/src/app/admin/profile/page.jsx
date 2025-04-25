'use client';
import { useState, useEffect } from 'react';
import { User, Briefcase, Settings, Users, Building } from 'lucide-react';

export default function AdminProfile() {
  const [adminData, setAdminData] = useState(null);
  const [managedUsers, setManagedUsers] = useState([]);
  const [managedNGOs, setManagedNGOs] = useState([]);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    // Mock admin data
    setAdminData({
      name: "Admin Name",
      email: "admin@example.com",
      role: "Administrator",
      createdAt: "2022-01-01T00:00:00Z"
    });

    // Mock data for managed users
    setManagedUsers([
      { id: 1, name: "Jane Doe", email: "jane.doe@example.com" },
      { id: 2, name: "John Smith", email: "john.smith@example.com" }
    ]);

    // Mock data for managed NGOs
    setManagedNGOs([
      { id: 1, name: "Save The Children", type: "Child welfare" },
      { id: 2, name: "Red Cross", type: "Disaster relief" }
    ]);
  }, []);

  if (!adminData) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header/Profile Info */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="bg-blue-100 rounded-full p-6 mb-4 md:mb-0 md:mr-6">
              <User size={64} className="text-blue-600" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold">{adminData.name}</h1>
              <p className="text-gray-600">{adminData.email}</p>
              <p className="text-sm text-gray-500">Role: {adminData.role}</p>
              <p className="text-sm text-gray-500">Member since {formatDate(adminData.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 font-medium ${activeTab === 'users' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-600'}`}
          >
            <div className="flex items-center">
              <Users size={18} className="mr-2" />
              Managed Users
            </div>
          </button>
          <button
            onClick={() => setActiveTab('ngos')}
            className={`px-4 py-2 font-medium ${activeTab === 'ngos' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-600'}`}
          >
            <div className="flex items-center">
              <Building size={18} className="mr-2" />
              Managed NGOs
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Managed Users Tab */}
        {activeTab === 'users' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {managedUsers.map(user => (
              <div key={user.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
                <h3 className="font-bold">{user.name}</h3>
                <p className="text-gray-600">{user.email}</p>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                  View Profile
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Managed NGOs Tab */}
        {activeTab === 'ngos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {managedNGOs.map(ngo => (
              <div key={ngo.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
                <h3 className="font-bold">{ngo.name}</h3>
                <p className="text-gray-600">{ngo.type}</p>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                  View Profile
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}