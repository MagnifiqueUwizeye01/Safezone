import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Avatar from '../common/Avatar';
import { formatUserRole } from '../../utils/formatters';
import { getRoleColor } from '../../utils/helpers';

const UserCard = ({ user, onClick }) => {
  return (
    <Card
      title={user.fullName || user.username}
      subtitle={user.email}
      onClick={onClick}
      className="user-card"
    >
      <div className="user-card-content">
        <div className="flex items-center gap-3 mb-3">
          <Avatar user={user} size="md" />
          <div className="flex-1">
            <Badge variant={getRoleColor(user.role)} pill>
              {formatUserRole(user.role)}
            </Badge>
          </div>
        </div>
        <div className="user-meta">
          {user.phone && <span className="user-phone">📞 {user.phone}</span>}
          {user.location && (
            <span className="user-location">📍 {user.location.name}</span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default UserCard;

