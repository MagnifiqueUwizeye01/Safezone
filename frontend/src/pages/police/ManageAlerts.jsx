import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import AlertList from '../../components/alerts/AlertList';
import AlertFilter from '../../components/alerts/AlertFilter';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import Pagination from '../../components/common/Pagination';
import { useAuth } from '../../hooks/useAuth';
import alertService from '../../api/services/alertService';
import { useSearch } from '../../hooks/useSearch';
import { PAGINATION } from '../../utils/constants';
import { normalizeAlerts } from '../../utils/alertHelpers';

const ManageAlerts = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
  });

  // Search ALL columns
  const { searchTerm, setSearchTerm, filteredData } = useSearch(alerts, []);

  useEffect(() => {
    fetchAlerts();
  }, [user]);

  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await alertService.getAllAlerts();
      // Normalize alerts (map alertType to type)
      setAlerts(normalizeAlerts(data));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch alerts');
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

  const handleAlertClick = (alert) => {
    setSelectedAlert(alert);
  };

  const handleDelete = async (alertId) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      try {
        await alertService.deleteAlert(alertId);
        fetchAlerts();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete alert');
      }
    }
  };

  const getFilteredAlerts = () => {
    let filtered = filteredData;

    if (filters.type) {
      filtered = filtered.filter((a) => a.type === filters.type);
    }

    return filtered;
  };

  const filteredAlerts = getFilteredAlerts();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGINATION.DEFAULT_SIZE);

  // Pagination calculations
  const totalItems = filteredAlerts.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedAlerts = filteredAlerts.slice(startIndex, endIndex);

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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Alerts</h1>
              <p className="text-gray-600">Create and manage safety alerts</p>
            </div>
            <Button variant="primary" onClick={() => window.location.href = '/police/create-alert'}>
              Create New Alert
            </Button>
          </div>

          {error && (
            <Alert type="danger" message={error} dismissible onClose={() => setError(null)} />
          )}

          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <AlertFilter
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
                <AlertList
                  alerts={paginatedAlerts}
                  loading={false}
                  error={null}
                  onAlertClick={handleAlertClick}
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
                  <p className="text-gray-600">No alerts found matching your criteria.</p>
                </div>
              )}
            </>
          )}

          {selectedAlert && (
            <div className="alert-details-modal">
              <div className="modal-overlay" onClick={() => setSelectedAlert(null)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h2>{selectedAlert.title}</h2>
                    <button className="modal-close" onClick={() => setSelectedAlert(null)}>
                      ×
                    </button>
                  </div>
                  <div className="modal-body">
                    <p>{selectedAlert.description}</p>
                    <div className="alert-meta">
                      <span>Type: {selectedAlert.type}</span>
                      <span>Location: {selectedAlert.location?.name || 'N/A'}</span>
                      <span>Created: {new Date(selectedAlert.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="modal-actions">
                      <Button
                        variant="danger"
                        onClick={() => {
                          handleDelete(selectedAlert.id);
                          setSelectedAlert(null);
                        }}
                      >
                        Delete Alert
                      </Button>
                      <Button variant="secondary" onClick={() => setSelectedAlert(null)}>
                        Close
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ManageAlerts;

