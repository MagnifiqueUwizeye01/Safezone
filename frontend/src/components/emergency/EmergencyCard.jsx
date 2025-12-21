import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { formatPhoneNumber } from '../../utils/formatters';

const EmergencyCard = ({ emergency, onClick }) => {
  return (
    <Card
      title={emergency.name}
      subtitle={emergency.department}
      onClick={onClick}
      className="emergency-card"
    >
      <div className="emergency-card-content">
        <div className="emergency-contact">
          <p className="emergency-phone">📞 {formatPhoneNumber(emergency.phone)}</p>
          {emergency.email && (
            <p className="emergency-email">✉️ {emergency.email}</p>
          )}
        </div>
        <div className="emergency-meta">
          <Badge variant={emergency.isActive ? 'success' : 'secondary'} pill>
            {emergency.isActive ? 'Active' : 'Inactive'}
          </Badge>
          {emergency.location && (
            <span className="emergency-location">📍 {emergency.location.name}</span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default EmergencyCard;

