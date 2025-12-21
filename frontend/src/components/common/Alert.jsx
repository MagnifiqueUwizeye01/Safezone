import React from 'react';

const Alert = ({
  type = 'info',
  message,
  title,
  onClose,
  dismissible = false,
  className = '',
}) => {
  const alertClasses = `alert alert-${type} ${dismissible ? 'alert-dismissible' : ''} ${className}`;

  return (
    <div className={alertClasses} role="alert">
      {title && <h4 className="alert-heading">{title}</h4>}
      <p>{message}</p>
      {dismissible && onClose && (
        <button type="button" className="alert-close" onClick={onClose}>
          <span>&times;</span>
        </button>
      )}
    </div>
  );
};

export default Alert;

