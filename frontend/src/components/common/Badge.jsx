import React from 'react';

const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  pill = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'badge';
  const variantClasses = {
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    success: 'badge-success',
    danger: 'badge-danger',
    warning: 'badge-warning',
    info: 'badge-info',
    light: 'badge-light',
    dark: 'badge-dark',
  };
  const sizeClasses = {
    sm: 'badge-sm',
    md: 'badge-md',
    lg: 'badge-lg',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
    pill ? 'badge-pill' : ''
  } ${className}`.trim();

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

export default Badge;

