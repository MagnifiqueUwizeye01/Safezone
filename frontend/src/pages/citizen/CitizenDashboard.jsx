import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Spinner from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import reportService from '../../api/services/reportService';
import alertService from '../../api/services/alertService';
import notificationService from '../../api/services/notificationService';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { normalizeReports } from '../../utils/reportHelpers';
import { normalizeAlerts } from '../../utils/alertHelpers';
import { format } from 'date-fns';
import { Eye, RefreshCw, AlertCircle, TrendingUp } from 'lucide-react';

const CitizenDashboard = () => {
  const { user } = useAuth();
  const { unreadCount } = useNotification();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    myReports: 0,
    activeAlerts: 0,
    pending: 0,
    resolved: 0,
  });
  const [recentReports, setRecentReports] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardData(false);
    }, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const fetchDashboardData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setRefreshing(true);
      setError(null);
      
      const [reportsData, alertsData] = await Promise.all([
        reportService.getAllReports().catch(() => []),
        alertService.getAllAlerts().catch(() => []),
      ]);

      // Ensure reports and alerts are arrays
      const reports = Array.isArray(reportsData) ? reportsData : [];
      const alerts = Array.isArray(alertsData) ? alertsData : [];

      // Filter reports by current user
      const userReports = reports.filter(r => r.reporter?.id === user?.id);
      const pendingReports = userReports.filter(r => r.status === 'PENDING').length;
      const resolvedReports = userReports.filter(r => r.status === 'RESOLVED').length;
      const inProgressReports = userReports.filter(r => r.status === 'IN_PROGRESS').length;

      // Filter alerts by user's location - check if alert location matches user's location hierarchy
      let userAlerts = [];
      if (user?.location) {
        userAlerts = alerts.filter(a => {
          // Check if alert location matches user location or is a parent
          return a.location?.id === user.location.id || 
                 (a.location?.code && user.location?.code && 
                  a.location.code.startsWith(user.location.code.split('-')[0]));
        });
      } else {
        userAlerts = alerts;
      }

      // Get active alerts (non-expired)
      const activeAlerts = userAlerts.filter(a => {
        if (!a.createdAt) return true;
        const alertDate = new Date(a.createdAt);
        const daysSince = (Date.now() - alertDate.getTime()) / (1000 * 60 * 60 * 24);
        return daysSince <= 7; // Consider alerts active for 7 days
      });

      setStats({
        myReports: userReports.length,
        activeAlerts: activeAlerts.length,
        pending: pendingReports,
        resolved: resolvedReports,
      });

      // Get recent reports (last 5) and normalize
      const sortedReports = normalizeReports([...userReports])
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 5);
      setRecentReports(sortedReports);

      // Get recent alerts (last 5) and normalize
      const sortedAlerts = normalizeAlerts([...activeAlerts])
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 5);
      setRecentAlerts(sortedAlerts);

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
      <div className="space-y-6">
        {/* Page Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Monitor your reports and stay informed about safety alerts in your community</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">My Reports</p>
                <p className="text-3xl font-bold text-gray-900">{stats.myReports}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Alerts</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeAlerts}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Resolved</p>
                <p className="text-3xl font-bold text-gray-900">{stats.resolved}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Reports Table */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
          </div>
          
          {recentReports.length === 0 ? (
            <div className="p-12 text-center">
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
                          onClick={() => navigate('/citizen/reports')}
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

        {/* Recent Alerts Section */}
        {recentAlerts.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Safety Alerts</h2>
              <button
                onClick={() => navigate('/citizen/alerts')}
                className="text-sm text-emerald-700 hover:text-emerald-800 font-medium"
              >
                View All
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-emerald-300 transition-colors"
                  >
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900">{alert.title || 'Safety Alert'}</h3>
                        <span className="text-xs text-gray-500">
                          {formatDate(alert.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {alert.description || 'No description available'}
                      </p>
                      {alert.location && (
                        <p className="text-xs text-gray-500 mt-1">
                          Location: {alert.location.name}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CitizenDashboard;
