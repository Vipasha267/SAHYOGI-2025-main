"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/Card';

const Dashboard = () => {
  const [ngos, setNgos] = useState([]);
  const [socialWorkers, setSocialWorkers] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/ngo/getall')
      .then(res => setNgos(res.data))
      .catch(err => console.error('NGO fetch error:', err));

    axios.get('http://localhost:5000/socialworker/getall')
      .then(res => setSocialWorkers(res.data))
      .catch(err => console.error('Social Worker fetch error:', err));

    axios.get('http://localhost:5000/user/getall')
      .then(res => setUsers(res.data))
      .catch(err => console.error('User fetch error:', err));
  }, []);

  const renderNGOCard = (ngo) => (
    <Card key={ngo._id} className="p-4 shadow-md">
      <CardContent>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{ngo.ngo_name}</h3>
          <div><strong>Name:</strong> {ngo.name}</div>
          <div><strong>Email:</strong> {ngo.email}</div>
          <div><strong>Registration No:</strong> {ngo.ngo_Registration_Number}</div>
          <div><strong>Work Area:</strong> {ngo.geographic_area_of_Work}</div>
          <div><strong>Type of Work:</strong> {ngo.type_of_SocialWork}</div>
          <div><strong>Experience:</strong> {ngo.year_of_experience} years</div>
        </div>
      </CardContent>
    </Card>
  );

  const renderSocialWorkerCard = (worker) => (
    <Card key={worker._id} className="p-4 shadow-md">
      <CardContent>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{worker.name}</h3>
          <div><strong>Email:</strong> {worker.email}</div>
          <div><strong>Experience:</strong> {worker.exp} years</div>
          <div><strong>Location:</strong> {worker.address}</div>
          <div><strong>Work Area:</strong> {worker.geography}</div>
          <div><strong>Affiliated To:</strong> {worker.affiliatedTo}</div>
          <div><strong>Description:</strong> {worker.description}</div>
        </div>
      </CardContent>
    </Card>
  );

  const renderUserCard = (user) => (
    <Card key={user._id} className="p-4 shadow-md">
      <CardContent>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{user.name}</h3>
          <div><strong>Email:</strong> {user.email}</div>
          <div><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      
      <div>
        <h2 className="text-xl font-bold my-4">NGOs ({ngos.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ngos.map(ngo => renderNGOCard(ngo))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold my-4">Social Workers ({socialWorkers.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {socialWorkers.map(worker => renderSocialWorkerCard(worker))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold my-4">Users ({users.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map(user => renderUserCard(user))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
