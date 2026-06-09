import React, { useState, useRef } from 'react';
import { Camera, MapPin, Mail, Phone, Calendar, Globe, Edit2, X, Check } from 'lucide-react';
import { formatUserRole } from '../../utils/formatters';
import { getInitials } from '../../utils/helpers';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import Alert from '../common/Alert';

const ProfileHeader = ({ user, onEdit, onProfilePictureUpdate }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  if (!user) return null;

  const profilePictureUrl = user.profile?.profilePictureUrl || user.profilePictureUrl;
  const displayUrl = previewUrl || profilePictureUrl;

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    // Validate file size (max 2MB for base64 - we'll compress it)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size must be less than 5MB');
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      // Compress and resize image before converting to base64
      const compressedFile = await compressImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(compressedFile);

      // Convert compressed image to base64
      const base64 = await fileToBase64(compressedFile);
      
      if (onProfilePictureUpdate) {
        await onProfilePictureUpdate(base64, compressedFile.type);
        setPreviewUrl(null); // Clear preview after successful upload
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      setUploadError('Failed to upload profile picture. Please try again.');
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() }));
              } else {
                reject(new Error('Canvas to blob conversion failed'));
              }
            },
            'image/jpeg',
            0.8 // Quality: 0.8 (80%)
          );
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Cover Section */}
      <div className="h-32 bg-gradient-to-r from-emerald-500 to-emerald-600 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20"></div>
      </div>

      {/* Profile Content */}
      <div className="px-6 pb-6 -mt-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          {/* Profile Picture and Basic Info */}
          <div className="flex flex-col md:flex-row items-center md:items-end gap-4">
            {/* Profile Picture */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden">
                {displayUrl ? (
                  <img
                    src={displayUrl}
                    alt={user.fullName || user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Avatar user={user} size="2xl" className="w-full h-full" />
                )}
              </div>
              
              {/* Upload Overlay */}
              <div
                onClick={handleImageClick}
                className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center"
              >
                <Camera className="w-6 h-6 text-white" />
              </div>

              {/* Upload Indicator */}
              {isUploading && (
                <div className="absolute inset-0 rounded-full bg-black/70 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* User Info */}
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-slate-900 mb-1">
                {user.fullName || user.username}
              </h1>
              <p className="text-slate-600 mb-3 flex items-center justify-center md:justify-start gap-1">
                <Mail className="w-4 h-4" />
                {user.email}
              </p>
              <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700">
                  {formatUserRole(user.role)}
                </span>
                {user.location && (
                  <span className="inline-flex items-center gap-1 text-sm text-slate-600">
                    <MapPin className="w-4 h-4" />
                    {user.location.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Button */}
          {onEdit && (
            <div className="flex justify-center md:justify-end">
              <Button
                variant="primary"
                onClick={onEdit}
                className="flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </Button>
            </div>
          )}
        </div>

        {/* Error Message */}
        {uploadError && (
          <div className="mt-4">
            <Alert type="danger" message={uploadError} dismissible onClose={() => setUploadError(null)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
