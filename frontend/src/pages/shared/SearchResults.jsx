import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Spinner from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import Avatar from '../../components/common/Avatar';
import { Search, FileText, Bell, Users, MapPin } from 'lucide-react';
import reportService from '../../api/services/reportService';
import alertService from '../../api/services/alertService';
import userService from '../../api/services/userService';
import locationService from '../../api/services/locationService';
import { formatDateTime } from '../../utils/formatters';
import { useAuth } from '../../hooks/useAuth';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const query = searchParams.get('q') || '';
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState({
    reports: [],
    alerts: [],
    users: [],
    locations: [],
  });

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchTerm) => {
    if (!searchTerm || searchTerm.trim().length === 0) {
      setResults({ reports: [], alerts: [], users: [], locations: [] });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const term = searchTerm.toLowerCase().trim();
      
      // Fetch all data in parallel
      const [reports, alerts, users, locations] = await Promise.all([
        reportService.getAllReports().catch(() => []),
        alertService.getAllAlerts().catch(() => []),
        user?.role === 'ADMIN' ? userService.getAllUsers().catch(() => []) : Promise.resolve([]),
        user?.role === 'ADMIN' ? locationService.getAllLocations().catch(() => []) : Promise.resolve([]),
      ]);

      // Filter results based on search term
      const filterByTerm = (item) => {
        return JSON.stringify(item).toLowerCase().includes(term);
      };

      setResults({
        reports: reports.filter(filterByTerm).slice(0, 10),
        alerts: alerts.filter(filterByTerm).slice(0, 10),
        users: users.filter(filterByTerm).slice(0, 10),
        locations: locations.filter(filterByTerm).slice(0, 10),
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to perform search');
    } finally {
      setLoading(false);
    }
  };

  const totalResults = results.reports.length + results.alerts.length + results.users.length + results.locations.length;

  const ResultCard = ({ icon: Icon, title, items, onItemClick, getItemTitle, getItemSubtitle, renderItem }) => {
    if (items.length === 0) return null;

    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Icon className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <span className="text-sm text-gray-500">({items.length})</span>
        </div>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={index}
              onClick={() => onItemClick && onItemClick(item)}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer"
            >
              {renderItem ? (
                renderItem(item)
              ) : (
                <>
                  <div className="font-medium text-gray-900">{getItemTitle(item)}</div>
                  <div className="text-sm text-gray-600 mt-1">{getItemSubtitle(item)}</div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Search className="w-6 h-6 text-emerald-600" />
              <h1 className="text-3xl font-bold text-gray-900">Search Results</h1>
            </div>
            {query && (
              <p className="text-gray-600">
                Searching for: <span className="font-semibold text-gray-900">"{query}"</span>
              </p>
            )}
          </div>

          {error && (
            <Alert type="danger" message={error} dismissible onClose={() => setError(null)} />
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Spinner size="lg" />
            </div>
          ) : query ? (
            <>
              {totalResults === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg mb-2">No results found</p>
                  <p className="text-gray-500">
                    Try searching with different keywords or check your spelling.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="mb-6 text-sm text-gray-600">
                    Found {totalResults} result{totalResults !== 1 ? 's' : ''} for "{query}"
                  </div>

                  <ResultCard
                    icon={FileText}
                    title="Reports"
                    items={results.reports}
                    onItemClick={(report) => navigate(`/${user?.role?.toLowerCase()}/reports/${report.id}`)}
                    getItemTitle={(report) => report.title || 'Untitled Report'}
                    getItemSubtitle={(report) => 
                      `${report.type || 'Unknown'} • ${report.status || 'Unknown'} • ${report.location?.name || 'Unknown Location'} • ${formatDateTime(report.createdAt)}`
                    }
                  />

                  <ResultCard
                    icon={Bell}
                    title="Alerts"
                    items={results.alerts}
                    onItemClick={(alert) => navigate(`/${user?.role?.toLowerCase()}/alerts`)}
                    getItemTitle={(alert) => alert.title || 'Untitled Alert'}
                    getItemSubtitle={(alert) => 
                      `${alert.type || 'Unknown'} • ${alert.location?.name || 'Unknown Location'} • ${formatDateTime(alert.createdAt)}`
                    }
                  />

                  {user?.role === 'ADMIN' && (
                    <>
                      <ResultCard
                        icon={Users}
                        title="Users"
                        items={results.users}
                        onItemClick={(user) => navigate('/admin/users')}
                        getItemTitle={(user) => user.fullName || user.username || 'Unknown User'}
                        getItemSubtitle={(user) => 
                          `${user.email || 'No email'} • ${user.role || 'Unknown Role'}`
                        }
                        renderItem={(user) => (
                          <div className="flex items-center gap-3">
                            <Avatar user={user} size="sm" />
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{user.fullName || user.username || 'Unknown User'}</div>
                              <div className="text-sm text-gray-600">{user.email || 'No email'} • {user.role || 'Unknown Role'}</div>
                            </div>
                          </div>
                        )}
                      />

                      <ResultCard
                        icon={MapPin}
                        title="Locations"
                        items={results.locations}
                        onItemClick={(location) => navigate('/admin/locations')}
                        getItemTitle={(location) => location.name || 'Unknown Location'}
                        getItemSubtitle={(location) => 
                          `${location.type || 'Unknown'} • ${location.code || 'No code'}`
                        }
                      />
                    </>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Enter a search term to find reports, alerts, users, and locations.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SearchResults;

