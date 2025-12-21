import React from 'react';
import { formatLocationType } from '../../utils/formatters';

const LocationBreadcrumb = ({ location, onLocationClick }) => {
  if (!location) return null;

  const getLocationPath = (loc) => {
    const path = [];
    let current = loc;
    
    while (current) {
      path.unshift(current);
      current = current.parent;
    }
    
    return path;
  };

  const path = getLocationPath(location);

  return (
    <nav className="location-breadcrumb">
      {path.map((loc, index) => (
        <React.Fragment key={loc.id}>
          {index > 0 && <span className="breadcrumb-separator"> / </span>}
          <span
            className={`breadcrumb-item ${index === path.length - 1 ? 'active' : ''}`}
            onClick={() => onLocationClick && onLocationClick(loc)}
          >
            {loc.name} ({formatLocationType(loc.type)})
          </span>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default LocationBreadcrumb;

