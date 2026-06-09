import React, { useState, useEffect, useMemo } from 'react';
import Layout from '../../components/layout/Layout';
import UserTable from '../../components/users/UserTable';
import UserForm from '../../components/users/UserForm';
import Pagination from '../../components/common/Pagination';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Spinner from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import userService from '../../api/services/userService';
import { PAGINATION } from '../../utils/constants';
import { Search } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1); // 1-based for display
  const [pageSize, setPageSize] = useState(PAGINATION.DEFAULT_SIZE);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Enhanced search - searches ALL columns
  const filteredUsers = useMemo(() => {
    let filtered = users;

    // Role filter
    if (filterRole !== 'ALL') {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    // Search across all columns
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user => {
        return (
          user.username?.toLowerCase().includes(term) ||
          user.email?.toLowerCase().includes(term) ||
          user.fullName?.toLowerCase().includes(term) ||
          user.role?.toLowerCase().includes(term) ||
          user.location?.name?.toLowerCase().includes(term) ||
          (user.createdAt && new Date(user.createdAt).toLocaleDateString().toLowerCase().includes(term))
        );
      });
    }

    return filtered;
  }, [users, searchTerm, filterRole]);

  // Pagination calculations
  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const handleCreate = () => {
    setFormMode('create');
    setSelectedUser(null);
    setShowForm(true);
  };

  const handleEdit = (user) => {
    setFormMode('edit');
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleDelete = (userId) => {
    setUserToDelete(userId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await userService.deleteUser(userToDelete);
        fetchUsers();
        setShowDeleteConfirm(false);
        setUserToDelete(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete user');
        setShowDeleteConfirm(false);
        setUserToDelete(null);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      if (formMode === 'create') {
        // Prepare user data
        let userData = { ...formData };
        
        // Handle location - fetch location object if locationId is provided
        if (formData.locationId) {
          try {
            const locationService = (await import('../../api/services/locationService')).default;
            const location = await locationService.getLocationById(formData.locationId);
            userData.location = location;
            delete userData.locationId; // Remove locationId, backend expects location object
          } catch (locError) {
            console.error('Error fetching location:', locError);
            // If location fetch fails, still try to create user (location might be optional)
          }
        }
        
        // Use appropriate endpoint based on role
        if (formData.role === 'POLICE') {
          // Validate POLICE-specific fields
          if (!formData.badgeNumber || !formData.policeStation) {
            setError('Badge number and police station are required for POLICE users');
            setLoading(false);
            return;
          }
          await userService.createPoliceUser(userData);
        } else if (formData.role === 'ADMIN') {
          await userService.createAdminUser(userData);
        } else {
          // CITIZEN or other roles use regular create endpoint
          await userService.createUser(userData);
        }
      } else {
        // For updates, handle location if changed
        let updateData = { ...formData };
        if (formData.locationId && formData.locationId !== selectedUser?.location?.id) {
          try {
            const locationService = (await import('../../api/services/locationService')).default;
            const location = await locationService.getLocationById(formData.locationId);
            updateData.location = location;
            delete updateData.locationId;
          } catch (locError) {
            console.error('Error fetching location:', locError);
          }
        }
        await userService.updateUser(selectedUser.id, updateData);
      }
      setShowForm(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      const errorMessage = err.response?.data || err.response?.data?.message || `Failed to ${formMode} user`;
      setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleFilterChange = (e) => {
    setFilterRole(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600 mt-1">Manage all users in the system</p>
            </div>
            <Button
              variant="primary"
              onClick={handleCreate}
              disabled={showForm}
            >
              Create New User
            </Button>
          </div>

          {error && (
            <Alert type="danger" message={error} dismissible onClose={() => setError(null)} />
          )}

          {/* Search and Filters */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by username, email, name, role, location..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
              </div>
              <Select
                value={filterRole}
                onChange={handleFilterChange}
                options={[
                  { value: 'ALL', label: 'All Roles' },
                  { value: 'CITIZEN', label: 'Citizen' },
                  { value: 'POLICE', label: 'Police' },
                  { value: 'ADMIN', label: 'Admin' },
                ]}
              />
            </div>
          </div>

          {/* Table */}
          {loading && !showForm ? (
            <div className="flex justify-center items-center py-12">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <UserTable
                  users={paginatedUsers}
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
                  <p className="text-gray-600">No users found matching your criteria.</p>
                </div>
              )}
            </>
          )}

          {/* User Form Modal */}
          {showForm && (
            <Modal
              isOpen={showForm}
              onClose={() => {
                setShowForm(false);
                setSelectedUser(null);
              }}
              title={formMode === 'create' ? 'Create User' : 'Edit User'}
              size="md"
            >
              <UserForm
                initialData={selectedUser}
                onSubmit={handleFormSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setSelectedUser(null);
                }}
                loading={loading}
              />
            </Modal>
          )}

          {/* Delete Confirmation Dialog */}
          <ConfirmDialog
            isOpen={showDeleteConfirm}
            onClose={() => {
              setShowDeleteConfirm(false);
              setUserToDelete(null);
            }}
            onConfirm={confirmDelete}
            title="Delete User"
            message="Are you sure you want to delete this user? This action cannot be undone and all associated data will be permanently removed."
            confirmText="Delete"
            cancelText="Cancel"
            variant="danger"
          />
        </div>
      </div>
    </Layout>
  );
};

export default UserManagement;
