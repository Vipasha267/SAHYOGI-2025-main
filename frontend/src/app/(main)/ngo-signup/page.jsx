'use client'
import axios from 'axios';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';

const NgoSignup = () => {
  const router = useRouter();

  const signupForm = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      // ...add other fields as needed
    },
    onSubmit: (values) => {
      axios.post('http://localhost:5000/ngo/add', values)
        .then((result) => {
          toast.success('NGO registered successfully!');
          router.push('/login');
        })
        .catch((error) => {
          toast.error('Signup failed');
        });
    },
  });

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <img
        src="https://ofhsoupkitchen.org/wp-content/uploads/2024/01/how-to-help-others-2.jpg"
        className="absolute inset-0 w-full h-full object-cover"
        alt=""
      />
      <div className="absolute inset-0 bg-lime-500/70 bg-opacity-80"></div>
      <div className="relative z-10 w-full mr-150 ml-150 mx-auto px-4 py-10 sm:px-6 flex items-center justify-center">
        <div className=" w-full bg-white border border-gray-200 rounded-xl shadow-2xs dark:bg-neutral-900 dark:border-neutral-700">
          <div className="p-5">
            <h1 className="text-2xl font-bold text-center mb-4 text-black dark:text-white">NGO Signup</h1>
            <form onSubmit={signupForm.handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-black dark:text-neutral-300">Name</label>
                <input
                  type="text"
                  name="name"
                  onChange={signupForm.handleChange}
                  value={signupForm.values.name}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-black dark:text-neutral-300">Email</label>
                <input
                  type="email"
                  name="email"
                  onChange={signupForm.handleChange}
                  value={signupForm.values.email}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-black dark:text-neutral-300">Password</label>
                <input
                  type="password"
                  name="password"
                  onChange={signupForm.handleChange}
                  value={signupForm.values.password}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
                  required
                />
              </div>
              {/* Add more fields as needed */}
              
<div>
  <label className="block text-sm mb-1 text-black dark:text-neutral-300">Bio</label>
  <textarea
    name="bio"
    onChange={signupForm.handleChange}
    value={signupForm.values.bio}
    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
    rows={2}
  />
</div>
<div>
  <label className="block text-sm mb-1 text-black dark:text-neutral-300">Government ID</label>
  <input
    type="number"
    name="Government_ID"
    onChange={signupForm.handleChange}
    value={signupForm.values.Government_ID}
    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
    required
  />
</div>
<div>
  <label className="block text-sm mb-1 text-black dark:text-neutral-300">Address</label>
  <input
    type="text"
    name="address"
    onChange={signupForm.handleChange}
    value={signupForm.values.address}
    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
  />
</div>
<div>
  <label className="block text-sm mb-1 text-black dark:text-neutral-300">Type of Social Work</label>
  <input
    type="text"
    name="type_of_SocialWork"
    onChange={signupForm.handleChange}
    value={signupForm.values.type_of_SocialWork}
    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
  />
</div>
<div>
  <label className="block text-sm mb-1 text-black dark:text-neutral-300">Year of Experience</label>
  <input
    type="number"
    name="year_of_experience"
    onChange={signupForm.handleChange}
    value={signupForm.values.year_of_experience}
    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
  />
</div>
<div>
  <label className="block text-sm mb-1 text-black dark:text-neutral-300">NGO Name</label>
  <input
    type="text"
    name="ngo_name"
    onChange={signupForm.handleChange}
    value={signupForm.values.ngo_name}
    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
  />
</div>
<div>
  <label className="block text-sm mb-1 text-black dark:text-neutral-300">NGO Registration Number</label>
  <input
    type="number"
    name="ngo_Registration_Number"
    onChange={signupForm.handleChange}
    value={signupForm.values.ngo_Registration_Number}
    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
    required
  />
</div>
<div>
  <label className="block text-sm mb-1 text-black dark:text-neutral-300">Geographic Area of Work</label>
  <input
    type="text"
    name="geographic_area_of_Work"
    onChange={signupForm.handleChange}
    value={signupForm.values.geographic_area_of_Work}
    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
  />
</div>
<div>
  <label className="block text-sm mb-1 text-black dark:text-neutral-300">Proof of Work (URL or Description)</label>
  <input
    type="text"
    name="proof_of_work"
    onChange={signupForm.handleChange}
    value={signupForm.values.proof_of_work}
    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
  />
</div>
              <button
                type="submit"
                className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-lime-500 text-black hover:bg-lime-700 focus:outline-hidden focus:bg-lime-700"
              >
                Sign up
              </button>
              <div className="text-center text-sm text-gray-500">
             <p>you already have an account ? <a href="/ngo-login" className="text-lime-600 hover:underline">Login</a></p>
           </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NgoSignup;