"use client"
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast';

const SocialworkerSignup = () => {
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',   
      address:'',
      exp:'',
      geography:'',
      description:'',
      affiliatedTo :'',
    },
    // validationSchema: Yup.object({
    //   name: Yup.string().required('Name is required'),
    //   email: Yup.string().email('Invalid email address').required('Email is required'),
    //   password: Yup.string()
    //     .min(6, 'Password must be at least 6 characters')
    //     .required('Password is required'),
    //   confirmPassword: Yup.string()
    //     .oneOf([Yup.ref('password'), null], 'Passwords must match')
    //     .required('Confirm Password is required'),
    // }),
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
            <label htmlFor="address" className="block text-sm font-medium text-lime-500">
              Address
            </label>
            <input
              id="Address"
              name="Address"
              type="Address"
              placeholder=" Enter your Address"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.address}
            />
            {formik.touched.address && formik.errors.address ? (
              <p className="mt-1 text-xs text-red-500">{formik.errors.address}</p>
            ) : null}
          </div>
            <div className="mb-4">
                <label htmlFor="exp" className="block text-sm font-medium text-lime-500">
                Experience
                </label>
                <input
                id="exp"
                name="exp"
                type="text"
                placeholder="Enter your experience"
                className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.exp}
                />
                {formik.touched.exp && formik.errors.exp ? (
                <p className="mt-1 text-xs text-red-500">{formik.errors.exp}</p>
                ) : null}
                </div>
                <div className="mb-4">
                <label htmlFor="exp" className="block text-sm font-medium text-lime-500">
                Experience
                </label>
                <input
                id="exp"
                name="exp"
                type="text"
                placeholder="Enter your experience"
                className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.exp}
                />
                {formik.touched.exp && formik.errors.exp ? (
                <p className="mt-1 text-xs text-red-500">{formik.errors.exp}</p>
                ) : null}
                </div>
                <div className="mb-4">
                <label htmlFor="geography" className="block text-sm font-medium text-lime-500">
                Geography
                </label>
                <input
                id="geography"
                name="geography"
                type="text"
                placeholder="Enter your working area"
                className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.geography}
                />
                {formik.touched.geography && formik.errors.geography ? (
                <p className="mt-1 text-xs text-red-500">{formik.errors.geography}</p>
                ) : null}
                </div>
                <div className="mb-4">
                <label htmlFor="Description" className="block text-sm font-medium text-lime-500">
                Bio
                </label>
                <input
                id="description"
                name="description"
                type="bio"
                placeholder="write about yourself"
                className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
                />
                {formik.touched.description && formik.errors.description ? (
                <p className="mt-1 text-xs text-red-500">{formik.errors.description}</p>
                ) : null}
                </div>
                <div className="mb-4">
                <label htmlFor="Affiliated to" className="block text-sm font-medium text-lime-500">
                Affiliated to
                </label>
                <input
                id="affiliated to"
                name="affiliated to"
                type="text"
                placeholder="enter your affiliation"
                className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.affiliatedTo}
                />
                {formik.touched.affiliatedTo && formik.errors.affiliatedTo? (
                <p className="mt-1 text-xs text-red-500">{formik.errors.affiliatedTo}</p>
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

export default SocialworkerSignup;