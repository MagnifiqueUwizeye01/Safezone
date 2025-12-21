import React, { createContext, useContext, useState, useEffect } from 'react';
import locationService from '../api/services/locationService';

const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
  const [locations, setLocations] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    try {
      setLoading(true);
      const data = await locationService.getAllProvinces();
      setProvinces(data);
    } catch (error) {
      console.error('Error fetching provinces:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const data = await locationService.getAllLocations();
      setLocations(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getChildrenByParent = async (parentCode) => {
    try {
      const data = await locationService.getChildrenByParentCode(parentCode);
      return data;
    } catch (error) {
      console.error('Error fetching children locations:', error);
      return [];
    }
  };

  const value = {
    locations,
    provinces,
    loading,
    fetchLocations,
    fetchProvinces,
    getChildrenByParent,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export default LocationContext;

