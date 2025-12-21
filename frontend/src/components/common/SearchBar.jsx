import React from 'react';

const SearchBar = ({
  value,
  onChange,
  placeholder = 'Search...',
  onClear,
  className = '',
  ...props
}) => {
  return (
    <div className={`search-bar ${className}`}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="search-input"
        {...props}
      />
      {value && onClear && (
        <button className="search-clear" onClick={onClear}>
          ×
        </button>
      )}
    </div>
  );
};

export default SearchBar;

