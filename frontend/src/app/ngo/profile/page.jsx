'use client';
import { useState, useEffect } from 'react';
import { Building, MapPin, Briefcase, Clock, Bookmark, Calendar, User, Users } from 'lucide-react';

export default function NGOProfile() {
  const [ngoData, setNgoData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    // In a real app, this would be an API call to fetch NGO data
    setNgoData({
      name: "Save The Children",
      email: "contact@savethechildren.org",
      Role: "organization",
      bio: "Working to improve the lives of children around the world through better education, health care, and economic opportunities.",
      Government_ID: 123456789,
      address: "123 Charity Way, New York, NY 10001",
      type_of_SocialWork: "Child welfare & education",
      year_of_experience: 15,
      ngo_name: "Save The Children Foundation",
      ngo_Registration_Number: 987654321,
      geographic_area_of_Work: "Global, with focus on developing countries",
      proof_of_work: "Annual impact reports available on website",
      createdAt: "2010-06-12T00:00:00Z"
    });

    // Mock data for posts
    setPosts([
      {
        id: 1,
        title: "School Building Project Completed",
        content: "We're proud to announce the completion of our newest school building project in rural Tanzania. This school will serve over 300 children who previously had to walk more than 5 miles to access education.",
        date: "2024-04-15T09:00:00Z",
        likes: 156,
        comments: 24
      },
      {
        id: 2,
        title: "Volunteers Needed for Summer Camp",
        content: "We're looking for dedicated volunteers to help with our annual summer camp for underprivileged children. The camp runs for 3 weeks in July and provides educational activities, sports, and meals.",
        date: "2024-04-10T14:30:00Z",
        likes: 89,
        comments: 32
      },
      {
        id: 3,
        title: "Fundraising Goal Reached!",
        content: "Thanks to the generosity of our supporters, we've reached our quarterly fundraising goal! These funds will help us expand our nutrition program to 5 additional communities.",
        date: "2024-04-05T11:15:00Z",
        likes: 215,
        comments: 47
      }
    ]);

    // Mock data for followers
    setFollowers([
      { id: 1, name: "Jane Doe", type: "user" },
      { id: 2, name: "John Smith", type: "socialworker" },
      { id: 3, name: "Mary Johnson", type: "user" },
      { id: 4, name: "David Lee", type: "socialworker" }
    ]);
  }, []);

  if (!ngoData) {
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
            <div className="bg-green-100 rounded-full p-6 mb-4 md:mb-0 md:mr-6">
              <Building size={64} className="text-green-600" />
            </div>
            <div className="text-center md:text-left md:flex-1">
              <h1 className="text-2xl font-bold">{ngoData.ngo_name}</h1>
              <p className="text-gray-600">{ngoData.type_of_SocialWork}</p>
              <p className="text-sm text-gray-500">Active since {formatDate(ngoData.createdAt)}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg">
                Follow
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex border-b overflow-x-auto">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'about' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-600'}`}
          >
            About
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'posts' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-600'}`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab('followers')}
            className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'followers' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-600'}`}
          >
            Followers
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-6">About {ngoData.ngo_name}</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Bio</h3>
                <p className="text-gray-600">{ngoData.bio}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Contact Information</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-600">
                      <MapPin size={18} className="mr-2 text-gray-500" />
                      {ngoData.address}
                    </li>
                    <li className="flex items-center text-gray-600">
                      <Briefcase size={18} className="mr-2 text-gray-500" />
                      {ngoData.email}
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">NGO Details</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-600">
                      <Bookmark size={18} className="mr-2 text-gray-500" />
                      Registration #: {ngoData.ngo_Registration_Number}
                    </li>
                    <li className="flex items-center text-gray-600">
                      <MapPin size={18} className="mr-2 text-gray-500" />
                      {ngoData.geographic_area_of_Work}
                    </li>
                    <li className="flex items-center text-gray-600">
                      <Clock size={18} className="mr-2 text-gray-500" />
                      {ngoData.year_of_experience} years of experience
                    </li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Proof of Work</h3>
                <p className="text-gray-600">{ngoData.proof_of_work}</p>
              </div>
            </div>
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">{post.title}</h3>
                  <span className="text-sm text-gray-500">{formatDate(post.date)}</span>
                </div>
                <p className="text-gray-600 mb-4">{post.content}</p>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex space-x-4">
                    <span className="flex items-center text-gray-500 text-sm">
                      <Bookmark size={16} className="mr-1" /> {post.likes} likes
                    </span>
                    <span className="flex items-center text-gray-500 text-sm">
                      <Calendar size={16} className="mr-1" /> {post.comments} comments
                    </span>
                  </div>
                  <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                    View Post
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Followers Tab */}
        {activeTab === 'followers' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-6">Followers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {followers.map(follower => (
                <div key={follower.id} className="flex items-center p-4 border rounded-lg">
                  <div className={`rounded-full p-3 mr-3 ${
                    follower.type === 'user' ? 'bg-blue-100' : 'bg-purple-100'
                  }`}>
                    {follower.type === 'user' ? (
                      <User size={20} className="text-blue-600" />
                    ) : (
                      <Users size={20} className="text-purple-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{follower.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{follower.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}