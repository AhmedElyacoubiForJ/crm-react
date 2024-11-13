# PaginationComponent

## Übersicht
Die `PaginationComponent` ist eine wiederverwendbare Komponente, die die Paginierungslogik kapselt. Sie bietet Schaltflächen zur Navigation zwischen Seiten sowie Informationen über die aktuelle Seite und die Gesamtzahl der Einträge. Diese Komponente kann in verschiedenen Listenansichten wie `CustomerList` und `EmployeeList` verwendet werden, um eine konsistente Paginierungsfunktionalität bereitzustellen.

## Zweck
Die Trennung der Paginierungslogik in eine eigene Komponente hat mehrere Vorteile:
1. **Wiederverwendbarkeit**: Die Komponente kann in mehreren Teilen der Anwendung verwendet werden, ohne den Code zu duplizieren.
2. **Wartbarkeit**: Änderungen an der Paginierungslogik müssen nur an einer Stelle vorgenommen werden.
3. **Klarheit und Modularität**: Die Hauptkomponenten (`CustomerList`, `EmployeeList`) bleiben übersichtlich und fokussiert auf ihre Kernlogik.

## Verwendung

### Props
- **`page`**: Die aktuelle Seite (Number).
- **`totalPages`**: Die gesamte Anzahl der Seiten (Number).
- **`totalElements`**: Die gesamte Anzahl der Einträge (Number).
- **`onPageChange`**: Funktion, die bei Änderungen der Seite aufgerufen wird.

### Beispielcode

```jsx
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
```

### Integration in eine Hauptkomponente

#### Beispiel: `CustomerList.jsx`
```jsx
import React, { useState, useEffect } from "react";
import Spinner from "./shared/Spinner";
import { getCustomers } from "../api/customers";
import SearchComponent from "./SearchComponent";
import PaginationComponent from "./PaginationComponent"; // Import der Paginierungskomponente

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getCustomers(page, size, search);
        setCustomers(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
        setLoading(false);
      } catch (error) {
        setError("Fehler beim Abrufen der Kundendaten");
        setLoading(false);
      }
    };

    fetchData();
  }, [page, size, search]);

  return (
    <div>
      <h2 className="mb-4">Kundenliste</h2>

      <SearchComponent
        search={search}
        size={size}
        handleSearchChange={setSearch}
        handleSizeChange={(newSize) => {
          setSize(newSize);
          setPage(0);
        }}
      />

      {loading ? (
        <Spinner />
      ) : error ? (
        <div>
          <p>{error}</p>
          <button onClick={() => setPage(0)}>Erneut versuchen</button>
        </div>
      ) : customers.length === 0 ? (
        <p>Keine Kunden gefunden.</p>
      ) : (
        <table className="table table-hover">
          <thead className="table-dark">
            <tr>
              <th>Vorname</th>
              <th>Nachname</th>
              <th>E-Mail</th>
              <th>Phone</th>
              <th>Adresse</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.firstName}</td>
                <td>{customer.lastName}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{customer.address}</td>
                <td>
                  <Link to={`/edit-customer/${customer.id}`} title="Bearbeiten">
                    <FaEdit className="icon" />
                  </Link>
                  <Link to={`/view-customer/${customer.id}`} title="Anzeigen">
                    <FaEye className="icon" />
                  </Link>
                  <Link to={`/delete-customer/${customer.id}`} title="Löschen">
                    <FaTrash className="icon icon-trash" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <PaginationComponent
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={setPage}
      />
    </div>
  );
};

export default CustomerList;
```

## Fazit
Die Implementierung einer wiederverwendbaren Paginierungskomponente verbessert die Modularität und Wartbarkeit deiner Anwendung. Sie ermöglicht es dir, die Paginierungslogik konsistent und effizient zu verwalten.