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
      // Try location-specific first, then fallback to active if no results
      if (user?.location?.id) {
        console.log('Fetching emergency contacts for location:', user.location.id);
        console.log('User location:', user.location);
        try {
          data = await emergencyService.getEmergencyContactsByLocation(user.location.id);
          console.log('Location-specific contacts:', data);
          // If no contacts found for location, try active contacts as fallback
          if (!data || (Array.isArray(data) && data.length === 0)) {
            console.log('No contacts for location, fetching active contacts as fallback');
            data = await emergencyService.getActiveEmergencyContacts();
            console.log('Active contacts (fallback):', data);
          }
        } catch (locationError) {
          console.warn('Error fetching by location, trying active contacts:', locationError);
          data = await emergencyService.getActiveEmergencyContacts();
        }
      } else {
        console.log('No user location, fetching active emergency contacts');
        data = await emergencyService.getActiveEmergencyContacts();
      }
      console.log('Emergency contacts data received:', data);
      console.log('Data type:', typeof data, 'Is array:', Array.isArray(data));
      // Ensure data is an array
      const contacts = Array.isArray(data) ? data : [];
      console.log('Processed contacts:', contacts);
      console.log('Number of contacts:', contacts.length);
      setEmergencies(contacts);
    } catch (err) {
      console.error('Error fetching emergency contacts:', err);
      console.error('Error response:', err.response);
      console.error('Error details:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        url: err.config?.url
      });
      setError(err.response?.data?.message || err.message || 'Failed to fetch emergency contacts');
      setEmergencies([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencyClick = (emergency) => {
    // Could open modal or navigate to details
    console.log('Emergency contact clicked:', emergency);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Emergency Contacts</h1>
          <p className="text-gray-600">Quick access to emergency services in your area</p>
        </div>

        {error && (
          <Alert type="danger" message={error} dismissible onClose={() => setError(null)} />
        )}

        {loading ? (
          <div className="loading-container">
            <Spinner size="lg" />
            <p>Loading emergency contacts...</p>
          </div>
        ) : (
          <EmergencyList
            emergencies={emergencies}
            loading={loading}
            error={error}
            onEmergencyClick={handleEmergencyClick}
          />
        )}
      </div>
    </Layout>
  );
};

export default EmergencyContacts;

