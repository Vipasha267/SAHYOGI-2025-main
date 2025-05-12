'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const ManageSocialWorker = () => {
  const [workerList, setWorkerList] = useState([]);

  const fetchWorkers = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/socialworker/getall`);
    setWorkerList(res.data);
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const deleteWorker = async (id) => {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/socialworker/delete/${id}`);
    toast.success('Social Worker deleted successfully!');
    fetchWorkers();
  };
  const verifyWorker = async (id) => {
    await axios.verify(`${process.env.NEXT_PUBLIC_API_URL}/socialworker/delete/${id}`);
    toast.success('Social Worker verified successfully!');
    fetchWorkers();
  };
  const approveWorker = async (id) => {
    await axios.verify(`${process.env.NEXT_PUBLIC_API_URL}/socialworker/delete/${id}`);
    toast.success('Social Worker approved successfully!');
    fetchWorkers();
  };

  return (
    <div>
      <div className="container mx-auto py-10">
        <h1 className="text-center font-bold text-4xl">Manage Social Workers</h1>
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
            {workerList.map((worker) => (
              <tr key={worker._id}>
                <td className="p-3">{worker._id}</td>
                <td className="p-3">{worker.name}</td>
                <td className="p-3">{worker.email}</td>
                <td className="p-3">{new Date(worker.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  <button
                    onClick={() => deleteWorker(worker._id)}
                    className="bg-red-500 text-white rounded p-3"
                  >
                    Delete
                  </button>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => verifyWorker(worker._id)}
                    className="bg-green-500 text-white rounded p-3"
                  >
                    Verify
                  </button>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => approveWorker(worker._id)}
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

export default ManageSocialWorker;