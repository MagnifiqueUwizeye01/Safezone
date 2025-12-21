import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import TextArea from '../common/TextArea';
import Button from '../common/Button';
import { LOCATION_TYPES } from '../../utils/constants';
import { useLocation } from '../../context/LocationContext';
import { validateForm } from '../../utils/validation';

const LocationForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const { provinces, getChildrenByParent } = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'PROVINCE',
    parentCode: '',
    description: '',
    ...initialData,
  });
  const [errors, setErrors] = useState({});
  const [parentLocations, setParentLocations] = useState([]);

  useEffect(() => {
    if (formData.type !== 'PROVINCE' && formData.type !== initialData?.type) {
      loadParentLocations();
    }
  }, [formData.type]);

  const loadParentLocations = async () => {
    try {
      const children = await getChildrenByParent(provinces[0]?.code || '');
      setParentLocations(children || []);
    } catch (error) {
      console.error('Error loading parent locations:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setFormData((prev) => ({
      ...prev,
      type,
      parentCode: type === 'PROVINCE' ? '' : prev.parentCode,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const rules = {
      name: {
        required: true,
        minLength: 2,
        maxLength: 100,
      },
      code: {
        required: true,
        minLength: 2,
        maxLength: 20,
      },
      type: {
        required: true,
      },
      parentCode: {
        required: formData.type !== 'PROVINCE',
      },
    };

    const validation = validateForm(formData, rules);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSubmit(formData);
  };

  const locationTypeOptions = Object.values(LOCATION_TYPES).map((type) => ({
    value: type,
    label: type.charAt(0) + type.slice(1).toLowerCase(),
  }));

  const parentOptions = formData.type === 'PROVINCE' 
    ? []
    : parentLocations.map((loc) => ({
        value: loc.code,
        label: `${loc.name} (${loc.code})`,
      }));

  return (
    <form onSubmit={handleSubmit} className="location-form">
      <Select
        label="Location Type"
        name="type"
        value={formData.type}
        onChange={handleTypeChange}
        options={locationTypeOptions}
        error={errors.type}
        required
        disabled={!!initialData}
      />
      {formData.type !== 'PROVINCE' && (
        <Select
          label="Parent Location"
          name="parentCode"
          value={formData.parentCode}
          onChange={handleChange}
          options={[{ value: '', label: 'Select Parent Location' }, ...parentOptions]}
          error={errors.parentCode}
          required
        />
      )}
      <Input
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
      />
      <Input
        label="Code"
        name="code"
        value={formData.code}
        onChange={handleChange}
        error={errors.code}
        required
        disabled={!!initialData}
      />
      <TextArea
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
        rows={3}
      />
      <div className="form-actions">
        <Button type="submit" variant="primary" loading={loading}>
          {initialData ? 'Update Location' : 'Create Location'}
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

export default LocationForm;

