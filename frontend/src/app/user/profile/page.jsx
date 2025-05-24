'use client';
import { Users, Building } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function UserProfile() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [followedNGOs, setFollowedNGOs] = useState([]);
  const [followedSocialWorkers, setFollowedSocialWorkers] = useState([]);
  const [activeTab, setActiveTab] = useState('ngos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        // Decode token to get user ID
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        const userId = payload._id;

        // Setup axios config with token
        const config = {
          headers: { 'Authorization': `Bearer ${token}` }
        };

        // Fetch user data
        const userRes = await axios.get(`http://localhost:5000/user/getbyid/${userId}`, config);
        setUserData(userRes.data);

        // Fetch NGOs followed by user
        const followedNGOsRes = await axios.get(`http://localhost:5000/user/followed-ngos/${userId}`, config);
        setFollowedNGOs(followedNGOsRes.data || []);

        // Fetch social workers followed by user
        const followedSWRes = await axios.get(`http://localhost:5000/user/followed-socialworkers/${userId}`, config);
        setFollowedSocialWorkers(followedSWRes.data || []);

      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError(err.message);
        if (err.response?.status === 401) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-gray-800 font-medium mb-2">Failed to load profile</p>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-lime-500 text-white px-4 py-2 rounded-lg hover:bg-lime-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <p className="text-gray-800 font-medium">No profile data available</p>
        <button 
          onClick={() => router.push('/login')} 
          className="mt-4 bg-lime-500 text-white px-4 py-2 rounded-lg hover:bg-lime-600"
        >
          Login to View Profile
        </button>
      </div>
    );
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
              <Users size={64} className="text-blue-600" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold">{userData.name}</h1>
              <p className="text-gray-600">{userData.email}</p>
              <p className="text-sm text-gray-500">Member since {formatDate(userData.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex border-b overflow-x-auto">
          <button
            onClick={() => setActiveTab('ngos')}
            className={`px-4 py-2 font-medium ${activeTab === 'ngos'
              ? 'border-b-2 border-lime-500 text-lime-600'
              : 'text-gray-600'}`}
          >
            <div className="flex items-center">
              <Building className="mr-2" size={18} />
              Following NGOs {followedNGOs.length > 0 && 
                <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 rounded-full">
                  {followedNGOs.length}
                </span>
              }
            </div>
          </button>
          <button
            onClick={() => setActiveTab('socialworkers')}
            className={`px-4 py-2 font-medium ${activeTab === 'socialworkers'
              ? 'border-b-2 border-lime-500 text-lime-600'
              : 'text-gray-600'}`}
          >
            <div className="flex items-center">
              <Users className="mr-2" size={18} />
              Following Social Workers {followedSocialWorkers.length > 0 && 
                <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 rounded-full">
                  {followedSocialWorkers.length}
                </span>
              }
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {/* NGOs Tab */}
        {activeTab === 'ngos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {followedNGOs.length === 0 ? (
              <div className="col-span-full text-center py-8 bg-white rounded-lg shadow">
                <Building size={40} className="mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium text-gray-600">Not following any NGOs</p>
                <p className="text-gray-500 mt-2">When you follow NGOs, they'll appear here</p>
                <Link href="/explore" className="text-lime-600 hover:text-lime-800 mt-4 inline-block">
                  Explore NGOs
                </Link>
              </div>
            ) : (
              followedNGOs.map(ngo => (
                <div key={ngo._id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-100 rounded-full p-3 mr-4">
                      <Building size={24} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold">{ngo.ngo_name}</h3>
                      <p className="text-sm text-gray-500">{ngo.type_of_SocialWork}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{ngo.bio?.substring(0, 100)}...</p>
                  <Link 
                    href={`/ngo/${ngo._id}`}
                    className="text-lime-600 text-sm font-medium hover:text-lime-800"
                  >
                    View Profile
                  </Link>
                </div>
              ))
            )}
          </div>
        )}

        {/* Social Workers Tab */}
        {activeTab === 'socialworkers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {followedSocialWorkers.length === 0 ? (
              <div className="col-span-full text-center py-8 bg-white rounded-lg shadow">
                <Users size={40} className="mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium text-gray-600">Not following any social workers</p>
                <p className="text-gray-500 mt-2">When you follow social workers, they'll appear here</p>
                <Link href="/explore" className="text-lime-600 hover:text-lime-800 mt-4 inline-block">
                  Explore Social Workers
                </Link>
              </div>
            ) : (
              followedSocialWorkers.map(worker => (
                <div key={worker._id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-100 rounded-full p-3 mr-4">
                      <Users size={24} className="text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold">{worker.name}</h3>
                      <p className="text-sm text-gray-500">{worker.exp} years experience</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{worker.description?.substring(0, 100)}...</p>
                  <Link 
                    href={`/socialworker/${worker._id}`}
                    className="text-lime-600 text-sm font-medium hover:text-lime-800"
                  >
                    View Profile
                  </Link>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}