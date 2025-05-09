'use client';
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { BookOpen, Video, Image, Users, Newspaper } from 'lucide-react';

const AWARENESS_TYPES = [
  { value: 'article', label: 'Social Article', icon: <BookOpen className="inline mr-1" /> },
  { value: 'story', label: 'Success Story', icon: <Users className="inline mr-1" /> },
  { value: 'guide', label: 'Volunteer Guide', icon: <BookOpen className="inline mr-1" /> },
  { value: 'video', label: 'Awareness Video', icon: <Video className="inline mr-1" /> },
  { value: 'infographic', label: 'Infographic', icon: <Image className="inline mr-1" /> }
];

export default function AwarenessPage() {
  const [awarenessList, setAwarenessList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch awareness content
  useEffect(() => {
    axios.get('http://localhost:5000/awareness/getall')
      .then(res => setAwarenessList(res.data))
      .catch(() => toast.error('Failed to load awareness content'))
      .finally(() => setLoading(false));
  }, []);

  // Formik for new awareness submission
  const formik = useFormik({
    initialValues: {
      title: '',
      type: '',
      content: '',
      mediaUrl: '',
      author: '',
      tags: ''
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        await axios.post('http://localhost:5000/awareness/add', {
          ...values,
          tags: values.tags.split(',').map(t => t.trim()).filter(Boolean)
        });
        toast.success('Awareness content submitted!');
        resetForm();
      } catch (err) {
        toast.error('Submission failed');
      }
    }
  });

  // Helper to render media
  const renderMedia = (item) => {
    if (item.type === 'video' && item.mediaUrl) {
      // YouTube or direct video
      let embedUrl = item.mediaUrl;
      if (embedUrl.includes('youtube.com') || embedUrl.includes('youtu.be')) {
        if (embedUrl.includes('youtu.be/')) {
          const id = embedUrl.split('youtu.be/')[1].split('?')[0];
          embedUrl = `https://www.youtube.com/embed/${id}`;
        } else if (embedUrl.includes('youtube.com/watch')) {
          const urlObj = new URL(embedUrl);
          const id = urlObj.searchParams.get('v');
          embedUrl = `https://www.youtube.com/embed/${id}`;
        }
        return (
          <div className="aspect-w-16 aspect-h-9 mb-3">
            <iframe
              src={embedUrl}
              title={item.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded"
            ></iframe>
          </div>
        );
      }
      // Direct video file
      return (
        <video controls className="w-full rounded mb-3">
          <source src={item.mediaUrl} />
          Your browser does not support the video tag.
        </video>
      );
    }
    if (item.type === 'infographic' && item.mediaUrl) {
      return (
        <img src={item.mediaUrl} alt={item.title} className="w-full rounded mb-3" />
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Awareness & Inspiration</h1>
        <p className="mb-8 text-center text-gray-600">
          Explore social articles, success stories, volunteer guides, awareness videos, infographics, and more.
        </p>

        {/* Awareness Submission Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-10">
          <h2 className="text-xl font-bold mb-4">Share Awareness Content</h2>
          <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Title</label>
              <input
                type="text"
                name="title"
                className="w-full border rounded px-3 py-2"
                {...formik.getFieldProps('title')}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Type</label>
              <select
                name="type"
                className="w-full border rounded px-3 py-2"
                {...formik.getFieldProps('type')}
              >
                <option value="">Select type</option>
                {AWARENESS_TYPES.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium mb-1">Content / Description</label>
              <textarea
                name="content"
                className="w-full border rounded px-3 py-2"
                rows={3}
                {...formik.getFieldProps('content')}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Media URL (YouTube, Image, etc.)</label>
              <input
                type="text"
                name="mediaUrl"
                className="w-full border rounded px-3 py-2"
                {...formik.getFieldProps('mediaUrl')}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Author</label>
              <input
                type="text"
                name="author"
                className="w-full border rounded px-3 py-2"
                {...formik.getFieldProps('author')}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium mb-1">Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                className="w-full border rounded px-3 py-2"
                {...formik.getFieldProps('tags')}
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="bg-lime-600 text-white px-6 py-2 rounded hover:bg-lime-700"
              >
                Submit Content
              </button>
            </div>
          </form>
        </div>

        {/* Awareness Content List */}
        <div className="space-y-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading awareness content...</p>
            </div>
          ) : awarenessList.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              No awareness content available yet.
            </div>
          ) : (
            awarenessList.map(item => (
              <div key={item._id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-2">
                  {AWARENESS_TYPES.find(t => t.value === item.type)?.icon}
                  <span className="ml-2 font-semibold text-lg">{item.title}</span>
                  <span className="ml-4 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{item.type}</span>
                </div>
                <div className="text-gray-500 text-sm mb-2">
                  {item.author && <>By <span className="font-medium">{item.author}</span> | </>}
                  {item.date && new Date(item.date).toLocaleDateString()}
                </div>
                {renderMedia(item)}
                <div className="mb-2">{item.content}</div>
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.tags.map((tag, idx) => (
                      <span key={idx} className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                {/* Blog/newsletter link if present */}
                {item.type === 'article' && item.mediaUrl && (
                  <a
                    href={item.mediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:underline mt-2"
                  >
                    <Newspaper className="w-4 h-4 mr-1" /> Read Full Article / Newsletter
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}