'use client';
import React from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function DefinePage() {
  const formik = useFormik({
    initialValues: { role: '' },
    onSubmit: async (values) => {
      try {
        await axios.post('http://localhost:5000/define/choose', values);
        toast.success(`You selected: ${values.role === 'ngo' ? 'NGO' : 'Social Worker'}`);
      } catch (err) {
        toast.error('Submission failed');
      }
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={formik.handleSubmit} className="flex gap-12">
        {/* NGO Box */}
        <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center w-64">
          <h2 className="text-xl font-bold mb-4">Are you an NGO?</h2>
          <Link

            type="button"
            href="/ngo-signup"
            className="bg-lime-600 text-white px-6 py-2 rounded hover:bg-lime-700 transition"
            onClick={() => {
              formik.setFieldValue('role', 'ngo');
              formik.handleSubmit();
            }}
          >
            I am an NGO
          </Link>
        </div>
        {/* Social Worker Box */}
        <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center w-64">
          <h2 className="text-xl font-bold mb-4">Are you a Social Worker?</h2>
          <Link
          
            type="button"
            
            className="bg-lime-600 text-white px-6 py-2 rounded hover:bg-lime-700 transition"
            href="/socialworker-signup"
            onClick={() => {
              formik.setFieldValue('role', 'socialworker');
              formik.handleSubmit();
            }}
          >
            I am a Social Worker
          </Link>
        </div>
      </form>
    </div>
  );
}