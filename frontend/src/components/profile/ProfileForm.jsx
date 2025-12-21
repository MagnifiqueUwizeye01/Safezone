import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import TextArea from '../common/TextArea';
import Button from '../common/Button';
import { validateForm } from '../../utils/validation';

const ProfileForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    bio: '',
    dateOfBirth: '',
    preferredLanguage: '',
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
      fullName: {
        minLength: 2,
        maxLength: 100,
      },
      phone: {
        phone: true,
      },
    };

    const validation = validateForm(formData, rules);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      <Input
        label="Full Name"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        error={errors.fullName}
      />
      <Input
        label="Phone"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        error={errors.phone}
      />
      <TextArea
        label="Bio"
        name="bio"
        value={formData.bio}
        onChange={handleChange}
        error={errors.bio}
        rows={4}
      />
      <Input
        label="Date of Birth"
        name="dateOfBirth"
        type="date"
        value={formData.dateOfBirth}
        onChange={handleChange}
        error={errors.dateOfBirth}
      />
      <Input
        label="Preferred Language"
        name="preferredLanguage"
        value={formData.preferredLanguage}
        onChange={handleChange}
        error={errors.preferredLanguage}
        placeholder="e.g., English, Kinyarwanda"
      />
      <div className="form-actions">
        <Button type="submit" variant="primary" loading={loading}>
          Save Changes
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

export default ProfileForm;

