import React from 'react';

const SearchComponent = ({ search, size, handleSearchChange, handleSizeChange }) => {
  return (
    <div className="filter-container">
      <input
        className="search-input"
        type="text"
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
        placeholder="Suche nach Vorname oder E-Mail..."
      />

      <select
        className="size-select"
        value={size}
        onChange={(e) => handleSizeChange(parseInt(e.target.value, 10))}
      >
        <option value={5}>5 pro Seite</option>
        <option value={10}>10 pro Seite</option>
        <option value={20}>20 pro Seite</option>
      </select>
    </div>
  );
};

export default SearchComponent;
