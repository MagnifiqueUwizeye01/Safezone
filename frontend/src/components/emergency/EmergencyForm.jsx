import React, { useState } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import TextArea from '../common/TextArea';
import Button from '../common/Button';
import { EMERGENCY_DEPARTMENTS } from '../../utils/constants';
import { useLocation } from '../../context/LocationContext';
import { validateForm } from '../../utils/validation';

const EmergencyForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const { provinces } = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    department: 'POLICE',
    locationId: '',
    isActive: true,
    description: '',
    ...initialData,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const rules = {
      name: {
        required: true,
        minLength: 2,
        maxLength: 100,
      },
      phone: {
        required: true,
        phone: true,
      },
      email: {
        email: true,
      },
      department: {
        required: true,
      },
    };

    const validation = validateForm(formData, rules);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSubmit(formData);
  };

  const departmentOptions = Object.values(EMERGENCY_DEPARTMENTS).map((dept) => ({
    value: dept,
    label: dept.charAt(0) + dept.slice(1).toLowerCase(),
  }));

  const locationOptions = provinces.map((province) => ({
    value: province.id,
    label: province.name,
  }));

  return (
    <form onSubmit={handleSubmit} className="emergency-form">
      <Input
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
      />
      <Input
        label="Phone"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        error={errors.phone}
        required
      />
      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />
      <Select
        label="Department"
        name="department"
        value={formData.department}
        onChange={handleChange}
        options={departmentOptions}
        error={errors.department}
        required
      />
      <Select
        label="Location"
        name="locationId"
        value={formData.locationId}
        onChange={handleChange}
        options={[{ value: '', label: 'Select Location' }, ...locationOptions]}
        error={errors.locationId}
      />
      <TextArea
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
        rows={3}
      />
      <div className="form-check">
        <input
          type="checkbox"
          id="isActive"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          className="form-check-input"
        />
        <label htmlFor="isActive" className="form-check-label">
          Active
        </label>
      </div>
      <div className="form-actions">
        <Button type="submit" variant="primary" loading={loading}>
          {initialData ? 'Update Contact' : 'Create Contact'}
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

export default EmergencyForm;

