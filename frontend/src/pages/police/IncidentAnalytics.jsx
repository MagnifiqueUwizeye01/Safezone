import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import IncidentChart from '../../components/dashboard/IncidentChart';
import LocationStats from '../../components/dashboard/LocationStats';
import Spinner from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import { useAuth } from '../../hooks/useAuth';
import reportService from '../../api/services/reportService';
import { FileText, Hourglass, RefreshCw, CheckCircle } from 'lucide-react';

const IncidentAnalytics = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    inProgressReports: 0,
    resolvedReports: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [locationStats, setLocationStats] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, [user]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const allReports = await reportService.getAllReports();
      const userReports = user?.location
        ? allReports.filter(r => r.location?.id === user.location.id)
        : allReports;

      const pendingReports = userReports.filter(r => r.status === 'PENDING').length;
      const inProgressReports = userReports.filter(r => r.status === 'IN_PROGRESS').length;
      const resolvedReports = userReports.filter(r => r.status === 'RESOLVED').length;

      setStats({
        totalReports: userReports.length,
        pendingReports,
        inProgressReports,
        resolvedReports,
      });

      // Chart data by type
      const typeCounts = {};
      userReports.forEach(report => {
        typeCounts[report.type] = (typeCounts[report.type] || 0) + 1;
      });
      setChartData(
        Object.entries(typeCounts).map(([label, value]) => ({ label, value }))
      );

      // Location stats
      const locationCounts = {};
      userReports.forEach(report => {
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Incident Analytics</h1>
            <p className="text-gray-600">Analyze incident trends and patterns in your area</p>
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                  <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
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
                  <p className="text-sm font-medium text-gray-600 mb-1">In Progress</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.inProgressReports}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Resolved</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.resolvedReports}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Reports by Type</h2>
              <IncidentChart data={chartData} type="bar" />
            </div>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Location Statistics</h2>
              <LocationStats stats={locationStats} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default IncidentAnalytics;

