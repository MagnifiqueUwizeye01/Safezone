import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  header,
  footer,
  className = '',
  onClick,
  ...props
}) => {
  const cardClasses = `card ${onClick ? 'card-clickable' : ''} ${className}`.trim();

  return (
    <div className={cardClasses} onClick={onClick} {...props}>
      {(title || subtitle || header) && (
        <div className="card-header">
          {header || (
            <>
              {title && <h3 className="card-title">{title}</h3>}
              {subtitle && <p className="card-subtitle">{subtitle}</p>}
            </>
          )}
        </div>
      )}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
};

export default Card;

