import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import LocationForm from '../../components/locations/LocationForm';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Spinner from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import Pagination from '../../components/common/Pagination';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import locationService from '../../api/services/locationService';
import { PAGINATION } from '../../utils/constants';
import { Search, MapPin, Edit2, Trash2, Plus } from 'lucide-react';

const LocationManagement = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await locationService.getAllLocations();
      setLocations(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch locations');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormMode('create');
    setSelectedLocation(null);
    setShowForm(true);
  };

  const handleEdit = (location) => {
    setFormMode('edit');
    setSelectedLocation(location);
    setShowForm(true);
  };

  const handleDelete = (locationId) => {
    setLocationToDelete(locationId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (locationToDelete) {
      try {
        await locationService.deleteLocation(locationToDelete);
        fetchLocations();
        setShowDeleteConfirm(false);
        setLocationToDelete(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete location');
        setShowDeleteConfirm(false);
        setLocationToDelete(null);
      }
    }
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      if (formMode === 'create') {
        if (formData.type === 'PROVINCE') {
          await locationService.createParentLocation(formData);
        } else {
          await locationService.createChildLocation(formData.parentCode, formData);
        }
      } else {
        await locationService.updateLocation(selectedLocation.id, formData);
      }
      setShowForm(false);
      setSelectedLocation(null);
      fetchLocations();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${formMode} location`);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredLocations = () => {
    return locations.filter(location => {
      const matchesSearch = searchTerm === '' || 
        location.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.code?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'ALL' || location.type === filterType;
      return matchesSearch && matchesType;
    });
  };

  const filteredLocations = getFilteredLocations();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGINATION.DEFAULT_SIZE);

  // Pagination calculations
  const totalItems = filteredLocations.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedLocations = filteredLocations.slice(startIndex, endIndex);

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
  }, [searchTerm, filterType]);

  const getTypeBadgeColor = (type) => {
    const colors = {
      PROVINCE: 'bg-purple-100 text-purple-700',
      DISTRICT: 'bg-blue-100 text-blue-700',
      SECTOR: 'bg-emerald-100 text-emerald-700',
      CELL: 'bg-amber-100 text-amber-700',
      VILLAGE: 'bg-gray-100 text-gray-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Location Management</h1>
              <p className="text-gray-600">Manage provinces, districts, sectors, cells, and villages</p>
            </div>
            <Button
              variant="primary"
              onClick={handleCreate}
              disabled={showForm}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create New Location
            </Button>
          </div>

          {error && (
            <div className="mb-6">
              <Alert type="danger" message={error} dismissible onClose={() => setError(null)} />
            </div>
          )}

          {/* Search and Filters */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                options={[
                  { value: 'ALL', label: 'All Types' },
                  { value: 'PROVINCE', label: 'Province' },
                  { value: 'DISTRICT', label: 'District' },
                  { value: 'SECTOR', label: 'Sector' },
                  { value: 'CELL', label: 'Cell' },
                  { value: 'VILLAGE', label: 'Village' },
                ]}
              />
            </div>
          </div>

          {/* Table */}
          {loading && !showForm ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Spinner size="lg" />
              <p className="text-gray-600 mt-4">Loading locations...</p>
            </div>
          ) : (
            <>
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                {filteredLocations.length === 0 ? (
                  <div className="p-12 text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No locations found</p>
                    <p className="text-gray-400 text-sm mt-2">
                      {searchTerm || filterType !== 'ALL' 
                        ? 'Try adjusting your search or filter criteria' 
                        : 'Create your first location to get started'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-emerald-600" />
                              <span>Name</span>
                            </div>
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Code</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Type</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Parent Code</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedLocations.map((location, index) => (
                          <tr 
                            key={location.id} 
                            className={`transition-all duration-200 ${
                              index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                            } hover:bg-emerald-50/50 hover:shadow-sm`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                  <MapPin className="w-4 h-4 text-emerald-600" />
                                </div>
                                <span className="text-sm font-semibold text-gray-900">{location.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-gray-800 text-sm font-mono font-medium">
                                {location.code}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${getTypeBadgeColor(location.type)} shadow-sm`}>
                                {location.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {location.parentCode || location.parent?.code ? (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-sm font-mono font-medium">
                                  {location.parentCode || location.parent?.code}
                                </span>
                              ) : (
                                <span className="text-sm text-gray-400 italic">—</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEdit(location)}
                                  disabled={showForm}
                                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-800 rounded-lg transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-200"
                                  title="Edit location"
                                >
                                  <Edit2 className="w-4 h-4" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(location.id)}
                                  disabled={showForm}
                                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 hover:text-red-800 rounded-lg transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed border border-red-200"
                                  title="Delete location"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
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
            </>
          )}

          {/* Form Modal */}
          {showForm && (
            <Modal
              isOpen={showForm}
              onClose={() => {
                setShowForm(false);
                setSelectedLocation(null);
              }}
              title={formMode === 'create' ? 'Create New Location' : 'Edit Location'}
              size="lg"
            >
              <LocationForm
                initialData={selectedLocation}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setSelectedLocation(null);
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
              setLocationToDelete(null);
            }}
            onConfirm={confirmDelete}
            title="Delete Location"
            message="Are you sure you want to delete this location? This action cannot be undone and may affect associated users and reports."
            confirmText="Delete"
            cancelText="Cancel"
            variant="danger"
          />
        </div>
      </div>
    </Layout>
  );
};

export default LocationManagement;
