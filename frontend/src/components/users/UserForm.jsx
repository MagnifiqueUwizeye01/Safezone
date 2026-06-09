import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { USER_ROLES } from '../../utils/constants';
import { useLocation } from '../../context/LocationContext';
import { validateForm } from '../../utils/validation';

const UserForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const { provinces } = useLocation();
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    role: 'CITIZEN',
    locationId: '',
    badgeNumber: '', // For POLICE users
    policeStation: '', // For POLICE users
    ...initialData,
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
    
    const rules = {
      username: {
        required: true,
        username: true,
        minLength: 3,
        maxLength: 20,
      },
      email: {
        required: true,
        email: true,
      },
      password: {
        required: !initialData,
        password: !initialData,
        minLength: 8,
      },
      role: {
        required: true,
      },
      badgeNumber: {
        required: formData.role === 'POLICE',
      },
      policeStation: {
        required: formData.role === 'POLICE',
      },
    };

    const validation = validateForm(formData, rules);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSubmit(formData);
  };

  const roleOptions = Object.values(USER_ROLES).map((role) => ({
    value: role,
    label: role.replace('_', ' '),
  }));

  const locationOptions = provinces.map((province) => ({
    value: province.id,
    label: province.name,
  }));

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <Input
        label="Username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        error={errors.username}
        required
        disabled={!!initialData}
      />
      <Input
        label="Full Name"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        error={errors.fullName}
      />
      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        required
        disabled={!!initialData}
      />
      <Input
        label="Phone"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        error={errors.phone}
      />
      <Input
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        required={!initialData}
        placeholder={initialData ? 'Leave blank to keep current password' : ''}
      />
      <Select
        label="Role"
        name="role"
        value={formData.role}
        onChange={handleChange}
        options={roleOptions}
        error={errors.role}
        required
      />
      
      {/* POLICE-specific fields */}
      {formData.role === 'POLICE' && (
        <>
          <Input
            label="Badge Number"
            name="badgeNumber"
            value={formData.badgeNumber}
            onChange={handleChange}
            error={errors.badgeNumber}
            required
            placeholder="Enter police badge number (e.g., RNP-12345)"
          />
          <Input
            label="Police Station"
            name="policeStation"
            value={formData.policeStation}
            onChange={handleChange}
            error={errors.policeStation}
            required
            placeholder="Enter assigned police station"
          />
        </>
      )}
      
      <Select
        label="Location"
        name="locationId"
        value={formData.locationId}
        onChange={handleChange}
        options={[{ value: '', label: 'Select Location' }, ...locationOptions]}
        error={errors.locationId}
      />
      <div className="form-actions">
        <Button type="submit" variant="primary" loading={loading}>
          {initialData ? 'Update User' : 'Create User'}
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

export default UserForm;

