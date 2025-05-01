'use client';
import { useState, useEffect } from 'react';
import { User, MapPin, Briefcase, Clock, Bookmark, Calendar, Users } from 'lucide-react';
import { useParams } from 'next/navigation';
import axios from 'axios';

export default function SocialWorkerProfile() {
  const { id } = useParams();

  const [workerData, setWorkerData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [activeTab, setActiveTab] = useState('about');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/socialworker/getbyid/${id}`)
      .then(res => {
        setWorkerData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // You can fetch posts and followers here if you have APIs for them
    // setPosts([...]);
    // setFollowers([...]);
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!workerData) {
    return <div className="flex justify-center items-center h-screen text-red-500">Social Worker not found.</div>;
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
              <p className="text-gray-600">{workerData.geography}</p>
              <p className="text-sm text-gray-500">Active since {formatDate(workerData.createdAt)}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button className="bg-lime-500 hover:bg-lime-700 text-white font-medium py-2 px-4 rounded-lg">
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
                <h3 className="font-medium text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600">{workerData.description}</p>
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
                      Affiliated with: {workerData.affiliatedTo}
                    </li>
                    <li className="flex items-center text-gray-600">
                      <MapPin size={18} className="mr-2 text-gray-500" />
                      Work Area: {workerData.geography}
                    </li>
                    <li className="flex items-center text-gray-600">
                      <Clock size={18} className="mr-2 text-gray-500" />
                      {workerData.exp} years of experience
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            {posts.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-gray-500 text-center">
                No posts available.
              </div>
            ) : (
              posts.map(post => (
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
                    <button className="text-lime-600 text-sm font-medium hover:text-lime-800">
                      View Post
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Followers Tab */}
        {activeTab === 'followers' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-6">Followers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {followers.length === 0 ? (
                <div className="text-gray-500 col-span-full text-center">No followers yet.</div>
              ) : (
                followers.map(follower => (
                  <div key={follower.id} className="flex items-center p-4 border rounded-lg">
                    <div className={`rounded-full p-3 mr-3 ${
                      follower.type === 'user' ? 'bg-blue-100' : 'bg-purple-100'
                    }`}>
                      {follower.type === 'user' ? (
                        <User size={20} className="text-lime-600" />
                      ) : (
                        <Users size={20} className="text-lime-700" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{follower.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{follower.type}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}