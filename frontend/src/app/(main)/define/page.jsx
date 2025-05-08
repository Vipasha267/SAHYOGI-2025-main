'use client';
import React from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { Container } from 'lucide-react';

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
    <div className="relative h-screen">
      <img src="https://ofhsoupkitchen.org/wp-content/uploads/2024/01/how-to-help-others-2.jpg"
        className="absolute inset-0 object-cover w-full h-full" alt="" />
      <div className="relative h-screen bg-opacity-75 bg-lime-500/70 min-h-screen flex items-center justify-center ">
      {/* <div className="relative h-screen flex items-center justify-center bg-opacity-75 bg-lime-500/70 "> */}

      <form onSubmit={formik.handleSubmit} className="flex gap-12">

        {/* NGO Box */}
        <div className="flex flex-col">
      
        <div className="bg-white rounded-lg shadow-lg p-5 flex flex-col items-center justify-center h-150 w-150">
        <h2 className="text-3xl font-bold mb-4">Are you an NGO?</h2>
        <img src="ngo1.jpg" alt="NGO" className="w-120 h-90 mb-4" />
          
          <Link

            type="button"

            className="bg-lime-600 text-white px-6 py-2 rounded hover:bg-lime-700 transition"
            href="/socialworker-signup"
            onClick={() => {
              formik.setFieldValue('role', 'socialworker');
              formik.handleSubmit();
            }}
          >
           <h2 className="text-xl font-bold mb-4">I am an NGO</h2>
          </Link>
        </div>
        </div>
        {/* Social Worker Box */}
        <div className="flex flex-col">
        <div className="bg-white rounded-lg shadow-lg flex flex-col items-center justify-center h-150 w-150">
        <h2 className="text-3xl font-bold mb-4">Are you a Social worker?</h2>
        <img src="sw1.webp" alt="Social Worker" className="w-110 h-90 mb-4" />
          
          <Link
             
            type="button"

            className="bg-lime-600 text-white px-6 py-2 rounded hover:bg-lime-700 transition"
            href="/socialworker-signup"
            onClick={() => {
              formik.setFieldValue('role', 'socialworker');
              formik.handleSubmit();
            }}
          >
           <h2 className="text-xl font-bold mb-4">I am a Social Worker</h2>
          </Link>
        </div>
        </div>
         </form>
         </div>
         </div>
    
    
  );
}
