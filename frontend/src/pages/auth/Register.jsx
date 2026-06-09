import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { validateForm } from '../../utils/validation';
import { USER_ROLES } from '../../utils/constants';
import locationService from '../../api/services/locationService';

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'CITIZEN',
    locationId: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
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
    // SECURITY: Do NOT auto-redirect authenticated users
    fetchProvinces();
  }, []);

  const [loadingLocations, setLoadingLocations] = useState({
    provinces: false,
    districts: false,
    sectors: false,
    cells: false,
    villages: false,
  });

  const fetchProvinces = async () => {
    try {
      setLoadingLocations(prev => ({ ...prev, provinces: true }));
      const data = await locationService.getAllProvinces();
      console.log('Provinces data received:', data);
      if (Array.isArray(data)) {
        setProvinces(data);
        if (data.length === 0) {
          console.warn('No provinces found. Make sure the backend has location data.');
        }
      } else {
        console.error('Invalid provinces data format:', data);
        setProvinces([]);
        setError('Invalid data format received from server. Expected an array.');
      }
    } catch (error) {
      console.error('Error fetching provinces:', error);
      console.error('Error details:', error.response?.data || error.message);
      setProvinces([]);
      const errorMessage = error.response?.status === 404 
        ? 'Backend API not found. Is the backend running?'
        : error.response?.status 
          ? `Server error (${error.response.status}). Check backend connection.`
          : 'Failed to load provinces. Please check your connection and ensure the backend is running.';
      setError(errorMessage);
    } finally {
      setLoadingLocations(prev => ({ ...prev, provinces: false }));
    }
  };

  const fetchDistricts = async (provinceCode) => {
    if (!provinceCode) return;
    try {
      setLoadingLocations(prev => ({ ...prev, districts: true }));
      const data = await locationService.getChildrenByParentCode(provinceCode);
      if (Array.isArray(data)) {
        // Filter to only show DISTRICTs
        setDistricts(data.filter(loc => loc.type === 'DISTRICT'));
      } else {
        setDistricts([]);
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
      setDistricts([]);
      setError('Failed to load districts. Please try selecting the province again.');
    } finally {
      setLoadingLocations(prev => ({ ...prev, districts: false }));
    }
  };

  const fetchSectors = async (districtCode) => {
    if (!districtCode) return;
    try {
      setLoadingLocations(prev => ({ ...prev, sectors: true }));
      const data = await locationService.getChildrenByParentCode(districtCode);
      if (Array.isArray(data)) {
        // Filter to only show SECTORs
        setSectors(data.filter(loc => loc.type === 'SECTOR'));
      } else {
        setSectors([]);
      }
    } catch (error) {
      console.error('Error fetching sectors:', error);
      setSectors([]);
      setError('Failed to load sectors. Please try selecting the district again.');
    } finally {
      setLoadingLocations(prev => ({ ...prev, sectors: false }));
    }
  };

  const fetchCells = async (sectorCode) => {
    if (!sectorCode) return;
    try {
      setLoadingLocations(prev => ({ ...prev, cells: true }));
      const data = await locationService.getChildrenByParentCode(sectorCode);
      if (Array.isArray(data)) {
        setCells(data.filter(loc => loc.type === 'CELL'));
      } else {
        setCells([]);
      }
    } catch (error) {
      console.error('Error fetching cells:', error);
      setCells([]);
      setError('Failed to load cells. Please try selecting the sector again.');
    } finally {
      setLoadingLocations(prev => ({ ...prev, cells: false }));
    }
  };

  const fetchVillages = async (cellCode) => {
    if (!cellCode) return;
    try {
      setLoadingLocations(prev => ({ ...prev, villages: true }));
      const data = await locationService.getChildrenByParentCode(cellCode);
      if (Array.isArray(data)) {
        // Filter to only show VILLAGEs
        setVillages(data.filter(loc => loc.type === 'VILLAGE'));
      } else {
        setVillages([]);
      }
    } catch (error) {
      console.error('Error fetching villages:', error);
      setVillages([]);
      setError('Failed to load villages. Please try selecting the cell again.');
    } finally {
      setLoadingLocations(prev => ({ ...prev, villages: false }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    setError(null);
  };

  const handleProvinceChange = (e) => {
    const provinceCode = e.target.value;
    setSelectedProvince(provinceCode);
    setSelectedDistrict('');
    setSelectedSector('');
    setSelectedCell('');
    setSelectedVillage('');
    setFormData((prev) => ({ ...prev, locationId: '' }));
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
    setFormData((prev) => ({ ...prev, locationId: '' }));
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
    setFormData((prev) => ({ ...prev, locationId: '' }));
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
    setFormData((prev) => ({ ...prev, locationId: '' }));
    setVillages([]);
    if (cellCode) {
      fetchVillages(cellCode);
    }
  };

  const handleVillageChange = (e) => {
    const villageId = e.target.value;
    setSelectedVillage(villageId);
    setFormData((prev) => ({ ...prev, locationId: villageId }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setErrors({});

    // Custom validation for password match
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    // Validate location is selected
    if (!formData.locationId) {
      setErrors({ locationId: 'Please select a complete location (Province → District → Sector → Cell → Village)' });
      return;
    }

    const rules = {
      username: {
        required: true,
        username: true,
        minLength: 3,
        maxLength: 20,
      },
      email: {
        required: true,
        email: true,
      },
      password: {
        required: true,
        password: true,
        minLength: 8,
      },
      confirmPassword: {
        required: true,
      },
      role: {
        required: true,
      },
    };

    const validation = validateForm(formData, rules);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Admin cannot register
    if (formData.role === 'ADMIN') {
      setError('Admin accounts cannot be created through registration. Please contact system administrator.');
      return;
    }

    setLoading(true);
    
    try {
      // Fetch the location object by ID
      const location = await locationService.getLocationById(formData.locationId);
      console.log('Location fetched:', location);

      // Prepare registration data with location object
      const { confirmPassword, ...registerData } = formData;
      const registrationPayload = {
        ...registerData,
        location: location, // Backend expects a Location object, not just locationId
      };

      console.log('Registration payload:', registrationPayload);
      
      const result = await register(registrationPayload);
      console.log('Registration result:', result);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const errorMessage = result.error || result.data || 'Registration failed. Please try again.';
        setError(errorMessage);
        console.error('Registration failed:', errorMessage);
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data || 
                          error.message || 
                          'Registration failed. Please check your connection and try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Only allow CITIZEN role in public registration
  // POLICE and ADMIN must be created by administrators
  const roleOptions = [
    {
      value: 'CITIZEN',
      label: 'Citizen',
    }
  ];

  const provinceOptions = provinces
    .filter(p => p && p.code && p.name)
    .map((p) => ({
      value: p.code,
      label: p.name,
    }));

  const districtOptions = districts
    .filter(d => d && d.code && d.name)
    .map((d) => ({
      value: d.code,
      label: d.name,
    }));

  const sectorOptions = sectors
    .filter(s => s && s.code && s.name)
    .map((s) => ({
      value: s.code,
      label: s.name,
    }));

  const cellOptions = cells
    .filter(c => c && c.code && c.name)
    .map((c) => ({
      value: c.code,
      label: c.name,
    }));

  const villageOptions = villages
    .filter(v => v && v.id && v.name)
    .map((v) => ({
      value: v.id,
      label: v.name,
    }));

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
            <Alert type="success" message="Registration successful! Redirecting to login..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Create Account</h1>
          <p className="text-lg text-slate-600">Join SafeZone to make your community safer</p>
        </div>

        {error && <Alert type="danger" message={error} dismissible onClose={() => setError(null)} />}

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              required
              placeholder="Choose a username"
            />

            <Input
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              placeholder="Enter your full name"
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              placeholder="Enter your email"
            />

            <Input
              label="Phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="Enter your phone number"
            />

            <Select
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              options={roleOptions}
              error={errors.role}
              required
            />

            {/* Hierarchical Location Selection */}
            <div className="space-y-4 pt-6 border-t border-slate-200">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">Select Your Location</h3>
                <p className="text-sm text-slate-600">Please select your location in order: <span className="font-medium">Province → District → Sector → Cell → Village</span></p>
              </div>
              
              <Select
                label="Province *"
                name="province"
                value={selectedProvince}
                onChange={handleProvinceChange}
                options={provinceOptions}
                placeholder={
                  loadingLocations.provinces 
                    ? 'Loading provinces...' 
                    : provinceOptions.length === 0 
                      ? 'No provinces found - Ensure backend is running and database has location data' 
                      : 'Select Province (e.g., Kigali)'
                }
                required
                disabled={loadingLocations.provinces}
              />
              {provinceOptions.length === 0 && !loadingLocations.provinces && (
                <p className="text-sm text-amber-600 mt-1">
                  ⚠️ No provinces loaded. Please ensure:
                  <br />• Backend is running on http://localhost:8080
                  <br />• Database has location data (use admin panel to add provinces)
                </p>
              )}

              {selectedProvince && (
                <Select
                  label="District *"
                  name="district"
                  value={selectedDistrict}
                  onChange={handleDistrictChange}
                  options={districtOptions}
                  placeholder={loadingLocations.districts ? 'Loading districts...' : districtOptions.length === 0 ? 'No districts available' : 'Select District'}
                  required
                  disabled={loadingLocations.districts}
                />
              )}

              {selectedDistrict && (
                <Select
                  label="Sector *"
                  name="sector"
                  value={selectedSector}
                  onChange={handleSectorChange}
                  options={sectorOptions}
                  placeholder={loadingLocations.sectors ? 'Loading sectors...' : sectorOptions.length === 0 ? 'No sectors available' : 'Select Sector'}
                  required
                  disabled={loadingLocations.sectors}
                />
              )}

              {selectedSector && (
                <Select
                  label="Cell *"
                  name="cell"
                  value={selectedCell}
                  onChange={handleCellChange}
                  options={cellOptions}
                  placeholder={loadingLocations.cells ? 'Loading cells...' : cellOptions.length === 0 ? 'No cells available' : 'Select Cell'}
                  required
                  disabled={loadingLocations.cells}
                />
              )}

              {selectedCell && (
                <Select
                  label="Village *"
                  name="village"
                  value={selectedVillage}
                  onChange={handleVillageChange}
                  options={villageOptions}
                  placeholder={loadingLocations.villages ? 'Loading villages...' : villageOptions.length === 0 ? 'No villages available' : 'Select Village'}
                  error={errors.locationId}
                  required
                  disabled={loadingLocations.villages}
                />
              )}
              
              {errors.locationId && (
                <p className="text-sm text-red-600 mt-1">{errors.locationId}</p>
              )}
            </div>

            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              showPasswordToggle={true}
              placeholder="Create a password (min 8 characters)"
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
              showPasswordToggle={true}
              placeholder="Confirm your password"
            />

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-700">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
