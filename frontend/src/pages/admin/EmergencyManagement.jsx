import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import EmergencyList from '../../components/emergency/EmergencyList';
import EmergencyForm from '../../components/emergency/EmergencyForm';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Spinner from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import emergencyService from '../../api/services/emergencyService';

const EmergencyManagement = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [formMode, setFormMode] = useState('create');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [emergencyToDelete, setEmergencyToDelete] = useState(null);

  useEffect(() => {
    fetchEmergencyContacts();
  }, []);

  const fetchEmergencyContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await emergencyService.getAllEmergencyContacts();
      setEmergencies(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch emergency contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormMode('create');
    setSelectedEmergency(null);
    setShowForm(true);
  };

  const handleEdit = (emergency) => {
    setFormMode('edit');
    setSelectedEmergency(emergency);
    setShowForm(true);
  };

  const handleDelete = (emergencyId) => {
    setEmergencyToDelete(emergencyId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (emergencyToDelete) {
      try {
        await emergencyService.deleteEmergencyContact(emergencyToDelete);
        fetchEmergencyContacts();
        setShowDeleteConfirm(false);
        setEmergencyToDelete(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete emergency contact');
        setShowDeleteConfirm(false);
        setEmergencyToDelete(null);
      }
    }
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      if (formMode === 'create') {
        await emergencyService.createEmergencyContact(formData);
      } else {
        await emergencyService.updateEmergencyContact(selectedEmergency.id, formData);
      }
      setShowForm(false);
      setSelectedEmergency(null);
      fetchEmergencyContacts();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${formMode} emergency contact`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Emergency Contact Management</h1>
              <p className="text-gray-600">Manage emergency contacts and services</p>
            </div>
            <Button variant="primary" onClick={handleCreate} disabled={showForm}>
              Create New Contact
            </Button>
          </div>

          {error && (
            <div className="mb-6">
              <Alert type="danger" message={error} dismissible onClose={() => setError(null)} />
            </div>
          )}

          {showForm && (
            <Modal
              isOpen={showForm}
              onClose={() => {
                setShowForm(false);
                setSelectedEmergency(null);
              }}
              title={formMode === 'create' ? 'Create Emergency Contact' : 'Edit Emergency Contact'}
              size="lg"
            >
              <EmergencyForm
                initialData={selectedEmergency}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setSelectedEmergency(null);
                }}
                loading={loading}
              />
            </Modal>
          )}

          {loading && !showForm ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Spinner size="lg" />
              <p className="text-gray-600 mt-4">Loading emergency contacts...</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <EmergencyList
                emergencies={emergencies}
                loading={false}
                error={null}
                onEmergencyClick={handleEdit}
              />
            </div>
          )}

          {/* Delete Confirmation Dialog */}
          <ConfirmDialog
            isOpen={showDeleteConfirm}
            onClose={() => {
              setShowDeleteConfirm(false);
              setEmergencyToDelete(null);
            }}
            onConfirm={confirmDelete}
            title="Delete Emergency Contact"
            message="Are you sure you want to delete this emergency contact? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
            variant="danger"
          />
        </div>
      </div>
    </Layout>
  );
};

export default EmergencyManagement;

