import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const QuickActions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getActions = () => {
    const role = user?.role?.toLowerCase();
    
    const actions = {
      admin: [
        { label: 'Create User', path: '/admin/users', icon: '👥' },
        { label: 'Create Location', path: '/admin/locations', icon: '📍' },
        { label: 'Create Alert', path: '/admin/alerts', icon: '🚨' },
        { label: 'View Analytics', path: '/admin/analytics', icon: '📊' },
      ],
      police: [
        { label: 'Create Alert', path: '/police/create-alert', icon: '🚨' },
        { label: 'View Reports', path: '/police/reports', icon: '📝' },
        { label: 'Analytics', path: '/police/analytics', icon: '📊' },
      ],
      citizen: [
        { label: 'Create Report', path: '/citizen/create-report', icon: '📝' },
        { label: 'View Alerts', path: '/citizen/alerts', icon: '🚨' },
        { label: 'Emergency Contacts', path: '/citizen/emergency', icon: '🆘' },
      ],
    };

    return actions[role] || [];
  };

  const actions = getActions();

  return (
    <Card title="Quick Actions" className="mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action) => (
          <Button
            key={action.path}
            variant="outline"
            onClick={() => navigate(action.path)}
            className="flex flex-col items-center justify-center p-6 h-full min-h-[120px] space-y-2 hover:bg-blue-50 transition-colors"
          >
            <span className="text-3xl">{action.icon}</span>
            <span className="text-sm font-medium text-slate-700">{action.label}</span>
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default QuickActions;

