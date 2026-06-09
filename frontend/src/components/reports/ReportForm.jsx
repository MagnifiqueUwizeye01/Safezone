import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import TextArea from '../common/TextArea';
import Button from '../common/Button';
import { REPORT_TYPES, REPORT_STATUS } from '../../utils/constants';
import { useLocation } from '../../context/LocationContext';

const ReportForm = ({ initialData, onSubmit, onCancel, loading, userRole }) => {
  const { provinces } = useLocation();
  // Normalize initialData from backend format to form format
  const normalizedInitialData = initialData ? {
    title: initialData.title || '',
    description: initialData.description || '',
    type: initialData.type || initialData.reportType || 'OTHER',
    status: initialData.status || 'PENDING',
    locationId: initialData.locationId || initialData.location?.id || '',
  } : {};

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'OTHER',
    status: 'PENDING',
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
    if (!formData.locationId) {
      newErrors.locationId = 'Location is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  const reportTypeOptions = Object.values(REPORT_TYPES).map((type) => ({
    value: type,
    label: type.replace('_', ' '),
  }));

  const reportStatusOptions = Object.values(REPORT_STATUS).map((status) => ({
    value: status,
    label: status.replace('_', ' '),
  }));

  const locationOptions = (provinces || []).map((province) => ({
    value: province.id,
    label: province.name,
  }));

  const canEditStatus = userRole === 'ADMIN' || userRole === 'POLICE';

  return (
    <form onSubmit={handleSubmit} className="report-form">
      <Input
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        required
      />
      <TextArea
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
        required
        rows={5}
      />
      <Select
        label="Report Type"
        name="type"
        value={formData.type}
        onChange={handleChange}
        options={reportTypeOptions}
        error={errors.type}
        required
      />
      {canEditStatus && (
        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={reportStatusOptions}
          error={errors.status}
        />
      )}
      <Select
        label="Location"
        name="locationId"
        value={formData.locationId}
        onChange={handleChange}
        options={[{ value: '', label: 'Select Location' }, ...locationOptions]}
        error={errors.locationId}
        required
      />
      <div className="form-actions">
        <Button type="submit" variant="primary" loading={loading}>
          {initialData ? 'Update Report' : 'Create Report'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default ReportForm;

