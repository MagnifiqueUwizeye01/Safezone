import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import ReportDetailsComponent from '../../components/reports/ReportDetails';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Spinner from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import { useAuth } from '../../hooks/useAuth';
import reportService from '../../api/services/reportService';
import { ArrowLeft, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';

const ReportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reportService.getReportById(id);
      setReport(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch report');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await reportService.updateReport(id, { ...report, status: newStatus });
      fetchReport();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update report status');
    }
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="text-gray-600 mt-4">Loading report details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !report) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Alert type="danger" message={error || 'Report not found'} />
            <button
              onClick={() => navigate('/police/reports')}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Reports
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const handleDeleteConfirm = async () => {
    try {
      await reportService.deleteReport(id);
      navigate('/police/reports');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete report');
      setShowDeleteConfirm(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/police/reports')}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 shadow-sm shadow-emerald-600/30"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Reports
          </button>

          {/* Error Alert */}
          {error && (
            <div className="mb-6">
              <Alert type="danger" message={error} dismissible onClose={() => setError(null)} />
            </div>
          )}

          {/* Report Details */}
          <div className="mb-6">
            <ReportDetailsComponent
              report={report}
              onEdit={() => navigate(`/police/reports/${id}/edit`)}
              onDelete={() => setShowDeleteConfirm(true)}
            />
          </div>

          {/* Update Status Section */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-emerald-600" />
                Update Status
              </h3>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleStatusUpdate('IN_PROGRESS')}
                  disabled={report.status === 'IN_PROGRESS'}
                  className={`
                    inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200
                    ${
                      report.status === 'IN_PROGRESS'
                        ? 'bg-blue-100 text-blue-700 border border-blue-200 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm shadow-blue-600/30'
                    }
                  `}
                >
                  <Clock className="w-4 h-4" />
                  Mark In Progress
                </button>

                <button
                  onClick={() => handleStatusUpdate('RESOLVED')}
                  disabled={report.status === 'RESOLVED'}
                  className={`
                    inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200
                    ${
                      report.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-not-allowed'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 shadow-sm shadow-emerald-600/30'
                    }
                  `}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Mark Resolved
                </button>

                <button
                  onClick={() => handleStatusUpdate('CANCELLED')}
                  disabled={report.status === 'CANCELLED'}
                  className={`
                    inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200
                    ${
                      report.status === 'CANCELLED'
                        ? 'bg-red-100 text-red-700 border border-red-200 cursor-not-allowed'
                        : 'bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm shadow-red-600/30'
                    }
                  `}
                >
                  <XCircle className="w-4 h-4" />
                  Cancel Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Report"
        message="Are you sure you want to delete this report? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </Layout>
  );
};

export default ReportDetails;

