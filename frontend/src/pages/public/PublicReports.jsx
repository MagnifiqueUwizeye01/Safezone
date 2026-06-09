import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/PublicLayout';
import ReportCard from '../../components/reports/ReportCard';
import ReportFilter from '../../components/reports/ReportFilter';
import Spinner from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import Pagination from '../../components/common/Pagination';
import reportService from '../../api/services/reportService';
import { useSearch } from '../../hooks/useSearch';

const PublicReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);

  const { searchTerm, setSearchTerm, filteredData } = useSearch(reports, ['title', 'description', 'type']);

  useEffect(() => {
    fetchPublicReports();
  }, []);

  const fetchPublicReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reportService.getAllReports();
      // Only show resolved reports publicly
      const publicReports = data.filter(r => r.status === 'RESOLVED');
      setReports(publicReports);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    // Sync search filter with searchTerm for live search
    if (newFilters.search !== undefined) {
      setSearchTerm(newFilters.search);
    }
  };

  const getFilteredReports = () => {
    let filtered = filteredData;

    if (filters.type) {
      filtered = filtered.filter((r) => r.type === filters.type);
    }

    return filtered;
  };

  const filteredReports = getFilteredReports();
  const totalPages = Math.ceil(filteredReports.length / pageSize);
  const paginatedReports = filteredReports.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  return (
    <Layout>
      <div className="public-reports-page">
        <section className="public-reports-hero">
          <div className="container">
            <h1>Public Reports</h1>
            <p>View resolved incident reports in your community</p>
          </div>
        </section>

        <section className="public-reports-content">
          <div className="container">
            {error && (
              <Alert type="danger" message={error} dismissible onClose={() => setError(null)} />
            )}

            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <ReportFilter
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>

            {loading ? (
              <div className="loading-container">
                <Spinner size="lg" />
                <p>Loading reports...</p>
              </div>
            ) : (
              <>
                <div className="reports-grid">
                  {paginatedReports.length === 0 ? (
                    <div className="empty-state">
                      <p>No public reports available</p>
                    </div>
                  ) : (
                    paginatedReports.map((report) => (
                      <ReportCard key={report.id} report={report} />
                    ))
                  )}
                </div>

                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    pageSize={pageSize}
                    totalItems={filteredReports.length}
                  />
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default PublicReports;

