import React from 'react';
import AlertCard from './AlertCard';
import Spinner from '../common/Spinner';
import Alert from '../common/Alert';

const AlertList = ({ alerts, loading, error, onAlertClick }) => {
  if (loading) {
    return (
      <div className="alert-list-loading">
        <Spinner size="lg" />
        <p>Loading alerts...</p>
      </div>
    );
  }

  if (error) {
    return <Alert type="danger" message={error} />;
  }

  if (!alerts || alerts.length === 0) {
    return (
      <div className="alert-list-empty">
        <p>No alerts found</p>
      </div>
    );
  }

  return (
    <div className="alert-list">
      {alerts.map((alert) => (
        <AlertCard
          key={alert.id}
          alert={alert}
          onClick={() => onAlertClick && onAlertClick(alert)}
        />
      ))}
    </div>
  );
};

export default AlertList;

