'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { X, Upload, Image, Check } from 'lucide-react';

const NGOAddPost = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [userData, setUserData] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Cloudinary configuration
  const CLOUDINARY_UPLOAD_PRESET = 'sahyogi'; // Replace with your upload preset
  const CLOUDINARY_CLOUD_NAME = 'dzevjkvip'; // Replace with your cloud name
  const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

  // Fetch user data when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    
    if (!token || userType !== 'ngo') {
      router.push('/ngo-login');
      return;
    }

    // Decode token to get user info
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      setUserData(payload);
    } catch (error) {
      console.error('Error parsing token:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      router.push('/ngo-login');
    }
  }, [router]);

  const formik = useFormik({
    initialValues: {
      title: '',
      type: 'article',
      content: '',
      mediaUrl: '',
      organization: '',
      impact: '',
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required('Title is required')
        .max(100, 'Title must be 100 characters or less'),
      type: Yup.string()
        .required('Post type is required')
        .oneOf(['article', 'story', 'guide', 'video', 'infographic']),
      content: Yup.string()
        .when('type', {
          is: (type) => ['article', 'story', 'guide'].includes(type),
          then: (schema) => schema.required('Content is required for this post type'),
        }),
      mediaUrl: Yup.string()
        .when('type', {
          is: (type) => ['video', 'infographic'].includes(type),
          then: (schema) => schema.required('Media URL is required for this post type'),
        }),
      organization: Yup.string()
        .when('type', {
          is: 'story',
          then: (schema) => schema.required('Organization is required for success stories'),
        }),
      impact: Yup.string()
        .when('type', {
          is: 'story',
          then: (schema) => schema.required('Impact description is required for success stories'),
        }),
    }),
    onSubmit: async (values) => {
      if (tags.length === 0) {
        setError('Please add at least one tag');
        return;
      }

      if (!userData) {
        setError('User information not available');
        return;
      }

      setError(null);
      setIsSubmitting(true);

      try {
        const token = localStorage.getItem('token');
        const postData = {
          ...values,
          tags,
          author: userData.name || userData.ngo_name, // Use NGO name if available
          authorType: 'ngo'
        };

        // If there's an uploaded image, use its URL
        if (uploadedFile) {
          if (['video', 'infographic'].includes(values.type)) {
            postData.mediaUrl = uploadedFile.secure_url;
          } else {
            // For articles, stories and guides, we can add the image to the content
            postData.featuredImage = uploadedFile.secure_url;
          }
        }

        const response = await fetch('http://localhost:5000/posts/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(postData)
        });

        const data = await response.json();

        if (response.ok) {
          router.push('/ngo-profile/posts');
        } else {
          setError(data.message || 'Failed to create post');
        }
      } catch (error) {
        console.error('Error creating post:', error);
        setError('An error occurred while creating your post');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset state
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File is too large. Maximum size is 10MB.');
      setIsUploading(false);
      return;
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setError('File type not supported. Please upload an image, video, or PDF.');
      setIsUploading(false);
      return;
    }

    try {
      // Create form data for upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      
      // Create XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();
      xhr.open('POST', CLOUDINARY_UPLOAD_URL, true);
      
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(progress);
        }
      };
      
      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setUploadedFile(response);
          
          // If the post type requires a media URL, automatically set it
          if (['video', 'infographic'].includes(formik.values.type)) {
            formik.setFieldValue('mediaUrl', response.secure_url);
          }
          
          setIsUploading(false);
        } else {
          setError('Upload failed. Please try again.');
          setIsUploading(false);
        }
      };
      
      xhr.onerror = () => {
        setError('Upload failed. Please try again.');
        setIsUploading(false);
      };
      
      xhr.send(formData);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to upload file. Please try again.');
      setIsUploading(false);
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput) {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Create New NGO Post</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        {/* Title */}
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500"
            placeholder="Enter a meaningful title"
          />
          {formik.touched.title && formik.errors.title ? (
            <div className="text-red-600 text-sm mt-1">{formik.errors.title}</div>
          ) : null}
        </div>

        {/* Post Type */}
        <div className="mb-6">
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Post Type
          </label>
          <select
            id="type"
            name="type"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.type}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500"
          >
            <option value="article">Article</option>
            <option value="story">Success Story</option>
            <option value="guide">Guide</option>
            <option value="video">Video</option>
            <option value="infographic">Infographic</option>
          </select>
          {formik.touched.type && formik.errors.type ? (
            <div className="text-red-600 text-sm mt-1">{formik.errors.type}</div>
          ) : null}
        </div>

        {/* File Upload Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Media
          </label>
          
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md">
            <div className="space-y-2 text-center">
              {!uploadedFile ? (
                <>
                  <div className="flex justify-center">
                    <Image className="mx-auto h-12 w-12 text-gray-400" strokeWidth={1} />
                  </div>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-medium text-lime-600 hover:text-lime-500 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*,video/*,.pdf"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center h-32 w-full">
                    {uploadedFile.resource_type === 'image' ? (
                      <img 
                        src={uploadedFile.secure_url} 
                        alt="Uploaded" 
                        className="h-full object-contain"
                      />
                    ) : (
                      <div className="flex items-center justify-center p-4 bg-gray-100 rounded-md">
                        <Check className="h-8 w-8 text-green-500" />
                        <span className="ml-2 text-sm font-medium text-gray-900">
                          {uploadedFile.original_filename}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-2 flex items-center">
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedFile(null);
                        if (['video', 'infographic'].includes(formik.values.type)) {
                          formik.setFieldValue('mediaUrl', '');
                        }
                      }}
                      className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500"
                    >
                      Replace
                    </button>
                  </div>
                </div>
              )}
              
              {isUploading && (
                <div className="w-full mt-2">
                  <div className="bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-lime-600 h-2.5 rounded-full" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-center mt-1">{uploadProgress}% Uploaded</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content for articles, stories, guides */}
        {['article', 'story', 'guide'].includes(formik.values.type) && (
          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.content}
              rows="8"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500"
              placeholder="Write your content here"
            ></textarea>
            {formik.touched.content && formik.errors.content ? (
              <div className="text-red-600 text-sm mt-1">{formik.errors.content}</div>
            ) : null}
          </div>
        )}

        {/* Media URL for videos, infographics */}
        {['video', 'infographic'].includes(formik.values.type) && (
          <div className="mb-6">
            <label htmlFor="mediaUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Media URL {uploadedFile && <span className="text-green-600 text-xs">(Auto-filled from uploaded file)</span>}
            </label>
            <input
              id="mediaUrl"
              name="mediaUrl"
              type="url"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.mediaUrl}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500"
              placeholder="Enter URL to your media content"
            />
            {formik.touched.mediaUrl && formik.errors.mediaUrl ? (
              <div className="text-red-600 text-sm mt-1">{formik.errors.mediaUrl}</div>
            ) : null}
          </div>
        )}

        {/* Additional fields for success stories */}
        {formik.values.type === 'story' && (
          <>
            <div className="mb-6">
              <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
                Organization Involved
              </label>
              <input
                id="organization"
                name="organization"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.organization || (userData?.ngo_name || '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500"
                placeholder="Organization name"
              />
              {formik.touched.organization && formik.errors.organization ? (
                <div className="text-red-600 text-sm mt-1">{formik.errors.organization}</div>
              ) : null}
            </div>

            <div className="mb-6">
              <label htmlFor="impact" className="block text-sm font-medium text-gray-700 mb-1">
                Impact Description
              </label>
              <textarea
                id="impact"
                name="impact"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.impact}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500"
                placeholder="Describe the impact achieved"
              ></textarea>
              {formik.touched.impact && formik.errors.impact ? (
                <div className="text-red-600 text-sm mt-1">{formik.errors.impact}</div>
              ) : null}
            </div>
          </>
        )}

        {/* Tags */}
        <div className="mb-6">
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <div className="flex items-center">
            <input
              id="tags"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500"
              placeholder="Add tags to help others find your post"
            />
            <button
              type="button"
              onClick={addTag}
              className="bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded-r-md"
            >
              Add
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, index) => (
              <div 
                key={index}
                className="bg-gray-100 px-3 py-1 rounded-full flex items-center"
              >
                <span className="text-sm text-gray-700">{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          {tags.length === 0 && (
            <div className="text-amber-600 text-sm mt-1">Please add at least one tag</div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="px-4 py-2 bg-lime-600 text-white rounded-md hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Publishing...' : 'Publish Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NGOAddPost;