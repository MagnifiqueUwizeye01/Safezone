import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import AlertForm from '../../components/alerts/AlertForm';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Spinner from '../../components/common/Spinner';
import { useAuth } from '../../hooks/useAuth';
import alertService from '../../api/services/alertService';

const CreateAlert = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Transform form data to match backend model
      const alertData = {
        title: formData.title,
        message: formData.description, // Transform 'description' to 'message'
        alertType: formData.type, // Transform 'type' to 'alertType'
        location: formData.locationId ? { id: formData.locationId } : null, // Transform 'locationId' to 'location: { id }'
      };

      await alertService.createAlert(alertData);
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/police/alerts');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create alert');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
              <Alert type="success" message="Alert created successfully! Redirecting..." />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Alert</h1>
            <p className="text-gray-600">Broadcast a safety alert to your community</p>
          </div>

          {error && (
            <div className="mb-6">
              <Alert type="danger" message={error} dismissible onClose={() => setError(null)} />
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <AlertForm
              initialData={null}
              onSubmit={handleSubmit}
              onCancel={() => navigate('/police/alerts')}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateAlert;

