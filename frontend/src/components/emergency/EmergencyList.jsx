import React from 'react';
import EmergencyCard from './EmergencyCard';
import Spinner from '../common/Spinner';
import Alert from '../common/Alert';

const EmergencyList = ({ emergencies, loading, error, onEmergencyClick }) => {
  if (loading) {
    return (
      <div className="emergency-list-loading">
        <Spinner size="lg" />
        <p>Loading emergency contacts...</p>
      </div>
    );
  }

  if (error) {
    return <Alert type="danger" message={error} />;
  }

  if (!emergencies || emergencies.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Emergency Contacts Found</h3>
          <p className="text-gray-600 mb-4">
            There are currently no emergency contacts available for your location. Emergency contacts can be added by administrators.
          </p>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-left">
            <p className="text-sm font-semibold text-emerald-900 mb-2">Rwanda Emergency Numbers:</p>
            <ul className="text-sm text-emerald-800 space-y-1">
              <li>🚨 Police: <strong>112</strong> or <strong>3512</strong></li>
              <li>🚒 Fire Department: <strong>112</strong> or <strong>3511</strong></li>
              <li>🏥 Medical Emergency: <strong>112</strong> or <strong>912</strong></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="emergency-list">
      {emergencies.map((emergency) => (
        <EmergencyCard
          key={emergency.id}
          emergency={emergency}
          onClick={() => onEmergencyClick && onEmergencyClick(emergency)}
        />
      ))}
    </div>
  );
};

export default EmergencyList;

