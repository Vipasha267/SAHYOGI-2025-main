'use client';
import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Building, Clock, MapPin, User, FileText, Plus } from 'lucide-react';
import Link from 'next/link';

const CASE_TYPES = [
  'Child Welfare', 'Animal Rescue', 'Women Empowerment', 'Education',
  'Orphanage Help', 'Old Age Care', 'Rural Development'
];
const CASE_STATUS = ['Planned', 'In Progress', 'Completed', 'On Hold'];

// Improved validation schema
const validationSchema = Yup.object({
  caseTitle: Yup.string()
    .required('Case title is required')
    .min(5, 'Case title must be at least 5 characters')
    .max(100, 'Case title must not exceed 100 characters'),
  
  caseType: Yup.string()
    .required('Case type is required')
    .oneOf(CASE_TYPES, 'Please select a valid case type'),
  
  location: Yup.string()
    .required('Location is required')
    .min(3, 'Location must be at least 3 characters')
    .max(100, 'Location must not exceed 100 characters'),
  
  startDate: Yup.date()
    .required('Start date is required')
    .max(new Date(), 'Start date cannot be in the future'),
  
  endDate: Yup.date()
    .nullable()
    .min(Yup.ref('startDate'), 'End date must be after start date'),
  
  caseStatus: Yup.string()
    .required('Case status is required')
    .oneOf(CASE_STATUS, 'Please select a valid case status'),
  
  objective: Yup.string()
    .required('Objective is required')
    .min(20, 'Objective must be at least 20 characters')
    .max(500, 'Objective must not exceed 500 characters'),
  
  workDescription: Yup.string()
    .required('Work description is required')
    .min(50, 'Work description must be at least 50 characters')
    .max(1000, 'Work description must not exceed 1000 characters'),
  
  challenges: Yup.string()
    .max(500, 'Challenges must not exceed 500 characters'),
  
  outcome: Yup.string()
    .max(500, 'Outcome must not exceed 500 characters'),
  
  photos: Yup.array()
    .min(1, 'At least one photo is required')
    .test('fileSize', 'Each file must be less than 5MB', (value) => {
      if (!value) return true;
      return value.every(file => file.size <= 5 * 1024 * 1024);
    })
    .test('fileType', 'Only image files are allowed', (value) => {
      if (!value) return true;
      return value.every(file => file.type.startsWith('image/'));
    }),
  
  photoCaptions: Yup.array()
    .of(Yup.string()
      .required('Caption is required')
      .min(5, 'Caption must be at least 5 characters')
      .max(100, 'Caption must not exceed 100 characters'))
    .test('captions-length', 'Each photo must have a caption', function(value) {
      return value?.length === this.parent.photos.length;
    }),
  
  videos: Yup.array()
    .test('fileSize', 'Each video must be less than 100MB', (value) => {
      if (!value) return true;
      return value.every(file => file.size <= 100 * 1024 * 1024);
    })
    .test('fileType', 'Only video files are allowed', (value) => {
      if (!value) return true;
      return value.every(file => file.type.startsWith('video/'));
    }),
  
  videoCaptions: Yup.array()
    .of(Yup.string()
      .min(5, 'Caption must be at least 5 characters')
      .max(100, 'Caption must not exceed 100 characters'))
    .test('captions-length', 'Each video must have a caption', function(value) {
      return !this.parent.videos.length || value?.length === this.parent.videos.length;
    }),
  
  peopleHelped: Yup.number()
    .required('Number of people helped is required')
    .integer('Must be a whole number')
    .min(1, 'Must help at least 1 person/animal')
    .max(1000000, 'Number seems too high, please verify'),
  
  resourcesUsed: Yup.string()
    .required('Resources used is required')
    .min(20, 'Please provide more detail about resources used')
    .max(500, 'Resources description must not exceed 500 characters'),
  
  volunteerSupport: Yup.string()
    .max(500, 'Volunteer support description must not exceed 500 characters'),
  
  isPublic: Yup.boolean()
    .oneOf([true], 'Case must be marked as public')
    .required('Please confirm case can be public'),
  
  verificationStatus: Yup.string()
    .oneOf(['Pending', 'Verified', 'Rejected'], 'Invalid verification status')
});

