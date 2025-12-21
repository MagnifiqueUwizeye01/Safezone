import { useState, useMemo } from 'react';

const searchInObject = (obj, term) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      
      if (value === null || value === undefined || typeof value === 'function') {
        continue;
      }
      
      if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        if (searchInObject(value, term)) {
          return true;
        }
      }
      else if (typeof value === 'string') {
        if (value.toLowerCase().includes(term)) {
          return true;
        }
      }
      else if (typeof value === 'number') {
        if (value.toString().includes(term)) {
          return true;
        }
      }
      else if (value instanceof Date) {
        if (value.toLocaleString().toLowerCase().includes(term)) {
          return true;
        }
      }
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
      if (searchFields.length > 0) {
        return searchFields.some((field) => {
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
