import React from 'react';
import { Search, UserCircle } from 'lucide-react';
import { USER_ROLES } from '../../utils/constants';

const UserFilter = ({ filters, onFilterChange }) => {
  const roleOptions = Object.values(USER_ROLES).map((role) => ({
    value: role,
    label: role.replace('_', ' '),
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Search Input */}
      <div className="space-y-2">
        <label htmlFor="search" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Search className="w-4 h-4 text-emerald-600" />
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="search"
            type="text"
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white hover:border-gray-400"
          />
        </div>
      </div>

      {/* Role Select */}
      <div className="space-y-2">
        <label htmlFor="role" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <UserCircle className="w-4 h-4 text-emerald-600" />
          Role
        </label>
        <select
          id="role"
          value={filters.role || ''}
          onChange={(e) => onFilterChange({ role: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white hover:border-gray-400 appearance-none cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
            paddingRight: '2.5rem',
          }}
        >
          <option value="">All Roles</option>
          {roleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default UserFilter;

