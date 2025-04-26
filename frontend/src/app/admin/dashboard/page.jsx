"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';

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

  const renderCard = (title, data) => (
    <div>
      <h2 className="text-xl font-bold my-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item, index) => (
          <Card key={index} className="p-4 shadow-md">
            <CardContent>
              {Object.entries(item).map(([key, value]) => (
                <div key={key} className="mb-1">
                  <strong>{key}:</strong> {String(value)}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      {renderCard('NGOs', ngos)}
      {renderCard('Social Workers', socialWorkers)}
      {renderCard('Users', users)}
    </div>
  );
};

export default Dashboard;
