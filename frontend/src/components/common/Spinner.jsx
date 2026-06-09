import React from 'react';

const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'spinner-sm',
    md: 'spinner-md',
    lg: 'spinner-lg',
  };

  return (
    <div className={`spinner ${sizeClasses[size]} ${className}`}>
      <div className="spinner-border"></div>
    </div>
  );
};

export default Spinner;

