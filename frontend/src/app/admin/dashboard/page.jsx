"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Building, User, Users, MapPin, Calendar, Award, 
  Mail, FileText, CheckCircle, XCircle, Eye, Briefcase 
} from 'lucide-react';

// Reusable components
const DashboardCard = ({ children, className }) => (
  <div className={`bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow ${className}`}>
    {children}
  </div>
);

const StatusBadge = ({ verified }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
    verified ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
  }`}>
    {verified ? (
      <>
        <CheckCircle size={12} className="mr-1" />
        Verified
      </>
    ) : (
      <>
        <XCircle size={12} className="mr-1" />
        Pending
      </>
    )}
  </span>
);

const CardSection = ({ label, value, icon: Icon }) => (
  <div className="flex items-center text-gray-600 text-sm">
    {Icon && <Icon size={14} className="mr-1.5 flex-shrink-0 text-gray-500" />}
    <span className="font-medium mr-1">{label}:</span>
    <span className="truncate">{value || "Not specified"}</span>
  </div>
);

const Dashboard = () => {
  const [ngos, setNgos] = useState([]);
  const [socialWorkers, setSocialWorkers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalNGOs: 0,
    totalSocialWorkers: 0,
    totalUsers: 0,
    verifiedNGOs: 0,
    verifiedSocialWorkers: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [ngoRes, workerRes, userRes] = await Promise.all([
          axios.get('http://localhost:5000/ngo/getall', { timeout: 5000 }),
          axios.get('http://localhost:5000/socialworker/getall', { timeout: 5000 }),
          axios.get('http://localhost:5000/user/getall', { timeout: 5000 })
        ]);

        setNgos(ngoRes.data);
        setSocialWorkers(workerRes.data);
        setUsers(userRes.data);

        // Calculate stats
        setStats({
          totalNGOs: ngoRes.data.length,
          totalSocialWorkers: workerRes.data.length,
          totalUsers: userRes.data.length,
          verifiedNGOs: ngoRes.data.filter(ngo => ngo.isVerified).length,
          verifiedSocialWorkers: workerRes.data.filter(sw => sw.isVerified).length
        });
      } catch (error) {
        console.error('Data fetch error:', error);
        let errorMessage = 'Failed to fetch data. ';
        if (error.code === 'ECONNABORTED') {
          errorMessage += 'Request timed out. ';
        }
        if (!error.response) {
          errorMessage += 'Could not connect to the server. Please check if the backend server is running.';
        } else {
          errorMessage += error.response.data?.message || error.message;
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderNGOCard = (ngo) => (
    <DashboardCard key={ngo._id}>
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-lime-50 to-white">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="bg-lime-100 p-2 rounded-full">
              <Building size={20} className="text-lime-600" />
            </div>
            <h3 className="ml-2.5 text-lg font-bold text-gray-800">{ngo.ngo_name}</h3>
          </div>
          <StatusBadge verified={ngo.isVerified} />
        </div>
      </div>
      
      <div className="p-4 space-y-2.5">
        <CardSection label="Email" value={ngo.email} icon={Mail} />
        <CardSection label="Registration No" value={ngo.ngo_Registration_Number} icon={FileText} />
        <CardSection label="Work Area" value={ngo.geographic_area_of_Work} icon={MapPin} />
        <CardSection label="Type of Work" value={ngo.type_of_SocialWork} icon={Briefcase} />
        <CardSection label="Experience" value={`${ngo.year_of_experience || 0} years`} icon={Calendar} />
        
        <div className="flex justify-between items-center mt-4 pt-3 border-t">
          <div className="flex items-center text-xs text-gray-500">
            <Users size={12} className="mr-1" />
            <span>{ngo.followerCount || 0} followers</span>
          </div>
          
          <div className="flex space-x-2">
            <button 
              className="px-2 py-1 text-xs font-medium text-lime-700 hover:bg-lime-50 rounded"
              onClick={() => window.open(`/admin/ngo/${ngo._id}`, '_blank')}
            >
              <Eye size={14} className="inline mr-1" /> View
            </button>
            
            {!ngo.isVerified && (
              <button 
                className="px-2 py-1 text-xs font-medium bg-lime-500 text-white hover:bg-lime-600 rounded"
                onClick={() => handleVerify('ngo', ngo._id)}
              >
                <CheckCircle size={14} className="inline mr-1" /> Verify
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardCard>
  );

  const renderSocialWorkerCard = (worker) => (
    <DashboardCard key={worker._id}>
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="bg-purple-100 p-2 rounded-full">
              <User size={20} className="text-purple-600" />
            </div>
            <h3 className="ml-2.5 text-lg font-bold text-gray-800">{worker.name}</h3>
          </div>
          <StatusBadge verified={worker.isVerified} />
        </div>
      </div>
      
      <div className="p-4 space-y-2.5">
        <CardSection label="Email" value={worker.email} icon={Mail} />
        <CardSection label="Experience" value={`${worker.exp || 0} years`} icon={Calendar} />
        <CardSection label="Location" value={worker.address} icon={MapPin} />
        <CardSection label="Work Area" value={worker.geography} icon={Briefcase} />
        <CardSection label="Affiliated To" value={worker.affiliatedTo} icon={Building} />
        
        <div className="flex justify-between items-center mt-4 pt-3 border-t">
          <div className="flex items-center text-xs text-gray-500">
            <Users size={12} className="mr-1" />
            <span>{worker.followerCount || 0} followers</span>
          </div>
          
          <div className="flex space-x-2">
            <button 
              className="px-2 py-1 text-xs font-medium text-purple-700 hover:bg-purple-50 rounded"
              onClick={() => window.open(`/admin/socialworker/${worker._id}`, '_blank')}
            >
              <Eye size={14} className="inline mr-1" /> View
            </button>
            
            {!worker.isVerified && (
              <button 
                className="px-2 py-1 text-xs font-medium bg-lime-500 text-white hover:bg-lime-600 rounded"
                onClick={() => handleVerify('socialworker', worker._id)}
              >
                <CheckCircle size={14} className="inline mr-1" /> Verify
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardCard>
  );

  const renderUserCard = (user) => {
    return (
      <DashboardCard key={user._id}>
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-full">
              <User size={20} className="text-blue-600" />
            </div>
            <h3 className="ml-2.5 text-lg font-bold text-gray-800">{user.name}</h3>
          </div>
        </div>
        <div className="p-4 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            User ID: {user._id ? user._id.substring(0, 8) : ''}...
          </div>
          <button 
            className="px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-50 rounded"
            onClick={() => window.open(`/admin/user/${user._id}`, '_blank')}
          >
            <Eye size={14} className="inline mr-1" /> View
          </button>
        </div>
      </DashboardCard>
    );
  };

  // Handler for verifying NGOs and social workers
  const handleVerify = async (type, id) => {
    try {
      await axios.put(`http://localhost:5000/${type}/verify/${id}`, { isVerified: true });
      
      // Update the state to reflect the change immediately
      if (type === 'ngo') {
        setNgos(ngos.map(ngo => 
          ngo._id === id ? { ...ngo, isVerified: true } : ngo
        ));
        setStats({...stats, verifiedNGOs: stats.verifiedNGOs + 1});
      } else {
        setSocialWorkers(socialWorkers.map(worker => 
          worker._id === id ? { ...worker, isVerified: true } : worker
        ));
        setStats({...stats, verifiedSocialWorkers: stats.verifiedSocialWorkers + 1});
      }
    } catch (error) {
      console.error('Verification error:', error);
      alert('Failed to verify. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
        <p className="ml-3 text-lg text-gray-700">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center mb-2">
            <Building className="text-lime-500 mr-2" size={20} />
            <h3 className="text-gray-700 font-semibold">NGOs</h3>
          </div>
          <div className="text-2xl font-bold">{stats.totalNGOs}</div>
          <div className="text-xs text-gray-500 mt-1">
            {stats.verifiedNGOs} verified, {stats.totalNGOs - stats.verifiedNGOs} pending
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center mb-2">
            <Users className="text-purple-500 mr-2" size={20} />
            <h3 className="text-gray-700 font-semibold">Social Workers</h3>
          </div>
          <div className="text-2xl font-bold">{stats.totalSocialWorkers}</div>
          <div className="text-xs text-gray-500 mt-1">
            {stats.verifiedSocialWorkers} verified, {stats.totalSocialWorkers - stats.verifiedSocialWorkers} pending
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center mb-2">
            <User className="text-blue-500 mr-2" size={20} />
            <h3 className="text-gray-700 font-semibold">Users</h3>
          </div>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
          <div className="text-xs text-gray-500 mt-1">
            {stats.totalUsers} registered users
          </div>
        </div>
      </div>

      {/* NGOs section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">NGOs ({ngos.length})</h2>
          {/* Add search or filter options here if needed */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ngos.map(ngo => renderNGOCard(ngo))}
        </div>
      </div>

      {/* Social Workers section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Social Workers ({socialWorkers.length})</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {socialWorkers.map(worker => renderSocialWorkerCard(worker))}
        </div>
      </div>

      {/* Users section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Users ({users.length})</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {users.map(user => renderUserCard(user))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
