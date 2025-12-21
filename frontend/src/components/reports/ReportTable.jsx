import React from 'react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Avatar from '../common/Avatar';
import { formatDateTime, formatReportStatus, formatReportType } from '../../utils/formatters';
import { getStatusColor } from '../../utils/helpers';
import { getLocationPath } from '../../utils/reportHelpers';
import { FileText, Edit2, Trash2, Eye, MapPin, User } from 'lucide-react';

const ReportTable = ({ reports, onView, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        <p className="text-gray-600 mt-4">Loading reports...</p>
      </div>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <div className="p-12 text-center">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No reports found</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200"></th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Title</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Reporter</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Type</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Location</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Created</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report, index) => (
              <tr 
                key={report.id} 
                className={`transition-all duration-200 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                } hover:bg-emerald-50/50 hover:shadow-sm`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {report.reporter ? (
                    <Avatar user={report.reporter} size="sm" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-gray-900">{report.title}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {report.reporter ? (
                    <span className="text-sm text-gray-700">
                      {report.reporter.fullName || report.reporter.username || 'Unknown'}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400 italic">—</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="info" pill className="shadow-sm">
                    {formatReportType(report.type || report.reportType)}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={getStatusColor(report.status)} pill className="shadow-sm">
                    {formatReportStatus(report.status)}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  {report.location ? (
                    <div className="flex items-center gap-1.5" title={getLocationPath(report.location)}>
                      <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-700 truncate max-w-xs">
                        {getLocationPath(report.location)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 italic">—</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">{formatDateTime(report.createdAt)}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {onView && (
                      <button
                        onClick={() => onView(report)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 hover:text-blue-800 rounded-lg transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed border border-blue-200"
                        title="View report"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(report)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-800 rounded-lg transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-200"
                        title="Edit report"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(report.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 hover:text-red-800 rounded-lg transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed border border-red-200"
                        title="Delete report"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportTable;
