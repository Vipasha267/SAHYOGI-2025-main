'use client';
import { useState, useEffect } from 'react';
import { User, MapPin, Briefcase, Clock, Award, Bookmark, Calendar, Users, Heart, MessageSquare, Building } from 'lucide-react';

export default function SocialWorkerProfile() {
  const [workerData, setWorkerData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    // In a real app, this would be an API call to fetch social worker data
    setWorkerData({
      name: "John Smith",
      email: "john.smith@example.com",
      Role: "socialworker",
      bio: "Dedicated mental health specialist with over 8 years of experience working with at-risk youth and families in urban communities.",
      Government_ID: 234567890,
      address: "456 Helper Lane, Chicago, IL 60601",
      type_of_SocialWork: "Mental health counseling",
      year_of_experience: 8,
      ngo_name: "Urban Youth Support Network",
      geographic_area_of_Work: "Chicago metropolitan area",
      proof_of_work: "Certified by the American Board of Professional Counselors",
      createdAt: "2016-09-05T00:00:00Z"
    });

    // Mock data for posts
    setPosts([
      {
        id: 1,
        title: "Managing Anxiety in Teens Workshop",
        content: "I'll be hosting a free workshop next Saturday on strategies for helping teenagers manage anxiety and stress. This is open to parents, educators, and teens themselves.",
        date: "2024-04-18T14:45:00Z",
        likes: 42,
        comments: 8
      },
      {
        id: 2,
        title: "Community Mental Health Resources",
        content: "Here's a compilation of free and low-cost mental health resources available in our community. These include crisis hotlines, support groups, and sliding-scale therapy options.",
        date: "2024-04-10T09:30:00Z",
        likes: 78,
        comments: 15
      },
      {
        id: 3,
        title: "School Counseling Program Success",
        content: "The pilot counseling program we implemented at Jefferson High School has completed its first semester, and the results are promising. Student self-reports show a 30% reduction in stress levels.",
        date: "2024-04-02T16:15:00Z",
        likes: 63,
        comments: 11
      }
    ]);

    // Mock data for followers
    setFollowers([
      { id: 1, name: "Jane Doe", type: "user" },
      { id: 2, name: "Save The Children", type: "ngo" },
      { id: 3, name: "Mary Johnson", type: "user" },
      { id: 4, name: "Urban Youth Support Network", type: "ngo" }
    ]);
  }, []);

  if (!workerData) {
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
            <div className="bg-purple-100 rounded-full p-6 mb-4 md:mb-0 md:mr-6">
              <User size={64} className="text-lime-600" />
            </div>
            <div className="text-center md:text-left md:flex-1">
              <h1 className="text-2xl font-bold">{workerData.name}</h1>
              <p className="text-gray-600">{workerData.type_of_SocialWork}</p>
              <p className="text-sm text-gray-500">{workerData.year_of_experience} years of experience</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button className="bg-lime-600 hover:bg-lime-700 text-white font-medium py-2 px-4 rounded-lg">
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
              ? 'border-b-2 border-lime-500 text-lime-600' 
              : 'text-gray-600'}`}
          >
            About
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'posts' 
              ? 'border-b-2 border-lime-500 text-lime-600' 
              : 'text-gray-600'}`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab('followers')}
            className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'followers' 
              ? 'border-b-2 border-lime-500 text-lime-600' 
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
            <h2 className="text-xl font-bold mb-6">About {workerData.name}</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Bio</h3>
                <p className="text-gray-600">{workerData.bio}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Contact Information</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-600">
                      <MapPin size={18} className="mr-2 text-gray-500" />
                      {workerData.address}
                    </li>
                    <li className="flex items-center text-gray-600">
                      <Briefcase size={18} className="mr-2 text-gray-500" />
                      {workerData.email}
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Professional Details</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-600">
                      <Users size={18} className="mr-2 text-gray-500" />
                      Affiliated with: {workerData.ngo_name}
                    </li>
                    <li className="flex items-center text-gray-600">
                      <MapPin size={18} className="mr-2 text-gray-500" />
                      Working in: {workerData.geographic_area_of_Work}
                    </li>
                    <li className="flex items-center text-gray-600">
                      <Clock size={18} className="mr-2 text-gray-500" />
                      {workerData.year_of_experience} years of experience
                    </li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Credentials</h3>
                <div className="flex items-center">
                  <Award size={18} className="mr-2 text-yellow-500" />
                  <p className="text-gray-600">{workerData.proof_of_work}</p>
                </div>
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
                      <Heart size={16} className="mr-1" /> {post.likes} likes
                    </span>
                    <span className="flex items-center text-gray-500 text-sm">
                      <MessageSquare size={16} className="mr-1" /> {post.comments} comments
                    </span>
                  </div>
                  <button className="text-lime-600 text-sm font-medium hover:text-lime-800">
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
                    follower.type === 'user' ? 'bg-blue-100' : 
                    follower.type === 'ngo' ? 'bg-green-100' : 'bg-purple-100'
                  }`}>
                    {follower.type === 'user' ? (
                      <User size={20} className="text-lime-600" />
                    ) : follower.type === 'ngo' ? (
                      <Building size={20} className="text-green-600" />
                    ) : (
                      <Users size={20} className="text-lime-600" />
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