import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import EmergencyList from '../../components/emergency/EmergencyList';
import Spinner from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import { useAuth } from '../../hooks/useAuth';
import emergencyService from '../../api/services/emergencyService';

const EmergencyContacts = () => {
  const { user } = useAuth();
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmergencyContacts();
  }, [user]);

  const fetchEmergencyContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (user?.location?.id) {
        data = await emergencyService.getEmergencyContactsByLocation(user.location.id);
      } else {
        data = await emergencyService.getActiveEmergencyContacts();
      }
      // Ensure data is an array
      setEmergencies(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch emergency contacts');
      setEmergencies([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencyClick = (emergency) => {
    console.log('Emergency contact clicked:', emergency);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Emergency Contacts</h1>
            <p className="text-gray-600">Access emergency services in your area</p>
          </div>

          {error && (
            <div className="mb-6">
              <Alert type="danger" message={error} dismissible onClose={() => setError(null)} />
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Spinner size="lg" />
              <p className="text-gray-600 mt-4">Loading emergency contacts...</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <EmergencyList
                emergencies={emergencies}
                loading={loading}
                error={error}
                onEmergencyClick={handleEmergencyClick}
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EmergencyContacts;

