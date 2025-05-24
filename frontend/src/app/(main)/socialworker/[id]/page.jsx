'use client';
import { useState, useEffect } from 'react';
import { Users, User, Building, MapPin, Calendar, MessageCircle, Eye, ThumbsUp, UserPlus, UserMinus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function SocialWorkerProfile() {
  const { id } = useParams();
  const router = useRouter();

  const [workerData, setWorkerData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [activeTab, setActiveTab] = useState('about');
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [followersLoading, setFollowersLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followActionLoading, setFollowActionLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const token = localStorage.getItem('token');
        let userData = null;
        
        if (token) {
          try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            userData = JSON.parse(window.atob(base64));
            setCurrentUser(userData);
          } catch (error) {
            console.error('Error parsing token:', error);
          }
        }
        
        // Fetch social worker data
        const workerResponse = await axios.get(`http://localhost:5000/socialworker/getbyid/${id}`);
        setWorkerData(workerResponse.data);
        
        // Fetch posts by author id
        setPostsLoading(true);
        const postsResponse = await axios.get(`http://localhost:5000/posts/getbyauthor/${id}`);
        setPosts(postsResponse.data);
        setPostsLoading(false);
        
        // Fetch followers if on followers tab
        if (activeTab === 'followers') {
          await fetchFollowers();
        }
        
        // Check if current user is following this social worker
        if (token && userData && workerResponse.data.followers) {
          const isAlreadyFollowing = workerResponse.data.followers.some(
            follower => follower.followerId === userData._id
          );
          setIsFollowing(isAlreadyFollowing);
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, activeTab]);

  const fetchFollowers = async () => {
    try {
      setFollowersLoading(true);
      const followersResponse = await axios.get(`http://localhost:5000/socialworker/followers/${id}`);
      setFollowers(followersResponse.data || []);
    } catch (error) {
      console.error('Error fetching followers:', error);
      toast.error('Failed to load followers');
    } finally {
      setFollowersLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!currentUser) {
      const userType = localStorage.getItem('userType');
      if (!userType) {
        toast.error('Please log in to follow social workers');
        router.push('/login');
        return;
      }
      router.push(`/${userType}-login`);
      return;
    }

    try {
      setFollowActionLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Authentication required');
        router.push('/login');
        return;
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      if (isFollowing) {
        // Unfollow action
        await axios.post(`http://localhost:5000/socialworker/unfollow/${id}`, {}, config);
        setIsFollowing(false);
        toast.success(`Unfollowed ${workerData.name}`);
        
        // Update follower count in UI
        setWorkerData(prev => ({
          ...prev,
          followerCount: Math.max((prev.followerCount || 0) - 1, 0)
        }));
        
        if (activeTab === 'followers') {
          await fetchFollowers();
        }
      } else {
        // Follow action
        await axios.post(`http://localhost:5000/socialworker/follow/${id}`, {}, config);
        setIsFollowing(true);
        toast.success(`Now following ${workerData.name}`);
        
        // Update follower count in UI
        setWorkerData(prev => ({
          ...prev,
          followerCount: (prev.followerCount || 0) + 1
        }));
        
        if (activeTab === 'followers') {
          await fetchFollowers();
        }
      }
    } catch (error) {
      console.error('Error with follow action:', error);
      toast.error(error.response?.data?.message || 'Failed to update follow status');
    } finally {
      setFollowActionLoading(false);
    }
  };

  if (loading || !workerData) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading social worker profile...</p>
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
            <div className="bg-purple-100 rounded-full p-6 mb-4 md:mb-0 md:mr-6">
              {workerData.profilePicture ? (
                <img 
                  src={workerData.profilePicture} 
                  alt={workerData.name} 
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <Users size={64} className="text-purple-600" />
              )}
            </div>
            <div className="text-center md:text-left md:flex-1">
              <div className="flex items-center flex-wrap justify-center md:justify-start">
                <h1 className="text-2xl font-bold">{workerData.name}</h1>
                {workerData.isVerified && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9z"></path>
                    </svg>
                    Verified
                  </span>
                )}
              </div>
              <p className="text-gray-600">{workerData.description}</p>
              <p className="text-sm text-gray-500">Member since {formatDate(workerData.createdAt)}</p>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">{workerData.followerCount || 0}</span> followers
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              {/* Render different button for own profile */}
              {currentUser && currentUser._id === id ? (
                <Link href="/social-worker/edit-profile">
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg">
                    Edit Profile
                  </button>
                </Link>
              ) : (
                <button 
                  className={`flex items-center font-medium py-2 px-4 rounded-lg ${
                    isFollowing 
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-800' 
                      : 'bg-lime-500 hover:bg-lime-700 text-white'
                  }`}
                  onClick={handleFollow}
                  disabled={followActionLoading}
                >
                  {followActionLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : isFollowing ? (
                    <>
                      <UserMinus size={16} className="mr-1" />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} className="mr-1" />
                      Follow
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex border-b overflow-x-auto">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2 font-medium ${activeTab === 'about'
              ? 'border-b-2 border-lime-500 text-lime-600'
              : 'text-gray-600'}`}
          >
            About
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-4 py-2 font-medium ${activeTab === 'posts'
              ? 'border-b-2 border-lime-500 text-lime-600'
              : 'text-gray-600'}`}
          >
            Posts {posts.length > 0 && <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 rounded-full">{posts.length}</span>}
          </button>
          <button
            onClick={() => {
              setActiveTab('followers');
              if (followers.length === 0 && !followersLoading) {
                fetchFollowers();
              }
            }}
            className={`px-4 py-2 font-medium ${activeTab === 'followers'
              ? 'border-b-2 border-lime-500 text-lime-600'
              : 'text-gray-600'}`}
          >
            Followers {workerData.followerCount > 0 && 
              <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 rounded-full">
                {workerData.followerCount}
              </span>
            }
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
                <p className="text-gray-600">{workerData.description || 'No description available.'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Contact Information</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-600">
                      <MapPin size={18} className="mr-2 text-gray-500" />
                      {workerData.address || 'Address not provided'}
                    </li>
                    <li className="flex items-center text-gray-600">
                      <Calendar size={18} className="mr-2 text-gray-500" />
                      {workerData.email}
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Professional Details</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-600">
                      <Building size={18} className="mr-2 text-gray-500" />
                      Affiliated to: {workerData.affiliatedTo || 'Independent'}
                    </li>
                    <li className="flex items-center text-gray-600">
                      <MapPin size={18} className="mr-2 text-gray-500" />
                      {workerData.geography || 'Geographic area not specified'}
                    </li>
                    <li className="flex items-center text-gray-600">
                      <Calendar size={18} className="mr-2 text-gray-500" />
                      {workerData.exp || '0'} years of experience
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
            {postsLoading ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-lime-500"></div>
                <p className="mt-4 text-gray-500">Loading posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-gray-500 text-center py-12">
                <MessageCircle size={40} className="mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium">No posts yet</p>
                <p className="mt-2">This social worker hasn't shared any content yet.</p>
              </div>
            ) : (
              posts.map(post => (
                <div key={post._id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold">{post.title}</h3>
                      <span className="text-sm text-gray-500">{formatDate(post.date)}</span>
                    </div>
                    <p className="text-gray-600 mb-4">{post.content}</p>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex space-x-4">
                        <span className="flex items-center text-gray-500 text-sm">
                          <ThumbsUp size={16} className="mr-1" /> {post.likes || 0}
                        </span>
                        <span className="flex items-center text-gray-500 text-sm">
                          <Eye size={16} className="mr-1" /> {post.views || 0}
                        </span>
                      </div>
                      <Link 
                        href={`/posts/${post._id}`}
                        className="text-lime-600 text-sm font-medium hover:text-lime-800"
                      >
                        View Full Post
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
            
            {followersLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-lime-500"></div>
                <p className="ml-3 text-gray-500">Loading followers...</p>
              </div>
            ) : followers.length === 0 ? (
              <div className="text-gray-500 col-span-full text-center py-8">
                <Users size={40} className="mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium">No followers yet</p>
                <p className="mt-2">When people follow this social worker, they'll appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {followers.map((follower) => (
                  <div key={follower.followerId} className="flex items-center p-4 border rounded-lg">
                    <div className={`rounded-full p-3 mr-3 ${
                      follower.followerType === 'user' ? 'bg-blue-100' : 
                      follower.followerType === 'ngo' ? 'bg-green-100' : 'bg-purple-100'
                    }`}>
                      {follower.followerType === 'user' ? (
                        <User size={20} className="text-lime-600" />
                      ) : follower.followerType === 'ngo' ? (
                        <Building size={20} className="text-green-600" />
                      ) : (
                        <Users size={20} className="text-purple-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">
                        <Link 
                          href={`/${follower.followerType}/${follower.followerId}`}
                          className="hover:text-lime-600"
                        >
                          {follower.followerName}
                        </Link>
                      </h3>
                      <p className="text-sm text-gray-500 capitalize">{follower.followerType}</p>
                      <p className="text-xs text-gray-500">Since {formatDate(follower.followedAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}