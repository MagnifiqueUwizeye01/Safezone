import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { formatDateTime, formatReportStatus, formatReportType } from '../../utils/formatters';
import { getStatusColor } from '../../utils/helpers';
import { getLocationPath } from '../../utils/reportHelpers';

const ReportCard = ({ report, onClick }) => {
  return (
    <Card
      title={report.title}
      subtitle={formatDateTime(report.createdAt)}
      onClick={onClick}
      className="report-card"
    >
      <div className="report-card-content">
        <p className="report-description">{report.description}</p>
        <div className="report-meta">
          <Badge variant={getStatusColor(report.status)} pill>
            {formatReportStatus(report.status)}
          </Badge>
          <Badge variant="info" pill>
            {formatReportType(report.type || report.reportType)}
          </Badge>
          {report.location && (
            <span className="report-location">📍 {getLocationPath(report.location)}</span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ReportCard;

