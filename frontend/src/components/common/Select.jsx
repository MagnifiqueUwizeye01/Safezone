import React from 'react';

const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error = null,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value || ''}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`form-input ${error ? 'form-input-error' : ''} ${disabled ? 'bg-slate-100 cursor-not-allowed' : ''}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <div className="form-error">{error}</div>}
    </div>
  );
};

export default Select;

