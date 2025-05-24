'use client';
import { useState, useEffect } from 'react';
import { Building, MapPin, Briefcase, Clock, Bookmark, Calendar, User, Users, MessageCircle, Eye, ThumbsUp, ExternalLink, UserPlus, UserMinus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function NGOProfile() {
  const { id } = useParams();
  const router = useRouter();

  const [ngoData, setNgoData] = useState(null);
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
        
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        let userData = null;
        
        // Decode token to get current user info
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
        
        // Fetch NGO data by ID from backend
        const ngoResponse = await axios.get(`http://localhost:5000/ngo/getbyid/${id}`);
        setNgoData(ngoResponse.data);

        // Fetch posts by NGO
        setPostsLoading(true);
        const postsResponse = await axios.get(`http://localhost:5000/posts/getbyauthor/${id}`);
        setPosts(postsResponse.data);
        setPostsLoading(false);
        
        // Only fetch followers if on followers tab
        if (activeTab === 'followers') {
          await fetchFollowers();
        }
        
        // Check if the current user is following this NGO
        if (token && userData && ngoResponse.data.followers) {
          const isAlreadyFollowing = ngoResponse.data.followers.some(
            follower => follower.followerId === userData._id
          );
          setIsFollowing(isAlreadyFollowing);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, activeTab]);
  
  const fetchFollowers = async () => {
    try {
      setFollowersLoading(true);
      const followersResponse = await axios.get(`http://localhost:5000/ngo/followers/${id}`);
      setFollowers(followersResponse.data || []);
    } catch (error) {
      console.error('Error fetching followers:', error);
      toast.error('Failed to load followers');
    } finally {
      setFollowersLoading(false);
    }
  };

  const handleFollowAction = async () => {
    if (!currentUser) {
      // Redirect to login if not logged in
      const userType = localStorage.getItem('userType');
      if (!userType) {
        toast.error('Please log in to follow NGOs');
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
        await axios.post(`http://localhost:5000/ngo/unfollow/${id}`, {}, config);
        setIsFollowing(false);
        toast.success(`Unfollowed ${ngoData.ngo_name}`);
        
        // Update follower count in UI
        setNgoData(prev => ({
          ...prev,
          followerCount: Math.max((prev.followerCount || 0) - 1, 0)
        }));
        
        if (activeTab === 'followers') {
          // Refresh followers list if we're on that tab
          await fetchFollowers();
        }
      } else {
        // Follow action
        await axios.post(`http://localhost:5000/ngo/follow/${id}`, {}, config);
        setIsFollowing(true);
        toast.success(`Now following ${ngoData.ngo_name}`);
        
        // Update follower count in UI
        setNgoData(prev => ({
          ...prev,
          followerCount: (prev.followerCount || 0) + 1
        }));
        
        if (activeTab === 'followers') {
          // Refresh followers list if we're on that tab
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

  if (loading || !ngoData) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading NGO profile...</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to truncate text with ellipsis
  const truncateText = (text, maxLength = 150) => {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  // Function to determine post icon based on type
  const getPostIcon = (type) => {
    switch (type) {
      case 'article':
        return <Briefcase className="text-blue-500" size={18} />;
      case 'story':
        return <MessageCircle className="text-green-500" size={18} />;
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

  // Function to check if URL is a video
  const isVideoUrl = (url) => {
    if (!url) return false;
    return url.match(/\.(mp4|webm|ogg)$/) || 
           url.includes('youtube.com') || 
           url.includes('youtu.be') || 
           url.includes('vimeo.com');
  };

  // Function to get YouTube embed URL
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    
    // Handle youtu.be format
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    
    // Handle youtube.com format
    if (url.includes('youtube.com/watch')) {
      const urlObj = new URL(url);
      const id = urlObj.searchParams.get('v');
      return `https://www.youtube.com/embed/${id}`;
    }
    
    return url; // Return original if not YouTube
  };

  // Function to render media based on type and URL
  const renderMedia = (post) => {
    const { mediaUrl, type, featuredImage } = post;
    
    if (!mediaUrl && !featuredImage) return null;
    
    const displayUrl = mediaUrl || featuredImage;
    
    // Handle videos
    if (type === 'video' || isVideoUrl(displayUrl)) {
      if (displayUrl.includes('youtube.com') || displayUrl.includes('youtu.be')) {
        const embedUrl = getYouTubeEmbedUrl(displayUrl);
        return (
          <div className="aspect-w-16 aspect-h-9 mb-4 rounded-lg overflow-hidden">
            <iframe
              src={embedUrl}
              title="Video content"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        );
      } else if (displayUrl.match(/\.(mp4|webm|ogg)$/)) {
        return (
          <video 
            controls 
            className="w-full rounded-lg mb-4 max-h-96"
            poster={post.thumbnailUrl}
          >
            <source src={displayUrl} type={`video/${displayUrl.split('.').pop()}`} />
            Your browser does not support the video tag.
          </video>
        );
      }
    }
    
    // Handle images
    if (displayUrl.match(/\.(jpeg|jpg|png|gif|webp)$/i) || type === 'infographic') {
      return (
        <div className="mb-4 rounded-lg overflow-hidden">
          <img 
            src={displayUrl}
            alt={post.title}
            className="w-full object-cover rounded-lg max-h-96"
          />
        </div>
      );
    }
    
    // For other file types like PDFs, show a link
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
        <a 
          href={displayUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ExternalLink size={18} className="mr-2" />
          View attached media
        </a>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header/Profile Info */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="bg-green-100 rounded-full p-6 mb-4 md:mb-0 md:mr-6">
              {ngoData.profilePicture ? (
                <img 
                  src={ngoData.profilePicture} 
                  alt={ngoData.ngo_name} 
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <Building size={64} className="text-green-600" />
              )}
            </div>
            <div className="text-center md:text-left md:flex-1">
              <div className="flex items-center flex-wrap">
                <h1 className="text-2xl font-bold">{ngoData.ngo_name}</h1>
                {ngoData.isVerified && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9z"></path>
                    </svg>
                    Verified
                  </span>
                )}
              </div>
              <p className="text-gray-600">{ngoData.type_of_SocialWork}</p>
              <p className="text-sm text-gray-500">Active since {formatDate(ngoData.createdAt)}</p>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">{ngoData.followerCount || 0}</span> followers
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              {/* Show different button based on whether it's the user's own NGO */}
              {currentUser && currentUser._id === id ? (
                <Link href="/ngo/edit-profile">
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
                  onClick={handleFollowAction}
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
            onClick={() => {
              setActiveTab('followers');
              if (followers.length === 0 && !followersLoading) {
                fetchFollowers();
              }
            }}
            className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'followers'
              ? 'border-b-2 border-lime-500 text-lime-600'
              : 'text-gray-600'}`}
          >
            Followers {ngoData.followerCount > 0 && 
              <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 rounded-full">
                {ngoData.followerCount}
              </span>
            }
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {/* About Tab - keeping as is */}
        {activeTab === 'about' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-6">About {ngoData.ngo_name}</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Bio</h3>
                <p className="text-gray-600">{ngoData.bio || 'No bio available.'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Contact Information</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-600">
                      <MapPin size={18} className="mr-2 text-gray-500" />
                      {ngoData.address || 'Address not provided'}
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
                      {ngoData.geographic_area_of_Work || 'Geographic area not specified'}
                    </li>
                    <li className="flex items-center text-gray-600">
                      <Clock size={18} className="mr-2 text-gray-500" />
                      {ngoData.year_of_experience || '0'} years of experience
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-700 mb-2">Proof of Work</h3>
                <p className="text-gray-600">{ngoData.proof_of_work || 'No proof of work provided.'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            {postsLoading ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-lime-500"></div>
                </div>
                <p className="text-gray-500">Loading posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-gray-500 text-center py-12">
                <Bookmark size={40} className="mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium">No posts available</p>
                <p className="mt-2">This NGO hasn't published any content yet.</p>
              </div>
            ) : (
              posts.map(post => (
                <div key={post._id} className="bg-white rounded-lg shadow overflow-hidden">
                  {/* Post header */}
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
                    
                    {/* Display media content */}
                    {renderMedia(post)}
                    
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
            
            {/* Add Post Button - Only shown for NGO owners */}
            {currentUser && currentUser._id === id && (
              <div className="flex justify-center mt-6">
                <Link href="/ngo-profile/add-post">
                  <button className="bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded-md flex items-center">
                    <span className="mr-2">+</span> Create New Post
                  </button>
                </Link>
              </div>
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
                <p className="mt-2">When people follow this NGO, they'll appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {followers.map((follower) => (
                  <div key={follower.followerId} className="flex items-center p-4 border rounded-lg">
                    <div className={`rounded-full p-3 mr-3 ${
                      follower.followerType === 'user' ? 'bg-blue-100' : 
                      follower.followerType === 'socialworker' ? 'bg-purple-100' : 'bg-green-100'
                    }`}>
                      {follower.followerType === 'user' ? (
                        <User size={20} className="text-lime-600" />
                      ) : follower.followerType === 'socialworker' ? (
                        <Users size={20} className="text-purple-600" />
                      ) : (
                        <Building size={20} className="text-green-600" />
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