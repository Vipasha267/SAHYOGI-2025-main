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
      bio:'',
      Government_ID:'',
      Adress:'',
      type_of_ngo:'',
      year_of_experience:'',
      ngo_name:'',
      ngo_registered_number:'',
      geographic_area_of_work:'',
      proof_of_work:'',
      
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
          <div className="mb-4">
            <label htmlFor="bio" className="block text-sm font-medium text-lime-500">
              BIO
            </label>
            <input
              id="bio"
              name="bio"
              type="bio"
              placeholder="Right something about your NGO"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.bio}
            />
            {formik.touched.bio && formik.errors.bio ? (
              <p className="mt-1 text-xs text-red-500">{formik.errors.name}</p>
            ) : null}
          </div>
          <div className="mb-4">
            <label htmlFor="Government_ID" className="block text-sm font-medium text-lime-500">
            Government_ID
            </label>
            <input
              id="Government_ID"
              name="Government_ID"
              type="NUMBER"
              placeholder="Government_ID"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.Government_ID}
            />
            {formik.touched.Government_ID&& formik.errors.Government_ID ? (
              <p className="mt-1 text-xs text-red-500">{formik.errors.Government_ID}</p>
            ) : null}
          </div>
          <div className="mb-4">
            <label htmlFor="adress" className="block text-sm font-medium text-lime-500">
              Adress
            </label>
            <input
              id="adress"
              name="adress"
              type="adress"
              placeholder="Enter your Adress"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.adress}
            />
            {formik.touched.adress&& formik.errors.adress ? (
              <p className="mt-1 text-xs text-red-500">{formik.errors.adress}</p>
            ) : null}
          </div>
          <div className="mb-4">
            <label htmlFor="type_of_ngo" className="block text-sm font-medium text-lime-500">
            Type_of_ngo
            </label>
            <input
              id="type_of_ngo"
              name="type_of_ngo"
              type="text"
              placeholder="Enter your type_of_ngo"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.type_of_ngo}
            />
            {formik.touched. type_of_ngo&& formik.errors.type_of_ngo ? (
              <p className="mt-1 text-xs text-red-500">{formik.errors.type_of_ngo}</p>
            ) : null}
          </div>
          <div className="mb-4">
            <label htmlFor="year_of_experience" className="block text-sm font-medium text-lime-500">
            Year_of_experience
            </label>
            <input
              id="year_of_experience"
              name="year_of_experience"
              type="NUMBER"
              placeholder="Enter your year_of_experience"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.year_of_experience}
            />
            {formik.touched.year_of_experience&& formik.errors.year_of_experience ? (
              <p className="mt-1 text-xs text-red-500">{formik.errors.year_of_experience}</p>
            ) : null}
          </div>
          <div className="mb-4">
            <label htmlFor="ngo_name" className="block text-sm font-medium text-lime-500">
            NGO_name
            </label>
            <input
              id="ngo_name"
              name="ngo_name"
              type="text"
              placeholder="Enter your ngo_name"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.ngo_name}
            />
            {formik.touched.ngo_name&& formik.errors.ngo_name ? (
              <p className="mt-1 text-xs text-red-500">{formik.errors.ngo_name}</p>
            ) : null}
          </div>
          <div className="mb-4">
            <label htmlFor="ngo_registered_number" className="block text-sm font-medium text-lime-500">
            NGO_registered_number
            </label>
            <input
              id="ngo_registered_number"
              name="ngo_registered_number"
              type="NUMBER"
              placeholder="Enter your ngo_registered_number"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.ngo_registered_number}
            />
            {formik.touched.ngo_registered_number&& formik.errors.ngo_registered_number ? (
              <p className="mt-1 text-xs text-red-500">{formik.errors.ngo_registered_number}</p>
            ) : null}
          </div>
          <div className="mb-4">
            <label htmlFor="geographic_area_of_work" className="block text-sm font-medium text-lime-500">
            Geographic_area_of_work
            </label>
            <input
              id="geographic_area_of_work"
              name="geographic_area_of_work"
              type="text"
              placeholder="Enter your geographic_area_of_work"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.geographic_area_of_work}
            />
            {formik.touched.geographic_area_of_work&& formik.errors.geographic_area_of_work ? (
              <p className="mt-1 text-xs text-red-500">{formik.errors.geographic_area_of_work}</p>
            ) : null}
          </div> 
          <div className="mb-4">
            <label htmlFor="proof_of_work" className="block text-sm font-medium text-lime-500">
            Proof_of_work
            </label>
            <input
              id="proof_of_work"
              name="proof_of_work"
              type="text"
              placeholder="Enter your proof_of_work"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.proof_of_work}
            />
            {formik.touched.proof_of_work&& formik.errors.proof_of_work? (
              <p className="mt-1 text-xs text-red-500">{formik.errors.proof_of_work}</p>
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