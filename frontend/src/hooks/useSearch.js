import { useState, useMemo } from 'react';

// Helper function to recursively search through object values
const searchInObject = (obj, term) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      
      // Skip null, undefined, and functions
      if (value === null || value === undefined || typeof value === 'function') {
        continue;
      }
      
      // If it's an object (but not an array or Date), search recursively
      if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        if (searchInObject(value, term)) {
          return true;
        }
      }
      // If it's a string, check if it contains the term
      else if (typeof value === 'string') {
        if (value.toLowerCase().includes(term)) {
          return true;
        }
      }
      // If it's a number, convert to string and check
      else if (typeof value === 'number') {
        if (value.toString().includes(term)) {
          return true;
        }
      }
      // If it's a Date, convert to string and check
      else if (value instanceof Date) {
        if (value.toLocaleString().toLowerCase().includes(term)) {
          return true;
        }
      }
      // If it's an array, search each element
      else if (Array.isArray(value)) {
        if (value.some(item => searchInObject(item, term))) {
          return true;
        }
      }
    }
  }
  return false;
};

export const useSearch = (data, searchFields = []) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm || !data || data.length === 0) {
      return data;
    }

    const term = searchTerm.toLowerCase().trim();
    if (!term) return data;

    return data.filter((item) => {
      // If specific fields are provided, search only those fields
      if (searchFields.length > 0) {
        return searchFields.some((field) => {
          // Handle nested fields like 'location.name'
          const fieldParts = field.split('.');
          let value = item;
          
          for (const part of fieldParts) {
            if (value && typeof value === 'object') {
              value = value[part];
            } else {
              value = null;
              break;
            }
          }
          
          if (value === null || value === undefined) return false;
          
          if (typeof value === 'string') {
            return value.toLowerCase().includes(term);
          }
          if (typeof value === 'number') {
            return value.toString().includes(term);
          }
          if (value instanceof Date) {
            return value.toLocaleString().toLowerCase().includes(term);
          }
          return false;
        });
      }

      // If no specific fields, search ALL columns (all values in the object)
      return searchInObject(item, term);
    });
  }, [data, searchTerm, searchFields]);

  return {
    searchTerm,
    setSearchTerm,
    filteredData,
  };
};

export default useSearch;
