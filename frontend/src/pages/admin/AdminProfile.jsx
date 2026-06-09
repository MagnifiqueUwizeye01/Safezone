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

const AdminProfile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
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
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      if (user?.id) {
        const profile = await profileService.getUserProfileByUserId(user.id);
        setProfileData(profile);
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
      
      if (profileData?.id) {
        await profileService.updateUserProfile(profileData.id, formData);
      } else if (formData.bio || formData.dateOfBirth) {
        await profileService.createUserProfile({
          userId: user.id,
          ...formData,
        });
      }

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
      <div className="admin-profile-page">
        <div className="page-header">
          <h1>My Profile</h1>
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
          <div className="profile-content">
            <ProfileHeader user={user} onEdit={() => setIsEditing(!isEditing)} />

            {isEditing ? (
              <div className="profile-edit-section">
                <h2>Edit Profile</h2>
                <ProfileForm
                  initialData={initialFormData}
                  onSubmit={handleProfileUpdate}
                  onCancel={() => setIsEditing(false)}
                  loading={loading}
                />

                <div className="location-selection">
                  <h3>Update Location</h3>
                  <p className="location-hint">Select your location: Province → District → Sector → Cell → Village</p>
                  
                  <div className="form-group">
                    <label>Province</label>
                    <select value={selectedProvince} onChange={handleProvinceChange} className="form-control">
                      <option value="">Select Province</option>
                      {provinces.map((p) => (
                        <option key={p.code} value={p.code}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  {selectedProvince && districts.length > 0 && (
                    <div className="form-group">
                      <label>District</label>
                      <select value={selectedDistrict} onChange={handleDistrictChange} className="form-control">
                        <option value="">Select District</option>
                        {districts.map((d) => (
                          <option key={d.code} value={d.code}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedDistrict && sectors.length > 0 && (
                    <div className="form-group">
                      <label>Sector</label>
                      <select value={selectedSector} onChange={handleSectorChange} className="form-control">
                        <option value="">Select Sector</option>
                        {sectors.map((s) => (
                          <option key={s.code} value={s.code}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedSector && cells.length > 0 && (
                    <div className="form-group">
                      <label>Cell</label>
                      <select value={selectedCell} onChange={handleCellChange} className="form-control">
                        <option value="">Select Cell</option>
                        {cells.map((c) => (
                          <option key={c.code} value={c.code}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedCell && villages.length > 0 && (
                    <div className="form-group">
                      <label>Village</label>
                      <select value={selectedVillage} onChange={handleVillageChange} className="form-control">
                        <option value="">Select Village</option>
                        {villages.map((v) => (
                          <option key={v.id} value={v.id}>{v.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="profile-view-section">
                <div className="profile-details">
                  <div className="detail-item">
                    <label>Full Name:</label>
                    <span>{user.fullName || 'Not set'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{user.email}</span>
                  </div>
                  <div className="detail-item">
                    <label>Phone:</label>
                    <span>{user.phone || 'Not set'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Location:</label>
                    <span>{user.location?.name || 'Not set'}</span>
                  </div>
                  {profileData && (
                    <>
                      <div className="detail-item">
                        <label>Bio:</label>
                        <span>{profileData.bio || 'Not set'}</span>
                      </div>
                      <div className="detail-item">
                        <label>Date of Birth:</label>
                        <span>{profileData.dateOfBirth || 'Not set'}</span>
                      </div>
                    </>
                  )}
                </div>
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

export default AdminProfile;

