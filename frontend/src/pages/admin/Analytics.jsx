import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import IncidentChart from '../../components/dashboard/IncidentChart';
import LocationStats from '../../components/dashboard/LocationStats';
import Spinner from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import userService from '../../api/services/userService';
import reportService from '../../api/services/reportService';
import alertService from '../../api/services/alertService';
import locationService from '../../api/services/locationService';
import { Users, FileText, Bell, MapPin } from 'lucide-react';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalReports: 0,
    totalAlerts: 0,
    totalLocations: 0,
    usersByRole: {},
    reportsByType: {},
    reportsByStatus: {},
  });
  const [chartData, setChartData] = useState([]);
  const [locationStats, setLocationStats] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const [users, reports, alerts, locations] = await Promise.all([
        userService.getAllUsers(),
        reportService.getAllReports(),
        alertService.getAllAlerts(),
        locationService.getAllLocations(),
      ]);

      // Calculate user stats by role
      const usersByRole = {};
      users.forEach(user => {
        usersByRole[user.role] = (usersByRole[user.role] || 0) + 1;
      });

      // Calculate report stats
      const reportsByType = {};
      const reportsByStatus = {};
      reports.forEach(report => {
        const reportType = report.type || report.reportType || 'OTHER';
        const reportStatus = report.status || 'PENDING';
        reportsByType[reportType] = (reportsByType[reportType] || 0) + 1;
        reportsByStatus[reportStatus] = (reportsByStatus[reportStatus] || 0) + 1;
      });

      setStats({
        totalUsers: users.length,
        totalReports: reports.length,
        totalAlerts: alerts.length,
        totalLocations: locations.length,
        usersByRole,
        reportsByType,
        reportsByStatus,
      });

      // Chart data
      setChartData(
        Object.entries(reportsByType).map(([label, value]) => ({ label, value }))
      );

      // Location stats
      const locationCounts = {};
      reports.forEach(report => {
        if (report.location) {
          const locName = report.location.name;
          locationCounts[locName] = {
            location: locName,
            count: (locationCounts[locName]?.count || 0) + 1,
            reports: (locationCounts[locName]?.reports || 0) + 1,
            alerts: locationCounts[locName]?.alerts || 0,
          };
        }
      });
      setLocationStats(Object.values(locationCounts));

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Spinner size="lg" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Alert type="danger" message={error} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Comprehensive system analytics and insights</p>
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Reports</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalReports}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Alerts</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalAlerts}</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Locations</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalLocations}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Reports by Type</h2>
              <IncidentChart data={chartData} type="bar" />
            </div>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Location Statistics</h2>
              <LocationStats stats={locationStats} />
            </div>
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Users by Role</h3>
              <div className="space-y-3">
                {Object.entries(stats.usersByRole).length > 0 ? (
                  Object.entries(stats.usersByRole).map(([role, count]) => (
                    <div key={role} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium text-gray-700 capitalize">{role.toLowerCase()}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-16 bg-emerald-100 rounded-full h-2">
                          <div 
                            className="bg-emerald-600 h-2 rounded-full"
                            style={{ width: `${(count / stats.totalUsers) * 100}%` }}
                          />
                        </div>
                        <strong className="text-lg font-bold text-gray-900 min-w-[3rem] text-right">{count}</strong>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No user data available</p>
                )}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reports by Status</h3>
              <div className="space-y-3">
                {Object.entries(stats.reportsByStatus).length > 0 ? (
                  Object.entries(stats.reportsByStatus).map(([status, count]) => {
                    const statusColors = {
                      PENDING: 'bg-amber-600',
                      IN_PROGRESS: 'bg-blue-600',
                      RESOLVED: 'bg-emerald-600',
                      CANCELLED: 'bg-gray-600',
                    };
                    const statusBgColors = {
                      PENDING: 'bg-amber-100',
                      IN_PROGRESS: 'bg-blue-100',
                      RESOLVED: 'bg-emerald-100',
                      CANCELLED: 'bg-gray-100',
                    };
                    return (
                      <div key={status} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <span className="text-sm font-medium text-gray-700">
                          {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className={`w-16 ${statusBgColors[status] || 'bg-gray-100'} rounded-full h-2`}>
                            <div 
                              className={`${statusColors[status] || 'bg-gray-600'} h-2 rounded-full`}
                              style={{ width: `${(count / stats.totalReports) * 100}%` }}
                            />
                          </div>
                          <strong className="text-lg font-bold text-gray-900 min-w-[3rem] text-right">{count}</strong>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-center py-4">No report data available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;

