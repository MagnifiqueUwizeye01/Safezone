import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import ReportTable from '../../components/reports/ReportTable';
import ReportFilter from '../../components/reports/ReportFilter';
import ReportDetails from '../../components/reports/ReportDetails';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Spinner from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import Pagination from '../../components/common/Pagination';
import { useAuth } from '../../hooks/useAuth';
import reportService from '../../api/services/reportService';
import { useSearch } from '../../hooks/useSearch';
import { PAGINATION } from '../../utils/constants';
import { normalizeReports } from '../../utils/reportHelpers';

const AllReports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
  });

  // Search ALL columns
  const { searchTerm, setSearchTerm, filteredData } = useSearch(reports, []);

  useEffect(() => {
    fetchReports();
  }, [user]);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const allReports = await reportService.getAllReports();
      // Filter by police location if available
      const userReports = user?.location
        ? allReports.filter(r => r.location?.id === user.location.id)
        : allReports;
      // Normalize reports (map reportType to type)
      setReports(normalizeReports(userReports));
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

  const handleEdit = async (report) => {
    try {
      const updatedStatus = report.status === 'PENDING' ? 'IN_PROGRESS' : report.status;
      await reportService.updateReport(report.id, { ...report, status: updatedStatus });
      fetchReports();
      setShowDetails(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update report');
    }
  };

  const handleDelete = async (reportId) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await reportService.deleteReport(reportId);
        fetchReports();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete report');
      }
    }
  };

  const handleStatusUpdate = async (reportId, newStatus) => {
    try {
      const report = reports.find(r => r.id === reportId);
      await reportService.updateReport(reportId, { ...report, status: newStatus });
      fetchReports();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update report status');
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">All Reports</h1>
            <p className="text-gray-600">Monitor and manage incident reports in your area</p>
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
              <div className="status-actions">
                <Button
                  variant="primary"
                  onClick={() => handleStatusUpdate(selectedReport.id, 'IN_PROGRESS')}
                  disabled={selectedReport.status === 'IN_PROGRESS'}
                >
                  Mark In Progress
                </Button>
                <Button
                  variant="success"
                  onClick={() => handleStatusUpdate(selectedReport.id, 'RESOLVED')}
                  disabled={selectedReport.status === 'RESOLVED'}
                >
                  Mark Resolved
                </Button>
              </div>
            </Modal>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AllReports;

