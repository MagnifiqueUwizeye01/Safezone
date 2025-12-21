import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import AlertList from '../../components/alerts/AlertList';
import AlertFilter from '../../components/alerts/AlertFilter';
import AlertForm from '../../components/alerts/AlertForm';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Spinner from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import Pagination from '../../components/common/Pagination';
import { useSearch } from '../../hooks/useSearch';
import alertService from '../../api/services/alertService';
import { PAGINATION } from '../../utils/constants';
import { normalizeAlerts } from '../../utils/alertHelpers';

const AlertManagement = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [formMode, setFormMode] = useState('create');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [alertToDelete, setAlertToDelete] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
  });

  // Search ALL columns
  const { searchTerm, setSearchTerm, filteredData } = useSearch(alerts, []);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await alertService.getAllAlerts();
      // Ensure data is valid before normalizing
      if (!data) {
        setAlerts([]);
        return;
      }
      // Normalize alerts (map alertType to type)
      const normalized = normalizeAlerts(data);
      setAlerts(Array.isArray(normalized) ? normalized : []);
    } catch (err) {
      console.error('Error fetching alerts:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch alerts');
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormMode('create');
    setSelectedAlert(null);
    setShowForm(true);
  };

  const handleEdit = (alert) => {
    setFormMode('edit');
    setSelectedAlert(alert);
    setShowForm(true);
  };

  const handleDelete = (alertId) => {
    setAlertToDelete(alertId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (alertToDelete) {
      try {
        await alertService.deleteAlert(alertToDelete);
        fetchAlerts();
        setShowDeleteConfirm(false);
        setAlertToDelete(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete alert');
        setShowDeleteConfirm(false);
        setAlertToDelete(null);
      }
    }
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      // Transform form data to match backend model
      const alertData = {
        title: formData.title,
        message: formData.description, // Transform 'description' to 'message'
        alertType: formData.type, // Transform 'type' to 'alertType'
        location: formData.locationId ? { id: formData.locationId } : null, // Transform 'locationId' to 'location: { id }'
      };
      
      if (formMode === 'create') {
        await alertService.createAlert(alertData);
      } else {
        // For update, preserve the ID from selectedAlert
        await alertService.updateAlert(selectedAlert.id, alertData);
      }
      setShowForm(false);
      setSelectedAlert(null);
      fetchAlerts();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${formMode} alert`);
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Alert Management</h1>
              <p className="text-gray-600">Manage safety alerts in the system</p>
            </div>
            <Button variant="primary" onClick={handleCreate} disabled={showForm}>
              Create New Alert
            </Button>
          </div>

          {error && (
            <Alert type="danger" message={error} dismissible onClose={() => setError(null)} />
          )}

          {showForm && (
            <Modal
              isOpen={showForm}
              onClose={() => {
                setShowForm(false);
                setSelectedAlert(null);
              }}
              title={formMode === 'create' ? 'Create Alert' : 'Edit Alert'}
              size="lg"
            >
              <AlertForm
                initialData={selectedAlert}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setSelectedAlert(null);
                }}
                loading={loading}
              />
            </Modal>
          )}

          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <AlertFilter
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {loading && !showForm ? (
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
                  onAlertClick={handleEdit}
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

          {/* Delete Confirmation Dialog */}
          <ConfirmDialog
            isOpen={showDeleteConfirm}
            onClose={() => {
              setShowDeleteConfirm(false);
              setAlertToDelete(null);
            }}
            onConfirm={confirmDelete}
            title="Delete Alert"
            message="Are you sure you want to delete this alert? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
            variant="danger"
          />
        </div>
      </div>
    </Layout>
  );
};

export default AlertManagement;

