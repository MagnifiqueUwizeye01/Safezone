import React from 'react';
import Avatar from '../common/Avatar';
import { formatDateTime, formatReportStatus, formatReportType } from '../../utils/formatters';
import { getStatusColor } from '../../utils/helpers';
import { getLocationPath } from '../../utils/reportHelpers';
import { 
  FileText, 
  Calendar, 
  MapPin, 
  User, 
  Tag, 
  AlertCircle, 
  Edit2, 
  Trash2, 
  X,
  Clock
} from 'lucide-react';

const ReportDetails = ({ report, onEdit, onDelete, onClose }) => {
  if (!report) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Report not found</p>
      </div>
    );
  }

  const getStatusBadgeClasses = (status) => {
    const statusColors = {
      PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
      IN_PROGRESS: 'bg-blue-100 text-blue-700 border-blue-200',
      RESOLVED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      CANCELLED: 'bg-red-100 text-red-700 border-red-200',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getTypeBadgeClasses = () => {
    return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-600" />
            Report Details
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-5 overflow-y-auto flex-1">
        {/* Title */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <FileText className="w-4 h-4 text-emerald-600" />
            Title
          </label>
          <p className="text-base text-gray-900 font-medium pl-6">{report.title}</p>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <FileText className="w-4 h-4 text-emerald-600" />
            Description
          </label>
          <p className="text-base text-gray-700 pl-6 leading-relaxed">{report.description}</p>
        </div>

        {/* Type and Status Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Tag className="w-4 h-4 text-emerald-600" />
              Type
            </label>
            <div className="pl-6">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border ${getTypeBadgeClasses()}`}>
                {formatReportType(report.type || report.reportType)}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <AlertCircle className="w-4 h-4 text-emerald-600" />
              Status
            </label>
            <div className="pl-6">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border ${getStatusBadgeClasses(report.status)}`}>
                {formatReportStatus(report.status)}
              </span>
            </div>
          </div>
        </div>

        {/* Location */}
        {report.location && (
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <MapPin className="w-4 h-4 text-emerald-600" />
              Location
            </label>
            <p className="text-base text-gray-700 pl-6 flex items-center gap-2">
              <span>{getLocationPath(report.location)}</span>
            </p>
          </div>
        )}

        {/* Reporter */}
        {report.reporter && (
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <User className="w-4 h-4 text-emerald-600" />
              Reporter
            </label>
            <div className="pl-6 flex items-center gap-3">
              <Avatar user={report.reporter} size="md" />
              <span className="text-base text-gray-900 font-medium">
                {report.reporter.username || report.reporter.fullName || 'Unknown'}
              </span>
            </div>
          </div>
        )}

        {/* Dates Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-gray-200">
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Calendar className="w-4 h-4 text-emerald-600" />
              Created
            </label>
            <p className="text-base text-gray-700 pl-6">{formatDateTime(report.createdAt)}</p>
          </div>

          {report.updatedAt && (
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Clock className="w-4 h-4 text-emerald-600" />
                Last Updated
              </label>
              <p className="text-base text-gray-700 pl-6">{formatDateTime(report.updatedAt)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 flex-shrink-0">
        {onEdit && (
          <button
            onClick={() => onEdit(report)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 shadow-sm shadow-emerald-600/30"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(report.id)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 shadow-sm shadow-red-600/30"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
          >
            <X className="w-4 h-4" />
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default ReportDetails;

