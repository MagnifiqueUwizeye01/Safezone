import React from 'react';
import Badge from '../common/Badge';
import { MapPin } from 'lucide-react';

const LocationStats = ({ stats = [] }) => {
  return (
    <div className="w-full">
      {stats.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No location statistics available</p>
        </div>
      ) : (
        <div className="space-y-4">
          {stats.map((stat, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-emerald-300 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-semibold text-gray-900">{stat.location || 'Unknown Location'}</h4>
                </div>
                <Badge variant="info" pill>
                  {stat.count || 0} incidents
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                <span className="flex items-center gap-1">
                  <span className="font-medium">Reports:</span>
                  <span>{stat.reports || 0}</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="font-medium">Alerts:</span>
                  <span>{stat.alerts || 0}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationStats;
