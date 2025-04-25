'use client';
import { useState, useEffect } from 'react';
import { User, Heart, MessageSquare, Share2, Building, Users } from 'lucide-react';

export default function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [followedNGOs, setFollowedNGOs] = useState([]);
  const [followedSocialWorkers, setFollowedSocialWorkers] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [activeTab, setActiveTab] = useState('ngos');

  useEffect(() => {
    // In a real app, this would be an API call to fetch user data
    setUserData({
      name: "Jane Doe",
      email: "jane.doe@example.com",
      createdAt: "2023-04-15T00:00:00Z"
    });

    // Mock data for followed NGOs
    setFollowedNGOs([
      { id: 1, name: "Save The Children", bio: "Working for children's rights", type_of_SocialWork: "Child welfare" },
      { id: 2, name: "Red Cross", bio: "Humanitarian services", type_of_SocialWork: "Disaster relief" },
      { id: 3, name: "WWF", bio: "Wildlife conservation", type_of_SocialWork: "Environmental protection" }
    ]);

    // Mock data for followed social workers
    setFollowedSocialWorkers([
      { id: 1, name: "John Smith", bio: "Mental health specialist", year_of_experience: 8 },
      { id: 2, name: "Mary Johnson", bio: "Community outreach coordinator", year_of_experience: 12 },
      { id: 3, name: "David Lee", bio: "Youth counselor", year_of_experience: 5 }
    ]);

    // Mock data for interactions
    setInteractions([
      { 
        id: 1, 
        type: "like", 
        postTitle: "Community Cleanup Drive", 
        author: "Save The Children", 
        date: "2024-04-20T10:30:00Z",
        content: "Join us this weekend for our community cleanup initiative!"
      },
      { 
        id: 2, 
        type: "comment", 
        postTitle: "Mental Health Awareness Seminar", 
        author: "John Smith", 
        date: "2024-04-18T14:45:00Z",
        content: "Learn about managing stress and anxiety in our upcoming online seminar."
      },
      { 
        id: 3, 
        type: "share", 
        postTitle: "Fundraising for Flood Victims", 
        author: "Red Cross", 
        date: "2024-04-15T09:15:00Z",
        content: "Help us raise funds for families affected by recent flooding in the region."
      }
    ]);
  }, []);

  if (!userData) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getInteractionIcon = (type) => {
    switch (type) {
      case 'like': return <Heart className="text-red-500" size={18} />;
      case 'comment': return <MessageSquare className="text-blue-500" size={18} />;
      case 'share': return <Share2 className="text-green-500" size={18} />;
      default: return null;
    }
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
              <h1 className="text-2xl font-bold">{userData.name}</h1>
              <p className="text-gray-600">{userData.email}</p>
              <p className="text-sm text-gray-500">Member since {formatDate(userData.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('ngos')}
            className={`px-4 py-2 font-medium ${activeTab === 'ngos' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-600'}`}
          >
            <div className="flex items-center">
              <Building size={18} className="mr-2" />
              Following NGOs
            </div>
          </button>
          <button
            onClick={() => setActiveTab('socialworkers')}
            className={`px-4 py-2 font-medium ${activeTab === 'socialworkers' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-600'}`}
          >
            <div className="flex items-center">
              <Users size={18} className="mr-2" />
              Following Social Workers
            </div>
          </button>
          <button
            onClick={() => setActiveTab('interactions')}
            className={`px-4 py-2 font-medium ${activeTab === 'interactions' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-600'}`}
          >
            <div className="flex items-center">
              <Heart size={18} className="mr-2" />
              Interactions
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {/* NGOs Tab */}
        {activeTab === 'ngos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {followedNGOs.map(ngo => (
              <div key={ngo.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 rounded-full p-3 mr-4">
                    <Building size={24} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold">{ngo.name}</h3>
                    <p className="text-sm text-gray-500">{ngo.type_of_SocialWork}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{ngo.bio}</p>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                  View Profile
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Social Workers Tab */}
        {activeTab === 'socialworkers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {followedSocialWorkers.map(worker => (
              <div key={worker.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 rounded-full p-3 mr-4">
                    <User size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold">{worker.name}</h3>
                    <p className="text-sm text-gray-500">{worker.year_of_experience} years experience</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{worker.bio}</p>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                  View Profile
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Interactions Tab */}
        {activeTab === 'interactions' && (
          <div className="space-y-6">
            {interactions.map(interaction => (
              <div key={interaction.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {getInteractionIcon(interaction.type)}
                    <span className="ml-2 text-sm font-medium capitalize">
                      You {interaction.type}d this post
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{formatDate(interaction.date)}</span>
                </div>
                <h3 className="font-bold mb-2">{interaction.postTitle}</h3>
                <p className="text-gray-600 mb-4">{interaction.content}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Posted by {interaction.author}</span>
                  <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                    View Post
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}