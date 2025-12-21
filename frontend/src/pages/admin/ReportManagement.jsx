import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import ReportTable from '../../components/reports/ReportTable';
import ReportFilter from '../../components/reports/ReportFilter';
import ReportDetails from '../../components/reports/ReportDetails';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Spinner from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import Pagination from '../../components/common/Pagination';
import reportService from '../../api/services/reportService';
import { useSearch } from '../../hooks/useSearch';
import { PAGINATION } from '../../utils/constants';
import { normalizeReports } from '../../utils/reportHelpers';
import ReportForm from '../../components/reports/ReportForm';
import { useAuth } from '../../hooks/useAuth';

const ReportManagement = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
  });

  // Search ALL columns - pass empty array to search all fields
  const { searchTerm, setSearchTerm, filteredData } = useSearch(reports, []);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reportService.getAllReports();
      // Normalize reports (map reportType to type)
      setReports(normalizeReports(data));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    // Sync search filter with searchTerm for live search
    if (newFilters.search !== undefined) {
      setSearchTerm(newFilters.search);
    }
  };

  const handleView = (report) => {
    setSelectedReport(report);
    setShowDetails(true);
  };

  const handleEditClick = (report) => {
    setSelectedReport(report);
    setShowEditForm(true);
    setShowDetails(false); // Close details modal if open
  };

  const handleEditSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      // Transform form data to match backend model
      const reportData = {
        title: formData.title,
        description: formData.description,
        reportType: formData.type, // Transform 'type' to 'reportType'
        status: formData.status || 'PENDING',
        reporter: selectedReport.reporter ? { id: selectedReport.reporter.id } : null,
        location: formData.locationId ? { id: formData.locationId } : null, // Transform 'locationId' to 'location: { id }'
      };

      await reportService.updateReport(selectedReport.id, reportData);
      setShowEditForm(false);
      setSelectedReport(null);
      fetchReports();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update report');
    } finally {
      setLoading(false);
    }
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

  const getFilteredReports = () => {
    let filtered = filteredData;

    if (filters.type) {
      filtered = filtered.filter((r) => r.type === filters.type);
    }

    if (filters.status) {
      filtered = filtered.filter((r) => r.status === filters.status);
    }

    return filtered;
  };

  const filteredReports = getFilteredReports();

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

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchTerm]);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Report Management</h1>
            <p className="text-gray-600">Manage all incident reports in the system</p>
          </div>

          {error && (
            <Alert type="danger" message={error} dismissible onClose={() => setError(null)} />
          )}

          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <ReportFilter
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

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
                  onEdit={handleEditClick}
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
                  <p className="text-gray-600">No reports found matching your criteria.</p>
                </div>
              )}
            </>
          )}

          {showDetails && selectedReport && (
            <Modal
              isOpen={showDetails}
              onClose={() => {
                setShowDetails(false);
                setSelectedReport(null);
              }}
              size="lg"
            >
              <ReportDetails
                report={selectedReport}
                onEdit={handleEditClick}
                onDelete={handleDelete}
                onClose={() => {
                  setShowDetails(false);
                  setSelectedReport(null);
                }}
              />
            </Modal>
          )}

          {/* Edit Report Form Modal */}
          {showEditForm && selectedReport && (
            <Modal
              isOpen={showEditForm}
              onClose={() => {
                setShowEditForm(false);
                setSelectedReport(null);
              }}
              title="Edit Report"
              size="lg"
            >
              <ReportForm
                initialData={selectedReport}
                onSubmit={handleEditSubmit}
                onCancel={() => {
                  setShowEditForm(false);
                  setSelectedReport(null);
                }}
                loading={loading}
                userRole={user?.role}
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

export default ReportManagement;

