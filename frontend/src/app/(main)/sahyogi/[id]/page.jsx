'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  User, 
  MapPin, 
  Award, 
  BookOpen, 
  Image, 
  MessageSquare, 
  Heart,
  Check,
  Clock
} from 'lucide-react';

export default function SahyogiProfile() {
  const { id } = useParams();
  const [sahyogi, setSahyogi] = useState(null);
  const [activeTab, setActiveTab] = useState('about');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSahyogiData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/sahyogi/${id}`);
        setSahyogi(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching sahyogi data:', error);
        toast.error('Failed to load profile');
        setLoading(false);
      }
    };

    fetchSahyogiData();
  }, [id]);

  const donationForm = useFormik({
    initialValues: {
      amount: '',
      message: '',
      anonymous: false
    },
    validationSchema: Yup.object({
      amount: Yup.number()
        .required('Amount is required')
        .min(1, 'Minimum donation amount is 1'),
      message: Yup.string()
        .max(200, 'Message must be 200 characters or less'),
      anonymous: Yup.boolean()
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await axios.post(`http://localhost:5000/donations/create`, {
          sahyogiId: id,
          ...values
        });
        toast.success('Thank you for your support!');
        resetForm();
      } catch (error) {
        console.error('Donation error:', error);
        toast.error('Failed to process donation');
      }
    }
  });

  const feedbackForm = useFormik({
    initialValues: {
      rating: 0,
      comment: ''
    },
    validationSchema: Yup.object({
      rating: Yup.number()
        .required('Please provide a rating')
        .min(1, 'Minimum rating is 1')
        .max(5, 'Maximum rating is 5'),
      comment: Yup.string()
        .required('Please provide feedback')
        .min(10, 'Feedback must be at least 10 characters')
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await axios.post(`http://localhost:5000/feedback/create`, {
          sahyogiId: id,
          ...values
        });
        toast.success('Feedback submitted successfully!');
        resetForm();
      } catch (error) {
        console.error('Feedback error:', error);
        toast.error('Failed to submit feedback');
      }
    }
  });

  if (loading || !sahyogi) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading Sahyogi profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-lime-100 flex items-center justify-center">
                {sahyogi?.photo ? (
                  <img 
                    src={sahyogi.photo} 
                    alt={sahyogi.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User size={48} className="text-lime-600" />
                )}
              </div>
              {sahyogi?.verified && (
                <div className="absolute -right-2 -bottom-2 bg-green-100 rounded-full p-2">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
              )}
            </div>
            
            <div className="md:ml-8 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start">
                <h1 className="text-3xl font-bold">{sahyogi?.name}</h1>
                {sahyogi?.verified && (
                  <span className="ml-2 bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full font-medium">
                    Verified
                  </span>
                )}
              </div>
              <p className="text-gray-600 mt-1">{sahyogi?.area_of_service}</p>
              <div className="flex items-center justify-center md:justify-start mt-2">
                <MapPin size={16} className="text-gray-500 mr-1" />
                <span className="text-gray-500">{sahyogi?.location}</span>
              </div>
            </div>

            <div className="md:ml-auto mt-4 md:mt-0">
              <button
                onClick={() => setActiveTab('support')}
                className="bg-lime-500 text-white px-6 py-2 rounded-lg hover:bg-lime-600 transition-colors"
              >
                Support this Sahyogi
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8 overflow-x-auto">
            {['about', 'showcase', 'cases', 'feedback', 'support'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-lime-500 text-lime-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-8">
        {/* About Section */}
        {activeTab === 'about' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">About</h2>
            <div className="prose max-w-none">
              <p>{sahyogi?.description}</p>
            </div>
            
            <h3 className="text-xl font-bold mt-8 mb-4">Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sahyogi?.achievements?.map((achievement, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold">{achievement.title}</h4>
                  <p className="text-gray-600">{achievement.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Work Showcase */}
        {activeTab === 'showcase' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Work Showcase</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sahyogi?.showcase?.map((item, index) => (
                <div key={index} className="relative group">
                  <img
                    src={item.url}
                    alt={item.caption}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <p className="text-white text-center p-4">{item.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Case Status */}
        {activeTab === 'cases' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Active Cases</h2>
            <div className="space-y-4">
              {sahyogi?.cases?.map((case_item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold">{case_item.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      case_item.status === 'completed' ? 'bg-green-100 text-green-800' :
                      case_item.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {case_item.status}
                    </span>
                  </div>
                  <p className="text-gray-600">{case_item.description}</p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <Clock size={16} className="mr-1" />
                    Last updated: {new Date(case_item.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feedback Section */}
        {activeTab === 'feedback' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Feedback</h2>
            
            {/* Feedback Form */}
            <form onSubmit={feedbackForm.handleSubmit} className="mb-8">
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Rating</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => feedbackForm.setFieldValue('rating', star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= feedbackForm.values.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Your Feedback</label>
                <textarea
                  {...feedbackForm.getFieldProps('comment')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500"
                  rows="4"
                />
              </div>
              
              <button
                type="submit"
                className="bg-lime-500 text-white px-4 py-2 rounded-lg hover:bg-lime-600"
              >
                Submit Feedback
              </button>
            </form>

            {/* Existing Feedback */}
            <div className="space-y-4">
              {sahyogi?.feedback?.map((item, index) => (
                <div key={index} className="border-b pb-4">
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < item.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600">{item.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Support Section */}
        {activeTab === 'support' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Support this Sahyogi</h2>
            <form onSubmit={donationForm.handleSubmit} className="max-w-md">
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Donation Amount (₹)
                </label>
                <input
                  type="number"
                  {...donationForm.getFieldProps('amount')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Message (Optional)
                </label>
                <textarea
                  {...donationForm.getFieldProps('message')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500"
                  rows="3"
                />
              </div>
              
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...donationForm.getFieldProps('anonymous')}
                    className="rounded text-lime-500 focus:ring-lime-500"
                  />
                  <span className="ml-2 text-gray-700">Make this donation anonymous</span>
                </label>
              </div>
              
              <button
                type="submit"
                className="w-full bg-lime-500 text-white py-2 px-4 rounded-lg hover:bg-lime-600"
              >
                Support Now
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}