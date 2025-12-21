import React from 'react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Avatar from '../common/Avatar';
import { formatUserRole } from '../../utils/formatters';
import { getRoleColor } from '../../utils/helpers';
import { formatDate } from '../../utils/formatters';
import { Edit2, Trash2, Eye, User } from 'lucide-react';

const UserTable = ({ users, onView, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        <p className="text-gray-600 mt-4">Loading users...</p>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="p-12 text-center">
        <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No users found</p>
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
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Username</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Full Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Email</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Role</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Badge/Station</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Location</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Created</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user, index) => (
              <tr 
                key={user.id} 
                className={`transition-all duration-200 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                } hover:bg-emerald-50/50 hover:shadow-sm`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <Avatar user={user} size="sm" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-gray-900">{user.username}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-700">{user.fullName || <span className="text-gray-400 italic">—</span>}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-700">{user.email}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={getRoleColor(user.role)} pill className="shadow-sm">
                    {formatUserRole(user.role)}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.role === 'POLICE' ? (
                    <div className="text-sm space-y-1">
                      {user.badgeNumber && (
                        <div className="font-medium text-gray-900">Badge: {user.badgeNumber}</div>
                      )}
                      {user.policeStation && (
                        <div className="text-gray-600 text-xs">{user.policeStation}</div>
                      )}
                      {!user.badgeNumber && !user.policeStation && (
                        <span className="text-gray-400 italic">—</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">—</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-700">{user.location?.name || <span className="text-gray-400 italic">—</span>}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">{formatDate(user.createdAt)}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {onView && (
                      <button
                        onClick={() => onView(user)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 hover:text-blue-800 rounded-lg transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed border border-blue-200"
                        title="View user"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(user)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-800 rounded-lg transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-200"
                        title="Edit user"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(user.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 hover:text-red-800 rounded-lg transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed border border-red-200"
                        title="Delete user"
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

export default UserTable;
