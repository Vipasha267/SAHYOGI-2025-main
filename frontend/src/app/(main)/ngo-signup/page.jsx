// import React from 'react';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const NgoSignup = () => {
//   const formik = useFormik({
//     initialValues: {
//       name: '',
//       email: '',
//       password: '',
//       confirmPassword: ''
//     },
//     validationSchema: Yup.object({
//       name: Yup.string().required('Name is required'),
//       email: Yup.string().email('Invalid email address').required('Email is required'),
//       password: Yup.string()
//         .min(6, 'Password must be at least 6 characters')
//         .required('Password is required'),
//       confirmPassword: Yup.string()
//         .oneOf([Yup.ref('password'), null], 'Passwords must match')
//         .required('Confirm Password is required'),
//     }),
//     onSubmit: async (values) => {
//       try {
//         const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/ngo/add`, values);
//         console.log(response.data);
//         toast.success('NGO registered successfully!');
//       } catch (error) {
//         console.error(error);
//         toast.error('Something went wrong. Please try again.');
//       }
//     },
//   });

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow-md">
//         <h2 className="text-2xl font-bold text-center text-gray-800">NGO Signup</h2>
//         <form onSubmit={formik.handleSubmit}>
//           <div className="mb-4">
//             <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//               Name
//             </label>
//             <input
//               id="name"
//               type="text"
//               placeholder="Enter your name"
//               className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
//               onChange={formik.handleChange}
//               value={formik.values.name}
//             />
//             {formik.touched.name && formik.errors.name ? (
//               <p className="mt-1 text-xs text-red-500">{formik.errors.name}</p>
//             ) : null}
//           </div>
//           <div className="mb-4">
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//               Email
//             </label>
//             <input
//               id="email"
//               type="email"
//               placeholder="Enter your email"
//               className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
//               onChange={formik.handleChange}
//               value={formik.values.email}
//             />
//             {formik.touched.email && formik.errors.email ? (
//               <p className="mt-1 text-xs text-red-500">{formik.errors.email}</p>
//             ) : null}
//           </div>
//           <div className="mb-4">
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//               Password
//             </label>
//             <input
//               id="password"
//               type="password"
//               placeholder="Enter your password"
//               className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
//               onChange={formik.handleChange}
//               value={formik.values.password}
//             />
//             {formik.touched.password && formik.errors.password ? (
//               <p className="mt-1 text-xs text-red-500">{formik.errors.password}</p>
//             ) : null}
//           </div>
//           <div className="mb-4">
//             <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
//               Confirm Password
//             </label>
//             <input
//               id="confirmPassword"
//               type="password"
//               placeholder="Confirm your password"
//               className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
//               onChange={formik.handleChange}
//               value={formik.values.confirmPassword}
//             />
//             {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
//               <p className="mt-1 text-xs text-red-500">{formik.errors.confirmPassword}</p>
//             ) : null}
//           </div>
//           <button
//             type="submit"
//             className="w-full px-4 py-2 text-white bg-lime-500 rounded-md hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-lime-500"
//           >
//             Sign Up
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default NgoSignup;

"use client"
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast';

const NgoSignup = () => {
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
    onSubmit: async (values) => {
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/ngo/add`, values);
        console.log(response.data);
        toast.success('NGO registered successfully!');
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong. Please try again.');
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-black rounded shadow-md">
        <h2 className="text-2xl font-bold text-center text-lime-500">NGO Signup</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-lime-500">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />
            {formik.touched.name && formik.errors.name ? (
              <p className="mt-1 text-xs text-red-500">{formik.errors.name}</p>
            ) : null}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-lime-500">
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
            <label htmlFor="password" className="block text-sm font-medium text-lime-500">
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
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-lime-500">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <p className="mt-1 text-xs text-red-500">{formik.errors.confirmPassword}</p>
            ) : null}
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-black bg-lime-500 rounded-md hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-lime-500"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
    
  );
};

export default NgoSignup;