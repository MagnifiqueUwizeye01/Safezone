import React from 'react';
import Card from '../common/Card';
import AlertCard from '../alerts/AlertCard';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';

const RecentAlerts = ({ alerts = [], limit = 5 }) => {
  const navigate = useNavigate();
  const recentAlerts = alerts.slice(0, limit);

  return (
    <Card title="Recent Alerts" className="h-full">
      {recentAlerts.length === 0 ? (
        <p className="text-center text-slate-500 py-8">No recent alerts</p>
      ) : (
        <div className="space-y-3">
          {recentAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onClick={() => navigate(`/alerts/${alert.id}`)}
            />
          ))}
        </div>
      )}
      <div className="mt-4 pt-4 border-t border-slate-200">
        <Button
          variant="outline"
          onClick={() => navigate('/alerts')}
          className="w-full"
        >
          View All Alerts
        </Button>
      </div>
    </Card>
  );
};

export default RecentAlerts;

