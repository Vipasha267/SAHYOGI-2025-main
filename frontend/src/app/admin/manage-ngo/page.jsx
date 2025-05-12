'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const ManageNGO = () => {
  const [ngoList, setNgoList] = useState([]);

  const fetchNGOs = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/ngo/getall`);
    setNgoList(res.data);
  };

  useEffect(() => {
    fetchNGOs();
  }, []);

  const deleteNGO = async (id) => {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/ngo/delete/${id}`);
    toast.success('NGO deleted successfully!');
    fetchNGOs();
    
  };
  const verifyNGO = async (id) => {
    await axios.verify(`${process.env.NEXT_PUBLIC_API_URL}/ngo/verify/${id}`);
    toast.success('NGO verified successfully!');
    fetchNGOs();
    
  };
  const approveNGO = async (id) => {
    await axios.approve(`${process.env.NEXT_PUBLIC_API_URL}/ngo/approve/${id}`);
    toast.success('NGO approved successfully!');
    fetchNGOs();
    
  };


  return (
    <div>
      <div className="container mx-auto py-10">
        <h1 className="text-center font-bold text-4xl">Manage NGOs</h1>
        <table className="mt-5 w-full">
          <thead className="border">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">CreatedAt</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ngoList.map((ngo) => (
              <tr key={ngo._id}>
                <td className="p-3">{ngo._id}</td>
                <td className="p-3">{ngo.name}</td>
                <td className="p-3">{ngo.email}</td>
                <td className="p-3">{new Date(ngo.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  <button
                    onClick={() => deleteNGO(ngo._id)}
                    className="bg-red-500 text-white rounded p-3"
                  >
                    Delete
                  </button>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => verifyNGO(ngo._id)}
                    className="bg-green-500 text-white rounded p-3"
                  >
                    Verify
                  </button>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => approveNGO(ngo._id)}
                    className="bg-blue-500 text-white rounded p-3"
                  >
                    Approve
                  </button>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageNGO;