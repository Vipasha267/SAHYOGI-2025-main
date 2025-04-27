'use client';
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Building, User, Search, MapPin, Clock, Award } from 'lucide-react';
import Link from 'next/link';

const ExplorePage = () => {
  const [sahyogis, setSahyogis] = useState([]);
  const [filteredSahyogis, setFilteredSahyogis] = useState([]);
  const [loading, setLoading] = useState(true);

  const filterForm = useFormik({
    initialValues: {
      searchQuery: '',
      areaOfWork: '',
      location: '',
      verificationStatus: 'all', // all, verified, unverified
      type: 'all' // all, ngo, socialworker
    },
    onSubmit: (values) => {
      applyFilters(values);
    }
  });

  useEffect(() => {
    fetchSahyogis();
  }, []);

  const fetchSahyogis = async () => {
    try {
      const [ngosRes, workersRes] = await Promise.all([
        axios.get('http://localhost:5000/ngo/getall'),
        axios.get('http://localhost:5000/socialworker/getall')
      ]);

      const ngos = ngosRes.data.map(ngo => ({
        ...ngo,
        type: 'ngo',
        verified: ngo.ngo_Registration_Number ? true : false
      }));

      const workers = workersRes.data.map(worker => ({
        ...worker,
        type: 'socialworker',
        verified: worker.Government_ID ? true : false
      }));

      const allSahyogis = [...ngos, ...workers];
      setSahyogis(allSahyogis);
      setFilteredSahyogis(allSahyogis);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load Sahyogis');
      setLoading(false);
    }
  };

  const applyFilters = (values) => {
    let filtered = [...sahyogis];

    // Filter by search query
    if (values.searchQuery) {
      const query = values.searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.name?.toLowerCase().includes(query) ||
        s.type_of_SocialWork?.toLowerCase().includes(query) ||
        s.bio?.toLowerCase().includes(query)
      );
    }

    // Filter by area of work
    if (values.areaOfWork) {
      filtered = filtered.filter(s => 
        s.type_of_SocialWork?.toLowerCase().includes(values.areaOfWork.toLowerCase())
      );
    }

    // Filter by location
    if (values.location) {
      filtered = filtered.filter(s => 
        s.geographic_area_of_Work?.toLowerCase().includes(values.location.toLowerCase()) ||
        s.address?.toLowerCase().includes(values.location.toLowerCase())
      );
    }

    // Filter by verification status
    if (values.verificationStatus !== 'all') {
      const isVerified = values.verificationStatus === 'verified';
      filtered = filtered.filter(s => s.verified === isVerified);
    }

    // Filter by type
    if (values.type !== 'all') {
      filtered = filtered.filter(s => s.type === values.type);
    }

    setFilteredSahyogis(filtered);
  };

  const renderCard = (sahyogi) => (
    <div key={sahyogi._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center mb-4">
        <div className={`rounded-full p-3 mr-4 ${sahyogi.type === 'ngo' ? 'bg-lime-100' : 'bg-purple-100'}`}>
          {sahyogi.type === 'ngo' ? (
            <Building size={24} className="text-lime-600" />
          ) : (
            <User size={24} className="text-purple-600" />
          )}
        </div>
        <div>
          <h3 className="text-xl font-semibold">{sahyogi.name}</h3>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin size={16} className="mr-1" />
            {sahyogi.geographic_area_of_Work || sahyogi.address}
          </div>
        </div>
        {sahyogi.verified && (
          <div className="ml-auto">
            <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              Verified
            </div>
          </div>
        )}
      </div>

      <p className="text-gray-600 mb-4">{sahyogi.bio || sahyogi.type_of_SocialWork}</p>

      <div className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center text-sm text-gray-600">
          <Clock size={16} className="mr-1" />
          {sahyogi.year_of_experience} years experience
        </div>
        <Link 
          href={`/sahyogi/${sahyogi._id}`} 
          className="text-lime-600 hover:text-lime-700 font-medium text-sm"
        >
          View Profile →
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Explore Sahyogis</h1>

        {/* Filters */}
        <form onSubmit={filterForm.handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="searchQuery"
                  placeholder="Search by name or keywords..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                  onChange={filterForm.handleChange}
                  value={filterForm.values.searchQuery}
                />
              </div>
            </div>

            {/* Area of Work */}
            <div>
              <select
                name="areaOfWork"
                className="w-full py-2 px-3 border rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                onChange={filterForm.handleChange}
                value={filterForm.values.areaOfWork}
              >
                <option value="">Any Area of Work</option>
                <option value="education">Education</option>
                <option value="health">Healthcare</option>
                <option value="environment">Environment</option>
                <option value="animal">Animal Welfare</option>
                <option value="children">Child Welfare</option>
                <option value="elderly">Elder Care</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <input
                type="text"
                name="location"
                placeholder="Location..."
                className="w-full py-2 px-3 border rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                onChange={filterForm.handleChange}
                value={filterForm.values.location}
              />
            </div>

            {/* Verification Status */}
            <div>
              <select
                name="verificationStatus"
                className="w-full py-2 px-3 border rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                onChange={filterForm.handleChange}
                value={filterForm.values.verificationStatus}
              >
                <option value="all">All Statuses</option>
                <option value="verified">Verified Only</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-lime-500 text-white px-4 py-2 rounded-lg hover:bg-lime-600 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </form>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading Sahyogis...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSahyogis.length > 0 ? (
              filteredSahyogis.map(renderCard)
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                No Sahyogis found matching your criteria.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;