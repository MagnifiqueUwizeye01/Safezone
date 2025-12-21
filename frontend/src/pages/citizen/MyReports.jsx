import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import ReportTable from '../../components/reports/ReportTable';
import ReportDetails from '../../components/reports/ReportDetails';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Spinner from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import Pagination from '../../components/common/Pagination';
import Input from '../../components/common/Input';
import { useAuth } from '../../hooks/useAuth';
import reportService from '../../api/services/reportService';
import { useSearch } from '../../hooks/useSearch';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { PAGINATION } from '../../utils/constants';
import { normalizeReports } from '../../utils/reportHelpers';

const MyReports = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);

  // Search ALL columns - comprehensive search
  const { searchTerm, setSearchTerm, filteredData } = useSearch(reports, []);

  useEffect(() => {
    fetchReports();
  }, [user]);

  const fetchReports = async () => {
    if (!user) {
      console.warn('No user found, cannot fetch reports');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching reports for user:', user.id);
      console.log('API endpoint:', '/report/all');
      
      const allReports = await reportService.getAllReports();
      console.log('All reports received:', allReports);
      console.log('Reports type:', typeof allReports, 'Is array:', Array.isArray(allReports));
      
      // Ensure allReports is an array
      const reportsArray = Array.isArray(allReports) ? allReports : [];
      console.log('Reports array length:', reportsArray.length);
      
      // Filter reports by current user
      const userReports = reportsArray.filter(r => {
        const reporterId = r.reporter?.id || r.reporterId;
        const matches = reporterId === user.id || reporterId === user.id?.toString();
        if (!matches && r.reporter) {
          console.log('Report reporter mismatch:', {
            reportReporterId: reporterId,
            userId: user.id,
            reportId: r.id
          });
        }
        return matches;
      });
      
      console.log('Filtered user reports:', userReports);
      console.log('User reports count:', userReports.length);
      // Normalize reports (map reportType to type)
      setReports(normalizeReports(userReports));
    } catch (err) {
      console.error('Error fetching reports:', err);
      console.error('Error details:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          headers: err.config?.headers
        }
      });
      
      let errorMessage = 'Failed to fetch reports';
      if (err.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
      } else if (err.response?.status === 403) {
        errorMessage = 'You do not have permission to view reports.';
      } else if (err.response?.status === 404) {
        errorMessage = 'Reports endpoint not found. Please check backend configuration.';
      } else if (err.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (report) => {
    setSelectedReport(report);
    setShowDetails(true);
  };

  const handleEdit = (report) => {
    // Navigate to edit page or open edit modal
    console.log('Edit report:', report);
  };

  const handleDelete = (reportId) => {
    setReportToDelete(reportId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (reportToDelete) {
      try {
        await reportService.deleteReport(reportToDelete);
        fetchReports();
        setShowDeleteConfirm(false);
        setReportToDelete(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete report');
        setShowDeleteConfirm(false);
        setReportToDelete(null);
      }
    }
  };

  // Use filtered data from search hook
  const filteredReports = filteredData;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGINATION.DEFAULT_SIZE);

  // Pagination calculations
  const totalItems = filteredReports.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedReports = filteredReports.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Reports</h1>
              <p className="text-gray-600">View and manage all your incident reports</p>
            </div>
            <Button variant="primary" onClick={() => navigate('/citizen/create-report')}>
              Create New Report
            </Button>
          </div>

          {error && (
            <div className="mb-6">
              <Alert type="danger" message={error} dismissible onClose={() => setError(null)} />
            </div>
          )}

          {/* Search Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <div className="max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search your reports by title, description, type, status, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Reports Table */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <ReportTable
                  reports={paginatedReports}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  loading={false}
                />
              </div>

              {/* Pagination */}
              {totalItems > 0 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    pageSize={pageSize}
                    totalItems={totalItems}
                    onPageSizeChange={handlePageSizeChange}
                    pageSizeOptions={PAGINATION.PAGE_SIZE_OPTIONS}
                  />
                </div>
              )}

              {totalItems === 0 && !loading && (
                <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                  <p className="text-gray-600">
                    {searchTerm
                      ? 'No reports found matching your search criteria.'
                      : 'You haven\'t created any reports yet. Click "Create New Report" to get started.'}
                  </p>
                </div>
              )}
            </>
          )}

          {/* Report Details Modal */}
          {showDetails && selectedReport && (
            <Modal
              isOpen={showDetails}
              onClose={() => {
                setShowDetails(false);
                setSelectedReport(null);
              }}
              title="Report Details"
              size="lg"
            >
              <ReportDetails
                report={selectedReport}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onClose={() => {
                  setShowDetails(false);
                  setSelectedReport(null);
                }}
              />
            </Modal>
          )}

          {/* Delete Confirmation Dialog */}
          <ConfirmDialog
            isOpen={showDeleteConfirm}
            onClose={() => {
              setShowDeleteConfirm(false);
              setReportToDelete(null);
            }}
            onConfirm={confirmDelete}
            title="Delete Report"
            message="Are you sure you want to delete this report? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
            variant="danger"
          />
        </div>
      </div>
    </Layout>
  );
};

export default MyReports;
