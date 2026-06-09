import React, { useState } from 'react';
import { AlertCircle, FileText, MapPin, Tag, X } from 'lucide-react';
import { ALERT_TYPES } from '../../utils/constants';
import { useLocation } from '../../context/LocationContext';

const AlertForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const { provinces } = useLocation();
  // Normalize initialData from backend format to form format
  const normalizedInitialData = initialData ? {
    title: initialData.title || '',
    description: initialData.description || initialData.message || '', // Backend uses 'message', form uses 'description'
    type: initialData.type || initialData.alertType || 'INFO',
    locationId: initialData.locationId || initialData.location?.id || '',
  } : {};

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'INFO',
    locationId: '',
    ...normalizedInitialData,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.type) {
      newErrors.type = 'Type is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  const alertTypeOptions = Object.values(ALERT_TYPES).map((type) => ({
    value: type,
    label: type.replace('_', ' '),
  }));

  const locationOptions = (provinces || []).map((province) => ({
    value: province.id,
    label: province.name,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Field */}
      <div className="space-y-2">
        <label htmlFor="title" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <AlertCircle className="w-4 h-4 text-emerald-600" />
          Title
          <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Enter alert title"
          className={`w-full px-4 py-2.5 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ${
            errors.title
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
              : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 bg-white hover:border-gray-400'
          }`}
        />
        {errors.title && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <X className="w-3 h-3" />
            {errors.title}
          </p>
        )}
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <FileText className="w-4 h-4 text-emerald-600" />
          Description
          <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={5}
          placeholder="Enter alert description..."
          className={`w-full px-4 py-2.5 border rounded-lg resize-none transition-all duration-200 focus:outline-none focus:ring-2 ${
            errors.description
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
              : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 bg-white hover:border-gray-400'
          }`}
        />
        {errors.description && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <X className="w-3 h-3" />
            {errors.description}
          </p>
        )}
      </div>

      {/* Alert Type Field */}
      <div className="space-y-2">
        <label htmlFor="type" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Tag className="w-4 h-4 text-emerald-600" />
          Alert Type
          <span className="text-red-500">*</span>
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className={`w-full px-4 py-2.5 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 appearance-none bg-white ${
            errors.type
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
              : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 hover:border-gray-400'
          }`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
            paddingRight: '2.5rem',
          }}
        >
          {alertTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.type && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <X className="w-3 h-3" />
            {errors.type}
          </p>
        )}
      </div>

      {/* Location Field */}
      <div className="space-y-2">
        <label htmlFor="locationId" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <MapPin className="w-4 h-4 text-emerald-600" />
          Location
        </label>
        <select
          id="locationId"
          name="locationId"
          value={formData.locationId}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 hover:border-gray-400 appearance-none bg-white"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
            paddingRight: '2.5rem',
          }}
        >
          <option value="">Select Location</option>
          {locationOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.locationId && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <X className="w-3 h-3" />
            {errors.locationId}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm shadow-emerald-600/30"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              {initialData ? 'Update Alert' : 'Create Alert'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AlertForm;

