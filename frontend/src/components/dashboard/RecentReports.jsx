import React from 'react';
import Card from '../common/Card';
import ReportCard from '../reports/ReportCard';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';

const RecentReports = ({ reports = [], limit = 5 }) => {
  const navigate = useNavigate();
  const recentReports = reports.slice(0, limit);

  return (
    <Card title="Recent Reports" className="h-full">
      {recentReports.length === 0 ? (
        <p className="text-center text-slate-500 py-8">No recent reports</p>
      ) : (
        <div className="space-y-3">
          {recentReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onClick={() => navigate(`/reports/${report.id}`)}
            />
          ))}
        </div>
      )}
      <div className="mt-4 pt-4 border-t border-slate-200">
        <Button
          variant="outline"
          onClick={() => navigate('/reports')}
          className="w-full"
        >
          View All Reports
        </Button>
      </div>
    </Card>
  );
};

export default RecentReports;

