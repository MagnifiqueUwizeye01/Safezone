import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Spinner from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import IncidentChart from '../../components/dashboard/IncidentChart';
import LocationStats from '../../components/dashboard/LocationStats';
import userService from '../../api/services/userService';
import reportService from '../../api/services/reportService';
import alertService from '../../api/services/alertService';
import locationService from '../../api/services/locationService';
import { normalizeReports } from '../../utils/reportHelpers';
import { normalizeAlerts } from '../../utils/alertHelpers';
import { format } from 'date-fns';
import { Users, FileText, AlertCircle, MapPin, Hourglass, Bell, Eye, RefreshCw } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalReports: 0,
    totalAlerts: 0,
    totalLocations: 0,
    pendingReports: 0,
    activeAlerts: 0,
  });
  const [recentReports, setRecentReports] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [locationStats, setLocationStats] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardData(false);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setRefreshing(true);
      setError(null);
      
      // Fetch all data in parallel
      const [usersData, reportsData, alertsData, locationsData] = await Promise.all([
        userService.getAllUsers().catch(() => []),
        reportService.getAllReports().catch(() => []),
        alertService.getAllAlerts().catch(() => []),
        locationService.getAllLocations().catch(() => []),
      ]);

      // Ensure all data are arrays
      const users = Array.isArray(usersData) ? usersData : [];
      const reports = Array.isArray(reportsData) ? reportsData : [];
      const alerts = Array.isArray(alertsData) ? alertsData : [];
      const locations = Array.isArray(locationsData) ? locationsData : [];

      // Calculate stats
      const pendingReports = reports.filter(r => r.status === 'PENDING').length;
      const activeAlerts = alerts.length;

      setStats({
        totalUsers: users.length,
        totalReports: reports.length,
        totalAlerts: alerts.length,
        totalLocations: locations.length,
        pendingReports,
        activeAlerts,
      });

      // Get recent reports (last 5) and normalize
      const sortedReports = normalizeReports([...reports])
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 5);
      setRecentReports(sortedReports);

      // Get recent alerts (last 5) and normalize
      const sortedAlerts = normalizeAlerts([...alerts])
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 5);
      setRecentAlerts(sortedAlerts);

      // Prepare chart data (reports by type) - use normalized reports
      const normalizedReports = normalizeReports(reports);
      const reportTypes = {};
      normalizedReports.forEach(report => {
        const type = report.type;
        reportTypes[type] = (reportTypes[type] || 0) + 1;
      });
      setChartData(
        Object.entries(reportTypes).map(([label, value]) => ({ label, value }))
      );

      // Prepare location stats
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
      setError(err.message || 'Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      if (showLoading) setLoading(false);
      setRefreshing(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' },
      IN_PROGRESS: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'In Progress' },
      RESOLVED: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Resolved' },
      CANCELLED: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Cancelled' },
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getReportTypeLabel = (type) => {
    const typeMap = {
      THEFT: 'Theft',
      VIOLENCE: 'Violence',
      HARASSMENT: 'Harassment',
      VANDALISM: 'Vandalism',
      LOST_ITEM: 'Lost Item',
      SUSPICIOUS_ACTIVITY: 'Suspicious Activity',
      EMERGENCY: 'Emergency',
      OTHER: 'Other',
    };
    return typeMap[type] || type;
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Spinner size="lg" />
          <p className="text-gray-600">Loading dashboard...</p>
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
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Overview of system statistics and activities</p>
            </div>
            <button
              onClick={() => fetchDashboardData(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
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

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Pending Reports</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.pendingReports}</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Hourglass className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Active Alerts</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.activeAlerts}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
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

          {/* Recent Reports Table */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
            </div>
            
            {recentReports.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No recent reports</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentReports.map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {getReportTypeLabel(report.type || report.reportType)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(report.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {report.location?.name || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {formatDate(report.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => navigate(`/admin/reports/${report.id}`)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors duration-200"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent Alerts */}
          {recentAlerts.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Alerts</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">{alert.title || alert.type}</h3>
                        <p className="text-sm text-gray-600 mb-2">{alert.description || alert.message}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{alert.location?.name || 'N/A'}</span>
                          <span>{formatDate(alert.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
