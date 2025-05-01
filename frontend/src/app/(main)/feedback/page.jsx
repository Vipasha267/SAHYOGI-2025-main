'use client';
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Star, ThumbsUp, MessageCircle, Lightbulb } from 'lucide-react';

const FeedbackPage = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const feedbackForm = useFormik({
    initialValues: {
      rating: 0,
      category: 'general',
      comment: '',
      suggestion: '',
      email: ''
    },
    validationSchema: Yup.object({
      rating: Yup.number()
        .min(1, 'Please select a rating')
        .required('Rating is required'),
      category: Yup.string()
        .required('Please select a category'),
      comment: Yup.string()
        .min(10, 'Comment should be at least 10 characters')
        .required('Please provide your feedback'),
      suggestion: Yup.string()
        .min(10, 'Suggestion should be at least 10 characters'),
      email: Yup.string()
        .email('Invalid email address')
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await axios.post('http://localhost:5000/feedback/submit', values);
        toast.success('Thank you for your feedback!');
        resetForm();
        setRating(0);
      } catch (error) {
        console.error('Feedback submission error:', error);
        toast.error('Failed to submit feedback. Please try again.');
      }
    }
  });

  const categories = [
    { value: 'general', label: 'General Experience', icon: <ThumbsUp className="w-5 h-5" /> },
    { value: 'usability', label: 'Usability', icon: <MessageCircle className="w-5 h-5" /> },
    { value: 'features', label: 'Features', icon: <Star className="w-5 h-5" /> },
    { value: 'suggestion', label: 'Suggestion', icon: <Lightbulb className="w-5 h-5" /> }
  ];

  const handleRatingClick = (value) => {
    setRating(value);
    feedbackForm.setFieldValue('rating', value);
  };

  return (
    
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
      
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">We Value Your Feedback</h1>
          
          <form onSubmit={feedbackForm.handleSubmit} className="space-y-6">
            {/* Rating Section */}
            <div className="text-center">
              <label className="block text-gray-700 text-sm font-bold mb-4">
                How would you rate your experience?
              </label>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className="focus:outline-none"
                    onMouseEnter={() => setHoveredRating(value)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => handleRatingClick(value)}
                  >
                    <Star
                      className={`w-8 h-8 ${
                        value <= (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {feedbackForm.touched.rating && feedbackForm.errors.rating && (
                <div className="text-red-500 text-sm mt-1">{feedbackForm.errors.rating}</div>
              )}
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Feedback Category
              </label>
              <div className="grid grid-cols-2 gap-4">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    type="button"
                    className={`p-3 rounded-lg border flex items-center space-x-2 transition-colors ${
                      feedbackForm.values.category === category.value
                        ? 'border-lime-500 bg-lime-50 text-lime-700'
                        : 'border-gray-200 hover:border-lime-500'
                    }`}
                    onClick={() => feedbackForm.setFieldValue('category', category.value)}
                  >
                    {category.icon}
                    <span>{category.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Section */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Your Feedback
              </label>
              <textarea
                name="comment"
                rows="4"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent ${
                  feedbackForm.touched.comment && feedbackForm.errors.comment
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="Tell us about your experience..."
                {...feedbackForm.getFieldProps('comment')}
              ></textarea>
              {feedbackForm.touched.comment && feedbackForm.errors.comment && (
                <div className="text-red-500 text-sm mt-1">{feedbackForm.errors.comment}</div>
              )}
            </div>

            {/* Suggestion Section */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Suggestions for Improvement (Optional)
              </label>
              <textarea
                name="suggestion"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                placeholder="How can we make your experience better?"
                {...feedbackForm.getFieldProps('suggestion')}
              ></textarea>
            </div>

            {/* Email Section */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email (Optional)
              </label>
              <input
                type="email"
                name="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                placeholder="Your email for follow-up"
                {...feedbackForm.getFieldProps('email')}
              />
              {feedbackForm.touched.email && feedbackForm.errors.email && (
                <div className="text-red-500 text-sm mt-1">{feedbackForm.errors.email}</div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-lime-500 text-white py-3 px-4 rounded-lg hover:bg-lime-600 transition-colors focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2"
            >
              Submit Feedback
            </button>
          </form>
        </div>
      </div>
    </div>
    
  );
};

export default FeedbackPage;