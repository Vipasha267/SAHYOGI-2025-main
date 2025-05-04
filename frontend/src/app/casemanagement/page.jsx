'use client';
import { useState } from 'react';
import { useFormik, FieldArray } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const CASE_TYPES = [
  'Child Welfare', 'Animal Rescue', 'Women Empowerment', 'Education',
  'Orphanage Help', 'Old Age Care', 'Rural Development'
];
const CASE_STATUS = ['Planned', 'In Progress', 'Completed', 'On Hold'];

export default function CaseManagementForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      photos: Yup.array().min(1, 'At least one photo is required'),
      photoCaptions: Yup.array().of(Yup.string().required('Caption required')),
      videos: Yup.array(),
      videoCaptions: Yup.array(),
      peopleHelped: Yup.number().required('Required').min(1, 'Must be at least 1'),
      resourcesUsed: Yup.string().required('Resources used is required'),
      volunteerSupport: Yup.string(),
      isPublic: Yup.boolean().oneOf([true], 'Please confirm case can be public'),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      try {
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
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Case submitted successfully!');
        resetForm();
      } catch (err) {
        toast.error('Submission failed. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  // Handle file input for photos/videos
  const handleFileChange = (event, field) => {
    const files = Array.from(event.target.files);
    formik.setFieldValue(field, files);
    // Set captions array length to match files
    if (field === 'photos') {
      formik.setFieldValue('photoCaptions', Array(files.length).fill(''));
    } else if (field === 'videos') {
      formik.setFieldValue('videoCaptions', Array(files.length).fill(''));
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8 my-8">
      <h1 className="text-2xl font-bold mb-6">Case Management Form</h1>
      <form onSubmit={formik.handleSubmit} encType="multipart/form-data" className="space-y-6">

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
            {...formik.getFieldProps('challenges')}
          />
        </div>
        <div>
          <label className="block font-medium">Outcome / Impact</label>
          <textarea
            name="outcome"
            className="w-full border rounded px-3 py-2"
            {...formik.getFieldProps('outcome')}
          />
        </div>

        {/* 3. Media Uploads */}
        <div>
          <label className="block font-medium">Upload Photos *</label>
          <input
            type="file"
            name="photos"
            accept="image/*"
            multiple
            onChange={e => handleFileChange(e, 'photos')}
            className="block w-full"
          />
          {formik.touched.photos && formik.errors.photos && (
            <div className="text-red-500 text-sm">{formik.errors.photos}</div>
          )}
          {/* Captions for each photo */}
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
                  {formik.touched.photoCaptions && formik.errors.photoCaptions && formik.errors.photoCaptions[idx] && (
                    <span className="text-red-500 text-xs">{formik.errors.photoCaptions[idx]}</span>
                  )}
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
            className="block w-full"
          />
          {/* Captions for each video */}
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
            onClick={() => toast('Submitted for verification (admin review)!')}
          >
            Submit for Verification
          </button>
          <span className="ml-2 text-gray-600">
            Case Verification Status: <b>{formik.values.verificationStatus}</b>
          </span>
        </div>

        {/* 6. Submit Buttons */}
        <div className="flex space-x-4 mt-4">
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
            onClick={() => {
              toast('Case saved as draft!');
              formik.resetForm();
            }}
          >
            Edit Later
          </button>
        </div>
      </form>
    </div>
  );
}