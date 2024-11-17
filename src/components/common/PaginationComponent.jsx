import React from 'react';

const PaginationComponent = ({ page, totalPages, totalElements, onPageChange }) => {
  return (
    <div className="pagination">
      <button
        className="pagination-button"
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
      >
        Vorherige Seite
      </button>
      <span className="pagination-info">
        Seite {page + 1} von {totalPages}
      </span>
      <button
        className="pagination-button"
        disabled={page >= totalPages - 1}
        onClick={() => onPageChange(page + 1)}
      >
        Nächste Seite
      </button>
      <span className="pagination-info">
        Insgesamt {totalElements} Einträge
      </span>
    </div>
  );
};

export default PaginationComponent;
