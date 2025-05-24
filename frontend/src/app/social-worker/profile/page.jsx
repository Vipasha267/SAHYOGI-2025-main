'use client';
import { useState, useEffect } from 'react';
import { User, MapPin, Briefcase, Clock, Award, Bookmark, Calendar, Users, Heart, MessageSquare, Building, ExternalLink } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SocialWorkerProfile() {
  const [workerData, setWorkerData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [activeTab, setActiveTab] = useState('about');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          router.push('/socialworker-login');
          return;
        }
        
        // Decode token to get user info
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const userData = JSON.parse(window.atob(base64));
        
        // Fetch user profile data
        const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/socialworker/getbyid/${userData._id}`);
        setWorkerData(userResponse.data);
        
        // Fetch posts created by this social worker
        const postsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/posts/getbyauthor/${userData._id}`);
        setPosts(postsResponse.data);
        
        // For followers, you can implement this API later
        // Use mock data for now
        setFollowers([
          { id: 1, name: "Jane Doe", type: "user" },
          { id: 2, name: "Save The Children", type: "ngo" },
          { id: 3, name: "Mary Johnson", type: "user" },
          { id: 4, name: "Urban Youth Support Network", type: "ngo" }
        ]);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (isLoading || !workerData) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading profile...</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Function to get post icon based on type
  const getPostIcon = (type) => {
    switch (type) {
      case 'article':
        return <Briefcase className="text-blue-500" size={18} />;
      case 'story':
        return <MessageSquare className="text-green-500" size={18} />;
      case 'guide':
        return <Calendar className="text-purple-500" size={18} />;
      case 'video':
        return <Users className="text-red-500" size={18} />;
      case 'infographic':
        return <Clock className="text-amber-500" size={18} />;
      default:
        return <Bookmark className="text-gray-500" size={18} />;
    }
  };
  
  // Function to truncate text with ellipsis
  const truncateText = (text, maxLength = 150) => {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
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
              <p className="text-sm text-gray-500">{workerData.exp || 0} years of experience</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Link href="/social-worker/add-post">
                <button className="bg-lime-600 hover:bg-lime-700 text-white font-medium py-2 px-4 rounded-lg flex items-center">
                  <span className="mr-1">+</span> New Post
                </button>
              </Link>
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
            Posts {posts.length > 0 && <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 rounded-full">{posts.length}</span>}
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
                <p className="text-gray-600">{workerData.description || "No bio available."}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Contact Information</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-600">
                      <MapPin size={18} className="mr-2 text-gray-500" />
                      {workerData.address || "No address provided"}
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
                      Affiliated with: {workerData.affiliatedTo || "Independent"}
                    </li>
                    <li className="flex items-center text-gray-600">
                      <MapPin size={18} className="mr-2 text-gray-500" />
                      Working in: {workerData.geography || "Not specified"}
                    </li>
                    <li className="flex items-center text-gray-600">
                      <Clock size={18} className="mr-2 text-gray-500" />
                      {workerData.exp || 0} years of experience
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
              <div className="bg-white rounded-lg shadow p-6 text-gray-500 text-center py-12">
                <Bookmark size={40} className="mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium">No posts yet</p>
                <p className="mt-2">You haven't published any content yet.</p>
                <Link href="/social-worker/add-post">
                  <button className="mt-6 bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded-md">
                    Create Your First Post
                  </button>
                </Link>
              </div>
            ) : (
              posts.map(post => (
                <div key={post._id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        {getPostIcon(post.type)}
                        <span className="text-xs uppercase tracking-wide bg-gray-100 text-gray-700 px-2 py-1 rounded ml-2">
                          {post.type}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">{formatDate(post.date)}</span>
                    </div>
                    
                    <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                    
                    {/* Post tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Content preview */}
                    {post.content && (
                      <p className="text-gray-600 mb-4">{truncateText(post.content)}</p>
                    )}
                    
                    {/* For success stories, show impact */}
                    {post.type === 'story' && post.impact && (
                      <div className="bg-green-50 border-l-4 border-green-400 p-3 mb-4">
                        <p className="text-sm text-green-700">
                          <span className="font-medium">Impact:</span> {truncateText(post.impact, 100)}
                        </p>
                      </div>
                    )}
                    
                    {/* Organization for stories */}
                    {post.type === 'story' && post.organization && (
                      <div className="flex items-center text-sm text-gray-600 mb-4">
                        <Users size={16} className="mr-2 text-gray-500" />
                        <span>Organization: <span className="font-medium">{post.organization}</span></span>
                      </div>
                    )}
                    
                    {/* Engagement metrics and action button */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex space-x-4">
                        <span className="flex items-center text-gray-500 text-sm">
                          <Heart size={16} className="mr-1" /> {post.likes || 0}
                        </span>
                        <span className="flex items-center text-gray-500 text-sm">
                          <MessageSquare size={16} className="mr-1" /> Views: {post.views || 0}
                        </span>
                      </div>
                      <Link href={`/posts/${post._id}`}>
                        <button className="text-lime-600 text-sm font-medium hover:text-lime-800">
                          View Full Post
                        </button>
                      </Link>
                    </div>
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