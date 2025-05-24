'use client';
import { useState, useEffect } from 'react';
import { Building, MapPin, Briefcase, Clock, Bookmark, Calendar, User, Users, MessageCircle, Eye, ThumbsUp, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

export default function NGOProfile() {
  const router = useRouter();
  const [ngoData, setNgoData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [activeTab, setActiveTab] = useState('about');
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    
    if (!token || userType !== 'ngo') {
      router.push('/ngo-login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Decode token to get user ID
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        const loggedInUserId = payload._id;
        setUserId(loggedInUserId);
        
        // Fetch NGO data
        const ngoResponse = await axios.get(`http://localhost:5000/ngo/getbyid/${loggedInUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setNgoData(ngoResponse.data);
        
        // Fetch posts by this NGO
        setPostsLoading(true);
        const postsResponse = await axios.get(`http://localhost:5000/posts/getbyauthor/${loggedInUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPosts(postsResponse.data);
        setPostsLoading(false);
        
        // For future implementation - fetch followers
        // const followersResponse = await axios.get(`http://localhost:5000/followers/getbyngo/${loggedInUserId}`);
        // setFollowers(followersResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        // If token is invalid, redirect to login
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userType');
          router.push('/ngo-login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading || !ngoData) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading profile...</p>
      </div>
    );
  }

  if (!ngoData) {
    return <div className="flex justify-center items-center h-screen">NGO profile not found. Please login again.</div>;
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
    
    // Handle youtube.com/watch format
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
              <Building size={64} className="text-green-600" />
            </div>
            <div className="text-center md:text-left md:flex-1">
              <h1 className="text-2xl font-bold">{ngoData.ngo_name}</h1>
              <p className="text-gray-600">{ngoData.type_of_SocialWork}</p>
              <p className="text-sm text-gray-500">Active since {formatDate(ngoData.createdAt)}</p>
            </div>
            <div className="mt-4 md:mt-0 space-x-2">
              <Link href="/ngo/edit-profile">
                <button className="bg-white border border-lime-500 text-lime-500 hover:bg-lime-50 font-medium py-2 px-4 rounded-lg">
                  Edit Profile
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
            {/* Add Post Button - Top for visibility */}
            <div className="flex justify-end mb-4">
              <Link href="/ngo-profile/add-post">
                <button className="bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded-md flex items-center">
                  <span className="mr-2">+</span> Create New Post
                </button>
              </Link>
            </div>
          
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
                <p className="mt-2">You haven't published any content yet.</p>
                <Link href="/ngo-profile/add-post">
                  <button className="mt-6 bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded-md">
                    Create Your First Post
                  </button>
                </Link>
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
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-3">{formatDate(post.date)}</span>
                        <Link href={`/ngo-profile/edit-post/${post._id}`}>
                          <button className="text-gray-500 hover:text-lime-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 20h9"></path>
                              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                            </svg>
                          </button>
                        </Link>
                      </div>
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
                      <div className="space-x-2">
                        <Link 
                          href={`/posts/${post._id}`}
                          className="text-lime-600 text-sm font-medium hover:text-lime-800"
                        >
                          View Full Post
                        </Link>
                      </div>
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
              <div className="text-gray-500 col-span-full text-center py-8">
                <Users size={40} className="mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium">No followers yet</p>
                <p className="mt-2">When people follow your NGO, they'll appear here.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}