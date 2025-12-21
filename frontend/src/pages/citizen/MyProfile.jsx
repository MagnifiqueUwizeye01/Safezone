import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileForm from '../../components/profile/ProfileForm';
import ProfileSettings from '../../components/profile/ProfileSettings';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Spinner from '../../components/common/Spinner';
import { useAuth } from '../../hooks/useAuth';
import userService from '../../api/services/userService';
import profileService from '../../api/services/profileService';
import locationService from '../../api/services/locationService';

const MyProfile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('profile'); // profile, settings
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Location hierarchy state
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [cells, setCells] = useState([]);
  const [villages, setVillages] = useState([]);
  
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedCell, setSelectedCell] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchProvinces();
      if (user.location) {
        loadLocationHierarchy(user.location);
      }
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      if (user?.id) {
        const profile = await profileService.getUserProfileByUserId(user.id);
        setProfileData(profile);
        
        // Update user context with profile data (but not in localStorage to avoid quota issues)
        // Profile picture will be available in user state for Avatar components
        if (profile) {
          const updatedUser = {
            ...user,
            profile: profile // Include profile in state, but updateUser will remove profilePictureUrl from localStorage
          };
          updateUser(updatedUser);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchProvinces = async () => {
    try {
      const data = await locationService.getAllProvinces();
      setProvinces(data);
    } catch (error) {
      console.error('Error fetching provinces:', error);
    }
  };

  const loadLocationHierarchy = async (location) => {
    if (location.parent) {
      // Load parent chain
    }
  };

  const fetchDistricts = async (provinceCode) => {
    try {
      const data = await locationService.getChildrenByParentCode(provinceCode);
      setDistricts(data);
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const fetchSectors = async (districtCode) => {
    try {
      const data = await locationService.getChildrenByParentCode(districtCode);
      setSectors(data);
    } catch (error) {
      console.error('Error fetching sectors:', error);
    }
  };

  const fetchCells = async (sectorCode) => {
    try {
      const data = await locationService.getChildrenByParentCode(sectorCode);
      setCells(data);
    } catch (error) {
      console.error('Error fetching cells:', error);
    }
  };

  const fetchVillages = async (cellCode) => {
    try {
      const data = await locationService.getChildrenByParentCode(cellCode);
      setVillages(data);
    } catch (error) {
      console.error('Error fetching villages:', error);
    }
  };

  const handleProvinceChange = (e) => {
    const provinceCode = e.target.value;
    setSelectedProvince(provinceCode);
    setSelectedDistrict('');
    setSelectedSector('');
    setSelectedCell('');
    setSelectedVillage('');
    setDistricts([]);
    setSectors([]);
    setCells([]);
    setVillages([]);
    if (provinceCode) {
      fetchDistricts(provinceCode);
    }
  };

  const handleDistrictChange = (e) => {
    const districtCode = e.target.value;
    setSelectedDistrict(districtCode);
    setSelectedSector('');
    setSelectedCell('');
    setSelectedVillage('');
    setSectors([]);
    setCells([]);
    setVillages([]);
    if (districtCode) {
      fetchSectors(districtCode);
    }
  };

  const handleSectorChange = (e) => {
    const sectorCode = e.target.value;
    setSelectedSector(sectorCode);
    setSelectedCell('');
    setSelectedVillage('');
    setCells([]);
    setVillages([]);
    if (sectorCode) {
      fetchCells(sectorCode);
    }
  };

  const handleCellChange = (e) => {
    const cellCode = e.target.value;
    setSelectedCell(cellCode);
    setSelectedVillage('');
    setVillages([]);
    if (cellCode) {
      fetchVillages(cellCode);
    }
  };

  const handleVillageChange = (e) => {
    setSelectedVillage(e.target.value);
  };

  const handleProfileUpdate = async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const updateData = {
        ...formData,
        locationId: selectedVillage || user.locationId,
      };

      await userService.updateUser(user.id, updateData);
      
      // Update profile if exists
      if (profileData?.id) {
        await profileService.updateUserProfile(profileData.id, formData);
      } else if (formData.bio || formData.dateOfBirth) {
        // Create profile if doesn't exist
        await profileService.createUserProfile({
          userId: user.id,
          ...formData,
        });
      }

      // Refresh user data
      const updatedUser = await userService.getUserById(user.id);
      updateUser(updatedUser);
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (passwordData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await userService.updateUser(user.id, {
        password: passwordData.newPassword,
      });
      setSuccess('Password updated successfully!');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesUpdate = async (preferences) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const profileUpdate = {
        notificationPreferences: JSON.stringify(preferences),
      };
      
      if (profileData?.id) {
        await profileService.updateUserProfile(profileData.id, profileUpdate);
      } else {
        await profileService.createUserProfile({
          userId: user.id,
          ...profileUpdate,
        });
      }
      
      setSuccess('Preferences updated successfully!');
      fetchProfile();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureUpdate = async (base64Image, mimeType) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Updating profile picture...', { hasProfileData: !!profileData, userId: user?.id });
      
      // Update profile with profile picture
      if (profileData?.id) {
        // Update existing profile - preserve existing data and update picture
        const updateData = {
          id: profileData.id,
          bio: profileData.bio || null,
          dateOfBirth: profileData.dateOfBirth || null,
          profilePictureUrl: base64Image,
          preferredLanguage: profileData.preferredLanguage || null,
          notificationPreferences: profileData.notificationPreferences || null,
          user: { id: user.id, username: user.username, email: user.email } // Include user reference for backend
        };
        
        console.log('Updating existing profile:', updateData);
        const response = await profileService.updateUserProfile(profileData.id, updateData);
        console.log('Profile update response:', response);
        
        // Backend returns a string message, so fetch the updated profile
        await fetchProfile(); // Refresh profile data
      } else if (user?.id) {
        // Create new profile with picture
        const newProfileData = {
          profilePictureUrl: base64Image,
          user: { id: user.id, username: user.username, email: user.email } // Include user reference for backend
        };
        
        console.log('Creating new profile:', newProfileData);
        await profileService.createUserProfile(newProfileData);
        
        // Fetch the newly created profile
        await fetchProfile(); // Refresh profile data
      }

      // Update user in context WITHOUT storing the base64 image in localStorage
      // The profile picture is stored in the backend and fetched when needed
      // Storing base64 images in localStorage causes quota exceeded errors
      // We update the user state with profile data reference, but not the actual image
      const updatedUser = {
        ...user,
        profile: profileData ? {
          ...profileData,
          // Don't include profilePictureUrl in localStorage - it's too large
          // The profile picture will be fetched from backend when needed
          profilePictureUrl: undefined
        } : undefined
      };
      updateUser(updatedUser);
      
      setSuccess('Profile picture updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error updating profile picture:', error);
      console.error('Error details:', error.response?.data);
      const errorMessage = error.response?.data?.message || 
                          (typeof error.response?.data === 'string' ? error.response?.data : null) ||
                          error.message || 
                          'Failed to update profile picture. Please try again.';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="loading-container">
          <Spinner size="lg" />
        </div>
      </Layout>
    );
  }

  const initialFormData = {
    fullName: user.fullName || '',
    phone: user.phone || '',
    bio: profileData?.bio || '',
    dateOfBirth: profileData?.dateOfBirth || '',
    preferredLanguage: profileData?.preferredLanguage || '',
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-600 mt-1">Manage your profile information and settings</p>
        </div>

        {error && (
          <Alert type="danger" message={error} dismissible onClose={() => setError(null)} />
        )}
        {success && (
          <Alert type="success" message={success} dismissible onClose={() => setSuccess(null)} />
        )}

        <div className="flex gap-2 mb-6 border-b border-slate-200">
          <button
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === 'profile'
                ? 'text-emerald-700 border-b-2 border-emerald-700 bg-emerald-50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === 'settings'
                ? 'text-emerald-700 border-b-2 border-emerald-700 bg-emerald-50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <ProfileHeader 
              user={user} 
              onEdit={() => setIsEditing(!isEditing)}
              onProfilePictureUpdate={handleProfilePictureUpdate}
            />

            {isEditing ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">Edit Profile</h2>
                <ProfileForm
                  initialData={initialFormData}
                  onSubmit={handleProfileUpdate}
                  onCancel={() => setIsEditing(false)}
                  loading={loading}
                />

                {/* Location Selection */}
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Update Location</h3>
                  <p className="text-sm text-slate-600 mb-4">Select your location: Province → District → Sector → Cell → Village</p>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Province</label>
                    <select
                      value={selectedProvince}
                      onChange={handleProvinceChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="">Select Province</option>
                      {provinces.map((p) => (
                        <option key={p.code} value={p.code}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedProvince && districts.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 mb-2">District</label>
                      <select
                        value={selectedDistrict}
                        onChange={handleDistrictChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="">Select District</option>
                        {districts.map((d) => (
                          <option key={d.code} value={d.code}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedDistrict && sectors.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Sector</label>
                      <select
                        value={selectedSector}
                        onChange={handleSectorChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="">Select Sector</option>
                        {sectors.map((s) => (
                          <option key={s.code} value={s.code}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedSector && cells.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Cell</label>
                      <select
                        value={selectedCell}
                        onChange={handleCellChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="">Select Cell</option>
                        {cells.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedCell && villages.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Village</label>
                      <select
                        value={selectedVillage}
                        onChange={handleVillageChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="">Select Village</option>
                        {villages.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-6 space-y-6">
                {/* Personal Information Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-500">Full Name</label>
                      <p className="text-slate-900">{user.fullName || 'Not set'}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-500">Email</label>
                      <p className="text-slate-900">{user.email}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-500">Phone</label>
                      <p className="text-slate-900">{user.phone || 'Not set'}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-500">Location</label>
                      <p className="text-slate-900">{user.location?.name || 'Not set'}</p>
                    </div>
                  </div>
                </div>

                {/* Additional Details Card */}
                {profileData && (profileData.bio || profileData.dateOfBirth || profileData.preferredLanguage) && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Additional Details</h3>
                    <div className="space-y-4">
                      {profileData.bio && (
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-slate-500">Bio</label>
                          <p className="text-slate-900 leading-relaxed">{profileData.bio}</p>
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profileData.dateOfBirth && (
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-500">Date of Birth</label>
                            <p className="text-slate-900">
                              {new Date(profileData.dateOfBirth).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        )}
                        {profileData.preferredLanguage && (
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-500">Preferred Language</label>
                            <p className="text-slate-900">{profileData.preferredLanguage}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-content">
            <ProfileSettings
              user={user}
              onUpdatePassword={handlePasswordUpdate}
              onUpdatePreferences={handlePreferencesUpdate}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyProfile;

