'use client';
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Play, BookOpen, Users, Heart, Mail } from 'lucide-react';

const postsPage = () => {
  const [articles, setArticles] = useState([]);
  const [successStories, setSuccessStories] = useState([]);
  const [activeTab, setActiveTab] = useState('articles');

  // Newsletter subscription form
  const subscribeForm = useFormik({
    initialValues: {
      email: '',
      interests: []
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      interests: Yup.array().min(1, 'Select at least one interest')
    }),
    onSubmit: async (values) => {
      try {
        await axios.post('http://localhost:5000/newsletter/subscribe', values);
        toast.success('Successfully subscribed to newsletter!');
        subscribeForm.resetForm();
      } catch (error) {
        console.error('Subscription error:', error);
        toast.error('Failed to subscribe. Please try again.');
      }
    }
  });

  useEffect(() => {
    // In a real app, these would be API calls
    // Mock data for now
    setArticles([
      {
        id: 1,
        title: "Understanding Social Work Impact",
        category: "Education",
        author: "Dr. Sarah Johnson",
        date: "2025-04-20",
        content: "Social work plays a crucial role in community development...",
        image: "https://example.com/social-work-1.jpg"
      },
      {
        id: 2,
        title: "Mental Health in Communities",
        category: "Health",
        author: "Mark Wilson",
        date: "2025-04-18",
        content: "The importance of mental health support in social work...",
        image: "https://example.com/mental-health.jpg"
      }
    ]);

    setSuccessStories([
      {
        id: 1,
        title: "Transforming Lives: The Street Children Project",
        organization: "Child Care NGO",
        impact: "Helped 500+ children",
        content: "Through dedicated effort and community support...",
        image: "https://example.com/success-1.jpg"
      }
    ]);
  }, []);

  const volunteerGuides = [
    {
      title: "Getting Started as a Volunteer",
      description: "Learn the basics of volunteering and making an impact",
      icon: <Heart className="w-6 h-6" />,
      link: "/guides/getting-started"
    },
    {
      title: "Community Engagement",
      description: "Best practices for engaging with communities",
      icon: <Users className="w-6 h-6" />,
      link: "/guides/community"
    }
  ];

  const renderArticles = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map(article => (
        <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <img 
            src={article.image} 
            alt={article.title}
            className="w-full h-48 object-cover"
            onError={(e) => e.target.src = 'https://placehold.co/600x400/png'}
          />
          <div className="p-6">
            <div className="text-sm text-lime-600 mb-2">{article.category}</div>
            <h3 className="text-xl font-bold mb-2">{article.title}</h3>
            <p className="text-gray-600 mb-4">{article.content.substring(0, 150)}...</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{article.author}</span>
              <span className="text-sm text-gray-500">{new Date(article.date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSuccessStories = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {successStories.map(story => (
        <div key={story.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <img 
            src={story.image} 
            alt={story.title}
            className="w-full h-64 object-cover"
            onError={(e) => e.target.src = 'https://placehold.co/600x400/png'}
          />
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2">{story.title}</h3>
            <div className="text-sm text-lime-600 mb-2">{story.organization}</div>
            <div className="text-sm text-gray-500 mb-4">{story.impact}</div>
            <p className="text-gray-600">{story.content}</p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className=" min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Awareness & Impact
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover stories of change, learn about social impact, and find ways to make a difference in your community.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-12">
          <nav className="flex space-x-4 bg-white p-2 rounded-lg shadow-sm">
            <button
              onClick={() => setActiveTab('articles')}
              className={`px-4 py-2 rounded-md transition ${
                activeTab === 'articles'
                  ? 'bg-lime-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BookOpen className="w-5 h-5 inline-block mr-2" />
              Articles
            </button>
            <button
              onClick={() => setActiveTab('success')}
              className={`px-4 py-2 rounded-md transition ${
                activeTab === 'success'
                  ? 'bg-lime-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Heart className="w-5 h-5 inline-block mr-2" />
              Success Stories
            </button>
            <button
              onClick={() => setActiveTab('guides')}
              className={`px-4 py-2 rounded-md transition ${
                activeTab === 'guides'
                  ? 'bg-lime-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users className="w-5 h-5 inline-block mr-2" />
              Volunteer Guides
            </button>
          </nav>
        </div>
        </div>

        {/* Content Section */}
        <div className="mb-16">
          {activeTab === 'articles' && renderArticles()}
          {activeTab === 'success' && renderSuccessStories()}
          {activeTab === 'guides' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {volunteerGuides.map((guide, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                  <div className="text-lime-500 mb-4">
                    {guide.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{guide.title}</h3>
                  <p className="text-gray-600 mb-4">{guide.description}</p>
                  <a
                    href={guide.link}
                    className="text-lime-600 hover:text-lime-700 font-medium inline-flex items-center"
                  >
                    Learn More
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Newsletter Section */}
        <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <Mail className="w-12 h-12 text-lime-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Stay Updated</h2>
            <p className="text-gray-600">
              Subscribe to our newsletter for the latest articles, stories, and volunteer opportunities.
            </p>
          </div>

          <form onSubmit={subscribeForm.handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent ${
                  subscribeForm.touched.email && subscribeForm.errors.email
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                onChange={subscribeForm.handleChange}
                onBlur={subscribeForm.handleBlur}
                value={subscribeForm.values.email}
              />
              {subscribeForm.touched.email && subscribeForm.errors.email && (
                <p className="mt-1 text-sm text-red-500">{subscribeForm.errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">I'm interested in:</p>
              <div className="grid grid-cols-2 gap-2">
                {['Social Work', 'Community Events', 'Volunteer Opportunities', 'Success Stories'].map(
                  (interest) => (
                    <label key={interest} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="interests"
                        value={interest}
                        onChange={subscribeForm.handleChange}
                        className="rounded text-lime-500 focus:ring-lime-500"
                      />
                      <span className="text-sm text-gray-600">{interest}</span>
                    </label>
                  )
                )}
              </div>
              {subscribeForm.touched.interests && subscribeForm.errors.interests && (
                <p className="text-sm text-red-500">{subscribeForm.errors.interests}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-lime-500 text-white py-2 px-4 rounded-lg hover:bg-lime-600 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    
  );
};

export default postsPage;