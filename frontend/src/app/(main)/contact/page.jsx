'use client';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Send, Upload } from 'lucide-react';

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactForm = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      isSocialWorker: false,
      inquiryType: '',
      document: null
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .required('Full name is required')
        .min(2, 'Name must be at least 2 characters'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number'),
      subject: Yup.string()
        .required('Subject is required')
        .min(3, 'Subject must be at least 3 characters'),
      message: Yup.string()
        .required('Message is required')
        .min(10, 'Message must be at least 10 characters'),
      inquiryType: Yup.string()
        .required('Please select an inquiry type'),
      document: Yup.mixed()
        .test('fileSize', 'File is too large', (value) => {
          if (!value) return true;
          return value.size <= 5000000; // 5MB limit
        })
        .test('fileType', 'Unsupported file type', (value) => {
          if (!value) return true;
          return ['application/pdf', 'image/jpeg', 'image/png'].includes(value.type);
        })
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        Object.keys(values).forEach(key => {
          if (key === 'document' && values[key]) {
            formData.append(key, values[key]);
          } else {
            formData.append(key, values[key]);
          }
        });

        await axios.post('http://localhost:5000/contact/submit', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        toast.success('Thank you for contacting us! We will get back to you soon.');
        resetForm();
      } catch (error) {
        console.error('Contact form submission error:', error);
        toast.error('Failed to submit form. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    contactForm.setFieldValue('document', file);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
            <p className="mt-2 text-gray-600">
              Have questions? We'd love to hear from you.
            </p>
          </div>

          <form onSubmit={contactForm.handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                {...contactForm.getFieldProps('fullName')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent ${
                  contactForm.touched.fullName && contactForm.errors.fullName
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              {contactForm.touched.fullName && contactForm.errors.fullName && (
                <p className="mt-1 text-sm text-red-500">{contactForm.errors.fullName}</p>
              )}
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  {...contactForm.getFieldProps('email')}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent ${
                    contactForm.touched.email && contactForm.errors.email
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {contactForm.touched.email && contactForm.errors.email && (
                  <p className="mt-1 text-sm text-red-500">{contactForm.errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  {...contactForm.getFieldProps('phone')}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent ${
                    contactForm.touched.phone && contactForm.errors.phone
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {contactForm.touched.phone && contactForm.errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{contactForm.errors.phone}</p>
                )}
              </div>
            </div>

            {/* Subject & Inquiry Type Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  {...contactForm.getFieldProps('subject')}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent ${
                    contactForm.touched.subject && contactForm.errors.subject
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {contactForm.touched.subject && contactForm.errors.subject && (
                  <p className="mt-1 text-sm text-red-500">{contactForm.errors.subject}</p>
                )}
              </div>

              {/* Inquiry Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type of Inquiry <span className="text-red-500">*</span>
                </label>
                <select
                  name="inquiryType"
                  {...contactForm.getFieldProps('inquiryType')}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent ${
                    contactForm.touched.inquiryType && contactForm.errors.inquiryType
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                >
                  <option value="">Select type</option>
                  <option value="Volunteering">Volunteering</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Collaboration">Collaboration</option>
                  <option value="Report Issue">Report Issue</option>
                  <option value="Other">Other</option>
                </select>
                {contactForm.touched.inquiryType && contactForm.errors.inquiryType && (
                  <p className="mt-1 text-sm text-red-500">{contactForm.errors.inquiryType}</p>
                )}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                rows="4"
                {...contactForm.getFieldProps('message')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent ${
                  contactForm.touched.message && contactForm.errors.message
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              {contactForm.touched.message && contactForm.errors.message && (
                <p className="mt-1 text-sm text-red-500">{contactForm.errors.message}</p>
              )}
            </div>

            {/* Social Worker Radio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Are you a social worker?
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isSocialWorker"
                    value="true"
                    onChange={() => contactForm.setFieldValue('isSocialWorker', true)}
                    checked={contactForm.values.isSocialWorker === true}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isSocialWorker"
                    value="false"
                    onChange={() => contactForm.setFieldValue('isSocialWorker', false)}
                    checked={contactForm.values.isSocialWorker === false}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Document (Optional)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-lime-600 hover:text-lime-500">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        name="document"
                        onChange={handleFileChange}
                        className="sr-only"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, PNG, JPG up to 5MB
                  </p>
                </div>
              </div>
              {contactForm.touched.document && contactForm.errors.document && (
                <p className="mt-1 text-sm text-red-500">{contactForm.errors.document}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-lime-600 hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Sending...
                </div>
              ) : (
                <div className="flex items-center">
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;