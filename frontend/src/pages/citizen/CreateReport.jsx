import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import ReportForm from '../../components/reports/ReportForm';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Spinner from '../../components/common/Spinner';
import { useAuth } from '../../hooks/useAuth';
import reportService from '../../api/services/reportService';

const CreateReport = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Transform form data to match backend model
      const reportData = {
        title: formData.title,
        description: formData.description,
        reportType: formData.type, // Transform 'type' to 'reportType'
        status: formData.status || 'PENDING',
        reporter: { id: user.id },
        location: formData.locationId ? { id: formData.locationId } : null, // Transform 'locationId' to 'location: { id }'
      };

      await reportService.createReport(reportData);
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/citizen/reports');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create report');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <Alert type="success" message="Report created successfully! Redirecting..." />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Report</h1>
          <p className="text-gray-600">Report an incident or safety concern in your community</p>
        </div>

        {error && (
          <Alert type="danger" message={error} dismissible onClose={() => setError(null)} />
        )}

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <ReportForm
            initialData={null}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/citizen/reports')}
            loading={loading}
            userRole={user?.role}
          />
        </div>
      </div>
    </Layout>
  );
};

export default CreateReport;

