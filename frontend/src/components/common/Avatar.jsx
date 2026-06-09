import React from 'react';
import { getInitials } from '../../utils/helpers';

const Avatar = ({ 
  user, 
  src, 
  size = 'md', 
  className = '',
  showBorder = false 
}) => {
  // Get profile picture URL from user object
  const profilePictureUrl = src || user?.profile?.profilePictureUrl || user?.profilePictureUrl;
  
  // Get user initials
  const initials = getInitials(user?.fullName || user?.username || 'U');
  
  // Size classes
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-32 h-32 text-3xl',
  };
  
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const borderClass = showBorder ? 'border-2 border-white shadow-md' : '';
  
  return (
    <div className={`${sizeClass} ${borderClass} rounded-full overflow-hidden flex-shrink-0 ${className}`}>
      {profilePictureUrl ? (
        <img
          src={profilePictureUrl}
          alt={user?.fullName || user?.username || 'User'}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold">
          {initials}
        </div>
      )}
    </div>
  );
};

export default Avatar;