export default function NGOCaseManagement() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // list or form
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    
    if (!token || userType !== 'ngo') {
      router.push('/ngo-login');
      return;
    }

    fetchCases();
  }, [router]);

  const fetchCases = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/casemanagement/ngo/cases`, {
        headers: { Authorization: `Bearer ${token}` },
        
      });
      setCases(response.data);
    } catch (error) {
      console.error('Error fetching cases:', error);
      toast.error('Failed to load cases');
    } finally {
      setLoading(false);
    }
  };

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
      photos: [],
      photoCaptions: [],
      videos: [],
      videoCaptions: [],
      peopleHelped: '',
      resourcesUsed: '',
      volunteerSupport: '',
      isPublic: false,
      verificationStatus: 'Pending'
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      try {
        const token = localStorage.getItem('token');
        
        // Create FormData for file upload
        const formData = new FormData();
        
        // Add all text fields
        Object.keys(values).forEach(key => {
          if (!['photos', 'videos', 'photoCaptions', 'videoCaptions'].includes(key)) {
            formData.append(key, values[key]);
          }
        });
        
        // Add files and their captions
        values.photos.forEach((photo, index) => {
          formData.append('photos', photo);
          formData.append('photoCaptions', values.photoCaptions[index] || '');
        });
        
        values.videos.forEach((video, index) => {
          formData.append('videos', video);
          formData.append('videoCaptions', values.videoCaptions[index] || '');
        });

        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/casemanagement/add`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });

        toast.success('Case submitted successfully!');
        resetForm();
        setView('list');
        fetchCases();
      } catch (err) {
        console.error('Submission error:', err);
        toast.error(err.response?.data?.message || 'Submission failed. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  const handleFileChange = (event, field) => {
    const files = Array.from(event.target.files);
    formik.setFieldValue(field, files);
    if (field === 'photos') {
      formik.setFieldValue('photoCaptions', Array(files.length).fill(''));
    } else if (field === 'videos') {
      formik.setFieldValue('videoCaptions', Array(files.length).fill(''));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
      </div>
    );
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'planned':
        return 'bg-blue-100 text-blue-800';
      case 'on hold':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Case Management</h1>
          {view === 'list' ? (
            <button
              onClick={() => setView('form')}
              className="bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Plus size={20} className="mr-2" />
              New Case
            </button>
          ) : (
            <button
              onClick={() => setView('list')}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back to Cases
            </button>
          )}
        </div>

        {view === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases.map((case_item) => (
              <div key={case_item._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg">{case_item.caseTitle}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(case_item.caseStatus)}`}>
                      {case_item.caseStatus}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin size={16} className="mr-2" />
                      {case_item.location}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock size={16} className="mr-2" />
                      Started: {formatDate(case_item.startDate)}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <User size={16} className="mr-2" />
                      People helped: {case_item.peopleHelped}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-4">
                    {case_item.objective.substring(0, 150)}...
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-xs text-gray-500">
                      {case_item.isPublic ? 'Public' : 'Private'} Case
                    </div>
                    <Link
                      href={`/ngo/case-management/${case_item._id}`}
                      className="text-lime-600 hover:text-lime-700 font-medium text-sm"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {cases.length === 0 && (
              <div className="col-span-full text-center py-12">
                <FileText size={40} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">No cases yet</p>
                <button
                  onClick={() => setView('form')}
                  className="mt-4 text-lime-600 hover:text-lime-700 font-medium"
                >
                  Create your first case
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
            <h2 className="text-xl font-bold mb-6">Create New Case</h2>
            <form onSubmit={formik.handleSubmit} encType="multipart/form-data" className="space-y-6">
              {/* Basic Case Details */}
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
                  <label className="block font-medium">Location *</label>
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

              <div>
                <label className="block font-medium">Objective *</label>
                <textarea
                  name="objective"
                  rows={3}
                  className="w-full border rounded px-3 py-2"
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
                  rows={3}
                  className="w-full border rounded px-3 py-2"
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
                  rows={3}
                  className="w-full border rounded px-3 py-2"
                  {...formik.getFieldProps('challenges')}
                />
              </div>

              <div>
                <label className="block font-medium">Outcome / Impact</label>
                <textarea
                  name="outcome"
                  rows={3}
                  className="w-full border rounded px-3 py-2"
                  {...formik.getFieldProps('outcome')}
                />
              </div>

              <div>
                <label className="block font-medium">Upload Photos *</label>
                <input
                  type="file"
                  name="photos"
                  accept="image/*"
                  multiple
                  onChange={e => handleFileChange(e, 'photos')}
                  className="block w-full border rounded px-3 py-2"
                />
                {formik.touched.photos && formik.errors.photos && (
                  <div className="text-red-500 text-sm">{formik.errors.photos}</div>
                )}
                {formik.values.photos.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {formik.values.photos.map((file, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">{file.name}</span>
                        <input
                          type="text"
                          placeholder="Caption"
                          className="border rounded px-2 py-1 flex-1"
                          value={formik.values.photoCaptions[idx] || ''}
                          onChange={e => {
                            const captions = [...formik.values.photoCaptions];
                            captions[idx] = e.target.value;
                            formik.setFieldValue('photoCaptions', captions);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block font-medium">Upload Videos</label>
                <input
                  type="file"
                  name="videos"
                  accept="video/*"
                  multiple
                  onChange={e => handleFileChange(e, 'videos')}
                  className="block w-full border rounded px-3 py-2"
                />
                {formik.values.videos.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {formik.values.videos.map((file, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">{file.name}</span>
                        <input
                          type="text"
                          placeholder="Caption"
                          className="border rounded px-2 py-1 flex-1"
                          value={formik.values.videoCaptions[idx] || ''}
                          onChange={e => {
                            const captions = [...formik.values.videoCaptions];
                            captions[idx] = e.target.value;
                            formik.setFieldValue('videoCaptions', captions);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block font-medium">Number of People/Animals Helped *</label>
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
                  rows={3}
                  className="w-full border rounded px-3 py-2"
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
                  rows={3}
                  className="w-full border rounded px-3 py-2"
                  {...formik.getFieldProps('volunteerSupport')}
                />
              </div>

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

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-lime-600 text-white px-6 py-2 rounded hover:bg-lime-700"
                >
                  {isSubmitting ? 'Saving...' : 'Save Case'}
                </button>
                <button
                  type="button"
                  className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
                  onClick={() => setView('list')}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}