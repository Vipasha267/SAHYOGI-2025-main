'use client';
import { useState, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { X, Upload, Image, Check } from 'lucide-react';

const CASE_TYPES = [
  'Child Welfare', 'Animal Rescue', 'Women Empowerment', 'Education',
  'Orphanage Help', 'Old Age Care', 'Rural Development'
];
const CASE_STATUS = ['Planned', 'In Progress', 'Completed', 'On Hold'];

// Cloudinary configuration
const CLOUDINARY_UPLOAD_PRESET = 'sahyogi'; // Same as your add-post page
const CLOUDINARY_CLOUD_NAME = 'dzevjkvip'; // Same as your add-post page
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

export default function CaseManagementForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState(null);
  
  // Photo upload state
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [photoUploadProgress, setPhotoUploadProgress] = useState(0);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const photoInputRef = useRef(null);
  
  // Video upload state
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const videoInputRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      caseTitle: '',
      caseType: '',
      location: '',
      startDate: '',
      endDate: '',
      caseStatus: '',
      objective: '',
      workDescription: '',
      challenges: '',
      outcome: '',
      photoCaptions: [],
      videoCaptions: [],
      peopleHelped: '',
      resourcesUsed: '',
      volunteerSupport: '',
      isPublic: false,
      verificationStatus: 'Pending'
    },
    validationSchema: Yup.object({
      caseTitle: Yup.string().required('Case title is required'),
      caseType: Yup.string().required('Case type is required'),
      location: Yup.string().required('Location is required'),
      startDate: Yup.date().required('Start date is required'),
      endDate: Yup.date().nullable(),
      caseStatus: Yup.string().required('Case status is required'),
      objective: Yup.string().required('Objective is required'),
      workDescription: Yup.string().required('Work description is required'),
      challenges: Yup.string(),
      outcome: Yup.string(),
      photoCaptions: Yup.array().min(1, 'At least one photo with caption is required'),
      videoCaptions: Yup.array(),
      peopleHelped: Yup.number().required('Required').min(1, 'Must be at least 1'),
      resourcesUsed: Yup.string().required('Resources used is required'),
      volunteerSupport: Yup.string(),
      isPublic: Yup.boolean().oneOf([true], 'Please confirm case can be public'),
    }),
    onSubmit: async (values, { resetForm }) => {
      // Check if at least one photo is uploaded
      if (uploadedPhotos.length === 0) {
        toast.error('At least one photo is required');
        return;
      }

      setIsSubmitting(true);
      try {
        // Create the case data with media URLs from Cloudinary
        const caseData = {
          ...values,
          photoUrls: uploadedPhotos.map((photo, index) => ({
            url: photo.secure_url,
            caption: values.photoCaptions[index] || ''
          })),
          videoUrls: uploadedVideos.map((video, index) => ({
            url: video.secure_url,
            caption: values.videoCaptions[index] || ''
          }))
        };

        // Send data to backend
        await axios.post('http://localhost:5000/case/add', caseData, {
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        toast.success('Case submitted successfully!');
        resetForm();
        setUploadedPhotos([]);
        setUploadedVideos([]);
      } catch (err) {
        console.error('Error submitting case:', err);
        toast.error('Submission failed. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  // Handle photo upload
  const handlePhotoUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Reset state for new upload
    setIsPhotoUploading(true);
    setPhotoUploadProgress(0);

    // Check file size and type for each file
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }

      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        toast.error(`${file.name} is not a supported image format.`);
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) {
      setIsPhotoUploading(false);
      return;
    }

    // Initialize captions array
    const newCaptions = [...formik.values.photoCaptions];
    while (newCaptions.length < uploadedPhotos.length + validFiles.length) {
      newCaptions.push('');
    }
    formik.setFieldValue('photoCaptions', newCaptions);

    // Upload each file
    try {
      const uploadPromises = validFiles.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        
        // Use XMLHttpRequest to track progress
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', CLOUDINARY_UPLOAD_URL, true);
          
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const progress = Math.round((e.loaded / e.total) * 100);
              setPhotoUploadProgress(progress);
            }
          };
          
          xhr.onload = () => {
            if (xhr.status === 200) {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } else {
              reject(new Error('Upload failed'));
            }
          };
          
          xhr.onerror = () => reject(new Error('Upload failed'));
          xhr.send(formData);
        });
      });

      // Wait for all uploads to complete
      const results = await Promise.all(uploadPromises);
      setUploadedPhotos([...uploadedPhotos, ...results]);
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast.error('Failed to upload photos. Please try again.');
    } finally {
      setIsPhotoUploading(false);
    }
  };

  // Handle video upload
  const handleVideoUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Reset state for new upload
    setIsVideoUploading(true);
    setVideoUploadProgress(0);

    // Check file size and type for each file
    const validFiles = files.filter(file => {
      if (file.size > 100 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 100MB.`);
        return false;
      }

      if (!['video/mp4', 'video/quicktime', 'video/x-msvideo'].includes(file.type)) {
        toast.error(`${file.name} is not a supported video format.`);
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) {
      setIsVideoUploading(false);
      return;
    }

    // Initialize captions array
    const newCaptions = [...formik.values.videoCaptions];
    while (newCaptions.length < uploadedVideos.length + validFiles.length) {
      newCaptions.push('');
    }
    formik.setFieldValue('videoCaptions', newCaptions);

    // Upload each file
    try {
      const uploadPromises = validFiles.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        
        // Use XMLHttpRequest to track progress
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', CLOUDINARY_UPLOAD_URL, true);
          
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const progress = Math.round((e.loaded / e.total) * 100);
              setVideoUploadProgress(progress);
            }
          };
          
          xhr.onload = () => {
            if (xhr.status === 200) {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } else {
              reject(new Error('Upload failed'));
            }
          };
          
          xhr.onerror = () => reject(new Error('Upload failed'));
          xhr.send(formData);
        });
      });

      // Wait for all uploads to complete
      const results = await Promise.all(uploadPromises);
      setUploadedVideos([...uploadedVideos, ...results]);
    } catch (error) {
      console.error('Error uploading videos:', error);
      toast.error('Failed to upload videos. Please try again.');
    } finally {
      setIsVideoUploading(false);
    }
  };

  // Remove an uploaded photo
  const removePhoto = (index) => {
    const newPhotos = [...uploadedPhotos];
    newPhotos.splice(index, 1);
    setUploadedPhotos(newPhotos);

    const newCaptions = [...formik.values.photoCaptions];
    newCaptions.splice(index, 1);
    formik.setFieldValue('photoCaptions', newCaptions);
  };

  // Remove an uploaded video
  const removeVideo = (index) => {
    const newVideos = [...uploadedVideos];
    newVideos.splice(index, 1);
    setUploadedVideos(newVideos);

    const newCaptions = [...formik.values.videoCaptions];
    newCaptions.splice(index, 1);
    formik.setFieldValue('videoCaptions', newCaptions);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8 my-8">
      <h1 className="text-2xl font-bold mb-6">Case Management Form</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-6">

        {/* 1. Basic Case Details */}
        <div>
          <label className="block font-medium">Case Title *</label>
          <input
            type="text"
            name="caseTitle"
            className="w-full border rounded px-3 py-2"
            {...formik.getFieldProps('caseTitle')}
          />
          {formik.touched.caseTitle && formik.errors.caseTitle && (
            <div className="text-red-500 text-sm">{formik.errors.caseTitle}</div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Case Type *</label>
            <select
              name="caseType"
              className="w-full border rounded px-3 py-2"
              {...formik.getFieldProps('caseType')}
            >
              <option value="">Select type</option>
              {CASE_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {formik.touched.caseType && formik.errors.caseType && (
              <div className="text-red-500 text-sm">{formik.errors.caseType}</div>
            )}
          </div>
          <div>
            <label className="block font-medium">Location of Case *</label>
            <input
              type="text"
              name="location"
              className="w-full border rounded px-3 py-2"
              {...formik.getFieldProps('location')}
            />
            {formik.touched.location && formik.errors.location && (
              <div className="text-red-500 text-sm">{formik.errors.location}</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Start Date *</label>
            <input
              type="date"
              name="startDate"
              className="w-full border rounded px-3 py-2"
              {...formik.getFieldProps('startDate')}
            />
            {formik.touched.startDate && formik.errors.startDate && (
              <div className="text-red-500 text-sm">{formik.errors.startDate}</div>
            )}
          </div>
          <div>
            <label className="block font-medium">End Date</label>
            <input
              type="date"
              name="endDate"
              className="w-full border rounded px-3 py-2"
              {...formik.getFieldProps('endDate')}
            />
          </div>
        </div>

        <div>
          <label className="block font-medium">Case Status *</label>
          <select
            name="caseStatus"
            className="w-full border rounded px-3 py-2"
            {...formik.getFieldProps('caseStatus')}
          >
            <option value="">Select status</option>
            {CASE_STATUS.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          {formik.touched.caseStatus && formik.errors.caseStatus && (
            <div className="text-red-500 text-sm">{formik.errors.caseStatus}</div>
          )}
        </div>

        {/* 2. Detailed Case Description */}
        <div>
          <label className="block font-medium">Objective of the Case *</label>
          <textarea
            name="objective"
            className="w-full border rounded px-3 py-2"
            rows="3"
            {...formik.getFieldProps('objective')}
          />
          {formik.touched.objective && formik.errors.objective && (
            <div className="text-red-500 text-sm">{formik.errors.objective}</div>
          )}
        </div>
        
        <div>
          <label className="block font-medium">Work Description *</label>
          <textarea
            name="workDescription"
            className="w-full border rounded px-3 py-2"
            rows="4"
            {...formik.getFieldProps('workDescription')}
          />
          {formik.touched.workDescription && formik.errors.workDescription && (
            <div className="text-red-500 text-sm">{formik.errors.workDescription}</div>
          )}
        </div>
        
        <div>
          <label className="block font-medium">Challenges Faced</label>
          <textarea
            name="challenges"
            className="w-full border rounded px-3 py-2"
            rows="3"
            {...formik.getFieldProps('challenges')}
          />
        </div>
        
        <div>
          <label className="block font-medium">Outcome / Impact</label>
          <textarea
            name="outcome"
            className="w-full border rounded px-3 py-2"
            rows="3"
            {...formik.getFieldProps('outcome')}
          />
        </div>

        {/* 3. Media Uploads */}
        {/* Photo Upload Section */}
        <div className="space-y-3">
          <label className="block font-medium">Upload Photos *</label>
          
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md">
            <div className="space-y-2 text-center">
              <div className="flex justify-center">
                <Image className="mx-auto h-12 w-12 text-gray-400" strokeWidth={1} />
              </div>
              <div className="flex flex-col items-center text-sm text-gray-600">
                <label
                  htmlFor="photo-upload"
                  className="relative cursor-pointer rounded-md font-medium text-lime-600 hover:text-lime-500 focus-within:outline-none"
                >
                  <span>Upload photos</span>
                  <input
                    id="photo-upload"
                    name="photo-upload"
                    type="file"
                    multiple
                    className="sr-only"
                    ref={photoInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              
              {isPhotoUploading && (
                <div className="w-full mt-2">
                  <div className="bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-lime-600 h-2.5 rounded-full" 
                      style={{ width: `${photoUploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-center mt-1">{photoUploadProgress}% Uploaded</p>
                </div>
              )}
            </div>
          </div>
          
          {uploadedPhotos.length === 0 && formik.touched.photoCaptions && (
            <div className="text-red-500 text-sm">At least one photo is required</div>
          )}
          
          {/* Display uploaded photos with captions */}
          {uploadedPhotos.length > 0 && (
            <div className="mt-4 space-y-4">
              <h3 className="font-medium text-gray-700">Uploaded Photos ({uploadedPhotos.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {uploadedPhotos.map((photo, idx) => (
                  <div 
                    key={idx} 
                    className="border rounded-md p-3 bg-gray-50"
                  >
                    <div className="relative h-48 bg-gray-100 rounded mb-2">
                      <img 
                        src={photo.secure_url} 
                        alt={`Photo ${idx + 1}`} 
                        className="h-full w-full object-contain rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(idx)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Caption *
                      </label>
                      <input
                        type="text"
                        placeholder="Add a caption"
                        className="w-full border rounded px-2 py-1 text-sm"
                        value={formik.values.photoCaptions[idx] || ''}
                        onChange={e => {
                          const captions = [...formik.values.photoCaptions];
                          captions[idx] = e.target.value;
                          formik.setFieldValue('photoCaptions', captions);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Video Upload Section */}
        <div className="space-y-3">
          <label className="block font-medium">Upload Videos (Optional)</label>
          
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md">
            <div className="space-y-2 text-center">
              <div className="flex justify-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" strokeWidth={1} />
              </div>
              <div className="flex flex-col items-center text-sm text-gray-600">
                <label
                  htmlFor="video-upload"
                  className="relative cursor-pointer rounded-md font-medium text-lime-600 hover:text-lime-500 focus-within:outline-none"
                >
                  <span>Upload videos</span>
                  <input
                    id="video-upload"
                    name="video-upload"
                    type="file"
                    multiple
                    className="sr-only"
                    ref={videoInputRef}
                    onChange={handleVideoUpload}
                    accept="video/*"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">MP4, MOV, AVI up to 100MB</p>
              
              {isVideoUploading && (
                <div className="w-full mt-2">
                  <div className="bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-lime-600 h-2.5 rounded-full" 
                      style={{ width: `${videoUploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-center mt-1">{videoUploadProgress}% Uploaded</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Display uploaded videos with captions */}
          {uploadedVideos.length > 0 && (
            <div className="mt-4 space-y-4">
              <h3 className="font-medium text-gray-700">Uploaded Videos ({uploadedVideos.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {uploadedVideos.map((video, idx) => (
                  <div 
                    key={idx} 
                    className="border rounded-md p-3 bg-gray-50"
                  >
                    <div className="relative h-48 bg-gray-100 rounded mb-2">
                      {/* Video thumbnail or player */}
                      {video.resource_type === 'video' ? (
                        <video 
                          controls 
                          className="h-full w-full object-contain rounded"
                        >
                          <source src={video.secure_url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Check className="h-12 w-12 text-green-500" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeVideo(idx)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Caption
                      </label>
                      <input
                        type="text"
                        placeholder="Add a caption"
                        className="w-full border rounded px-2 py-1 text-sm"
                        value={formik.values.videoCaptions[idx] || ''}
                        onChange={e => {
                          const captions = [...formik.values.videoCaptions];
                          captions[idx] = e.target.value;
                          formik.setFieldValue('videoCaptions', captions);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4. People Helped / Resources Used */}
        <div>
          <label className="block font-medium">No. of People/Animals Helped *</label>
          <input
            type="number"
            name="peopleHelped"
            className="w-full border rounded px-3 py-2"
            {...formik.getFieldProps('peopleHelped')}
          />
          {formik.touched.peopleHelped && formik.errors.peopleHelped && (
            <div className="text-red-500 text-sm">{formik.errors.peopleHelped}</div>
          )}
        </div>
        
        <div>
          <label className="block font-medium">Resources Used *</label>
          <textarea
            name="resourcesUsed"
            className="w-full border rounded px-3 py-2"
            rows="3"
            {...formik.getFieldProps('resourcesUsed')}
          />
          {formik.touched.resourcesUsed && formik.errors.resourcesUsed && (
            <div className="text-red-500 text-sm">{formik.errors.resourcesUsed}</div>
          )}
        </div>
        
        <div>
          <label className="block font-medium">Volunteer Support</label>
          <textarea
            name="volunteerSupport"
            className="w-full border rounded px-3 py-2"
            rows="2"
            {...formik.getFieldProps('volunteerSupport')}
          />
        </div>

        {/* 5. Case Visibility & Verification */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isPublic"
            checked={formik.values.isPublic}
            onChange={formik.handleChange}
            className="mr-2"
          />
          <label className="font-medium">Make Case Public? *</label>
          {formik.touched.isPublic && formik.errors.isPublic && (
            <span className="text-red-500 text-sm ml-2">{formik.errors.isPublic}</span>
          )}
        </div>
        
        <div>
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            onClick={() => toast.info('Submitted for verification (admin review)!')}
          >
            Submit for Verification
          </button>
          <span className="ml-2 text-gray-600">
            Case Verification Status: <b>{formik.values.verificationStatus}</b>
          </span>
        </div>

        {/* 6. Submit Buttons */}
        <div className="flex space-x-4 mt-8">
          <button
            type="submit"
            disabled={isSubmitting || isPhotoUploading || isVideoUploading}
            className={`px-6 py-2 rounded text-white ${
              isSubmitting || isPhotoUploading || isVideoUploading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-lime-600 hover:bg-lime-700'
            }`}
          >
            {isSubmitting ? 'Saving...' : 'Save Case'}
          </button>
          <button
            type="button"
            className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
            disabled={isSubmitting || isPhotoUploading || isVideoUploading}
            onClick={() => {
              toast.success('Case saved as draft!');
              formik.resetForm();
              setUploadedPhotos([]);
              setUploadedVideos([]);
            }}
          >
            Edit Later
          </button>
        </div>
      </form>
    </div>
  );
}