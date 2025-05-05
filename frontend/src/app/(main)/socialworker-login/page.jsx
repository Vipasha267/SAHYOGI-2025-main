'use client'
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';

const Socialworkerlogin = () => {
  const router = useRouter();
  const [loginError, setLoginError] = useState(null);
  
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string()
        .required('Password is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setLoginError(null);
        console.log('Login attempt:', values.email);
        
        const response = await fetch('http://localhost:5000/socialworker/authenticate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: values.email,
            password: values.password
          }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          console.log('Login successful');
          // Store the token in localStorage
          localStorage.setItem('token', data.token);
          
          // Redirect to dashboard
          router.push('/socialworker-dashboard');
        } else {
          setLoginError(data.message || 'Login failed. Please check your credentials.');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        setLoginError('An error occurred during login. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Social Worker Login</h2>
        
        {loginError && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded">
            {loginError}
          </div>
        )}
        
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <p className="mt-1 text-xs text-red-500">{formik.errors.email}</p>
            ) : null}
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password ? (
              <p className="mt-1 text-xs text-red-500">{formik.errors.password}</p>
            ) : null}
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-lime-500 rounded-md hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-lime-500"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="text-center text-sm text-gray-500">
          <p>Don't have an account? <a href="/socialworker-register" className="text-lime-600 hover:underline">Register</a></p>
        </div>
      </div>
    </div>
  );
};

export default Socialworkerlogin;