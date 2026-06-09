import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchContext = createContext();

export const useGlobalSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useGlobalSearch must be used within SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleGlobalSearch = (term) => {
    setSearchTerm(term);
    if (term && term.trim().length > 0) {
      navigate(`/search?q=${encodeURIComponent(term.trim())}`);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        handleGlobalSearch,
        clearSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

