'use client'
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import axios from 'axios';

const Signup = () => {
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
    }),
    onSubmit:async (values) => {
      console.log('Form Data:', values);
      // Add your form submission logic here
      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/add`,values);
        console.log(res.status);
        console.log(res.data);
        toast.success('successfully');
  
       } catch (error) {
        console.log(error);
        toast.error('Something went wrong');
        
       }

    },
    
  });

  return (
    <div>
      <>
        <div className="relative h-screen">
          <img
            src="https://studyonline.canberra.edu.au/sites/default/files/Mental%20health%20social%20worker%20in%20Australia%20-%201000%20x%20667.jpg"
            className="absolute inset-0 object-cover w-full h-full"
            alt=""
          />
          <div className="relative bg-opacity-75 bg-lime-500/70 h-full">
            <svg
              className="absolute inset-x-0 bottom-0 text-white"
              viewBox="0 0 1160 163"
            >
              <path
                fill="currentColor"
                d="M-164 13L-104 39.7C-44 66 76 120 196 141C316 162 436 152 556 119.7C676 88 796 34 916 13C1036 -8 1156 2 1216 7.7L1276 13V162.5H1216C1156 162.5 1036 162.5 916 162.5C796 162.5 676 162.5 556 162.5C436 162.5 316 162.5 196 162.5C76 162.5 -44 162.5 -104 162.5H-164V13Z"
              />
            </svg>
            <div className="relative px-4 py-16 mx-auto overflow-hidden sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
              <div className="flex flex-col items-center justify-between xl:flex-row">
                <div className="w-full max-w-xl mb-12 xl:mb-0 xl:pr-16 xl:w-7/12">
                  <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-white sm:text-4xl sm:leading-none">
                    THE SAHYOGIS <br className="hidden md:block" />
                  </h2>
                  <p className="max-w-xl mb-4 text-base text-gray-200 md:text-lg">
                    The helping hands towards social workers
                  </p>
                  <a
                    href="/"
                    aria-label=""
                    className="inline-flex items-center font-semibold tracking-wider transition-colors duration-200 text-teal-accent-400 hover:text-teal-accent-700"
                  >
                    Learn more
                    <svg
                      className="inline-block w-3 ml-2"
                      fill="currentColor"
                      viewBox="0 0 12 12"
                    >
                      <path d="M9.707,5.293l-5-5A1,1,0,0,0,3.293,1.707L7.586,6,3.293,10.293a1,1,0,1,0,1.414,1.414l5-5A1,1,0,0,0,9.707,5.293Z" />
                    </svg>
                  </a>
                </div>
                <div className="w-full max-w-xl xl:px-8 xl:w-5/12">
                  <div className="bg-black rounded shadow-2xl p-7 sm:p-10">
                    <h3 className="mb-4 text-lime-500 text-xl font-semibold sm:text-center sm:mb-6 sm:text-2xl">
                      Sign up
                    </h3>
                    <form onSubmit={formik.handleSubmit}>
                      <div className="mb-1 sm:mb-2">
                        <label
                          htmlFor="name"
                          className="inline-block text-lime-500 mb-1 font-medium"
                        >
                          Name
                        </label>
                        <input
                          placeholder="Name"
                          type="text"
                          className="flex-grow w-full h-12 px-4 mb-2 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline"
                          id="name"
                          name="name"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.name}
                        />
                        {formik.touched.name && formik.errors.name ? (
                          <p className="text-red-500 text-xs">{formik.errors.name}</p>
                        ) : null}
                      </div>
                      <div className="mb-1 sm:mb-2">
                        <label
                          htmlFor="email"
                          className="inline-block text-lime-500 mb-1 font-medium"
                        >
                          Email
                        </label>
                        <input
                          placeholder="Email"
                          type="email"
                          className="flex-grow w-full h-12 px-4 mb-2 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline"
                          id="email"
                          name="email"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.email}
                        />
                        {formik.touched.email && formik.errors.email ? (
                          <p className="text-red-500 text-xs">{formik.errors.email}</p>
                        ) : null}
                      </div>
                      <div className="mb-1 sm:mb-2">
                        <label
                          htmlFor="password"
                          className="inline-block text-lime-500 mb-1 font-medium"
                        >
                          Password
                        </label>
                        <input
                          placeholder="Password"
                          type="password"
                          className="flex-grow w-full h-12 px-4 mb-2 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline"
                          id="password"
                          name="password"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.password}
                        />
                        {formik.touched.password && formik.errors.password ? (
                          <p className="text-red-500 text-xs">{formik.errors.password}</p>
                        ) : null}
                      </div>
                      <div className="mb-1 sm:mb-2">
                        <label
                          htmlFor="confirmPassword"
                          className="inline-block text-lime-500 mb-1 font-medium"
                        >
                          Confirm Password
                        </label>
                        <input
                          placeholder="Confirm Password"
                          type="password"
                          className="flex-grow w-full h-12 px-4 mb-2 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline"
                          id="confirmPassword"
                          name="confirmPassword"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.confirmPassword}
                        />
                        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                          <p className="text-red-500 text-xs">{formik.errors.confirmPassword}</p>
                        ) : null}
                      </div>
                      <div className="mt-4 mb-2 sm:mb-4">
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center w-full h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-lime-500 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none"
                        >
                          Sign Up
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 sm:text-sm">
                        We respect your privacy. Unsubscribe at any time.
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        &nbsp;
      </>
    </div>
  );
};

export default Signup;