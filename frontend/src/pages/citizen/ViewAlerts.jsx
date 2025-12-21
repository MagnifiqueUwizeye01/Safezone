import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import AlertList from '../../components/alerts/AlertList';
import AlertCard from '../../components/alerts/AlertCard';
import Spinner from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../hooks/useAuth';
import alertService from '../../api/services/alertService';
import { ALERT_TYPES } from '../../utils/constants';
import { normalizeAlerts } from '../../utils/alertHelpers';
import { Bell } from 'lucide-react';

const ViewAlerts = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    fetchAlerts();
  }, [user]);

  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const allAlerts = await alertService.getAllAlerts();
      // Filter alerts by user's location if available
      const userAlerts = user?.location
        ? allAlerts.filter(a => a.location?.id === user.location.id)
        : allAlerts;
      // Normalize alerts (map alertType to type)
      setAlerts(normalizeAlerts(Array.isArray(userAlerts) ? userAlerts : []));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleAlertClick = (alert) => {
    setSelectedAlert(alert);
  };

  const getFilteredAlerts = () => {
    if (!filterType) {
      return alerts;
    }
    return alerts.filter((a) => a.type === filterType);
  };

  const filteredAlerts = getFilteredAlerts();

  const alertTypeOptions = [
    { value: '', label: 'All Types' },
    ...Object.values(ALERT_TYPES).map((type) => ({
      value: type,
      label: type.replace('_', ' '),
    }))
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">View Alerts</h1>
            <p className="text-gray-600">Stay informed about safety alerts in your area</p>
          </div>

          {error && (
            <div className="mb-6">
              <Alert type="danger" message={error} dismissible onClose={() => setError(null)} />
            </div>
          )}

          {/* Filter Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <div className="max-w-xs">
              <Select
                label="Filter by Type"
                name="type"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                options={alertTypeOptions}
              />
            </div>
          </div>

          {/* Alerts List */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Spinner size="lg" />
              <p className="text-gray-600 mt-4">Loading alerts...</p>
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Alerts Found</h3>
                <p className="text-gray-600">
                  {filterType
                    ? `No ${filterType.replace('_', ' ').toLowerCase()} alerts available at this time.`
                    : 'There are currently no alerts available for your area.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onClick={() => handleAlertClick(alert)}
                />
              ))}
            </div>
          )}

          {/* Alert Details Modal */}
          {selectedAlert && (
            <Modal
              isOpen={!!selectedAlert}
              onClose={() => setSelectedAlert(null)}
              title={selectedAlert.title}
              size="lg"
            >
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                  <p className="text-gray-900">{selectedAlert.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Type</h4>
                    <p className="text-gray-900">{selectedAlert.type?.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Location</h4>
                    <p className="text-gray-900">{selectedAlert.location?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Date</h4>
                    <p className="text-gray-900">
                      {selectedAlert.createdAt
                        ? new Date(selectedAlert.createdAt).toLocaleString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </Modal>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ViewAlerts;
