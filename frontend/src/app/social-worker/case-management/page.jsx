'use client';
import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Users, Clock, MapPin, User, FileText, Plus, Building } from 'lucide-react';
import Link from 'next/link';

const CASE_TYPES = [
  'Child Welfare', 'Animal Rescue', 'Women Empowerment', 'Education',
  'Orphanage Help', 'Old Age Care', 'Rural Development'
];
const CASE_STATUS = ['Planned', 'In Progress', 'Completed', 'On Hold'];

export default function SocialWorkerCaseManagement() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // list or form
  const [affiliatedNGOs, setAffiliatedNGOs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    
    if (!token || userType !== 'socialworker') {
      router.push('/socialworker-login');
      return;
    }

    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [casesRes, ngosRes] = await Promise.all([
        axios.get('http://localhost:5000/case/socialworker/cases', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/socialworker/affiliated-ngos', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setCases(casesRes.data);
      setAffiliatedNGOs(ngosRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
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
      photoCaptions: [''],
      videos: [],
      videoCaptions: [''],
      peopleHelped: '',
      resourcesUsed: '',
      volunteerSupport: '',
      isPublic: false,
      verificationStatus: 'Pending',
      affiliatedNGO: '' // Additional field for social workers
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
      peopleHelped: Yup.number().required('Required').min(1, 'Must be at least 1'),
      resourcesUsed: Yup.string().required('Resources used is required'),
      isPublic: Yup.boolean().oneOf([true], 'Please confirm case can be public'),
      affiliatedNGO: Yup.string() // Optional NGO affiliation
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        Object.entries(values).forEach(([key, val]) => {
          if (key === 'photos' || key === 'videos') {
            val.forEach((file) => formData.append(key, file));
          } else if (key === 'photoCaptions' || key === 'videoCaptions') {
            val.forEach((caption) => formData.append(key, caption));
          } else {
            formData.append(key, val);
          }
        });

        await axios.post('http://localhost:5000/case/add', formData, {
          headers: { 
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
        toast.success('Case submitted successfully!');
        resetForm();
        setView('list');
        fetchData();
      } catch (err) {
        toast.error('Submission failed. Please try again.');
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
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
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center"
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
                    {case_item.affiliatedNGO && (
                      <div className="flex items-center text-gray-600">
                        <Building size={16} className="mr-2" />
                        NGO: {case_item.affiliatedNGO}
                      </div>
                    )}
                  </div>

                  <div className="text-sm text-gray-600 mb-4">
                    {case_item.objective.substring(0, 150)}...
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-xs text-gray-500">
                      {case_item.isPublic ? 'Public' : 'Private'} Case
                    </div>
                    <Link
                      href={`/social-worker/case-management/${case_item._id}`}
                      className="text-purple-600 hover:text-purple-700 font-medium text-sm"
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
                  className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
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

              <div>
                <label className="block font-medium">Associated NGO</label>
                <select
                  name="affiliatedNGO"
                  className="w-full border rounded px-3 py-2"
                  {...formik.getFieldProps('affiliatedNGO')}
                >
                  <option value="">None (Independent Work)</option>
                  {affiliatedNGOs.map(ngo => (
                    <option key={ngo._id} value={ngo._id}>{ngo.ngo_name}</option>
                  ))}
                </select>
              </div>

              {/* Rest of the form fields from the original case management form */}
              {/* ... */}

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
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