# Suchkomponente (SearchComponent)

## Beschreibung
Die `SearchComponent` ist eine wiederverwendbare Komponente, die ein Suchfeld und ein Dropdown-Menü für die Seitengröße bietet. Diese Komponente kann in verschiedenen Listenansichten, wie `CustomerList` und `EmployeeList`, verwendet werden, um eine konsistente Such- und Filterfunktionalität bereitzustellen.

## Zweck
Die Trennung der Such- und Filterlogik in eine eigene Komponente hat mehrere Vorteile:
1. **Wiederverwendbarkeit**: Die Komponente kann in mehreren Teilen der Anwendung verwendet werden, ohne den Code zu duplizieren.
2. **Wartbarkeit**: Änderungen an der Such- oder Filterlogik müssen nur an einer Stelle vorgenommen werden.
3. **Klarheit und Modularität**: Die Hauptkomponenten (`CustomerList`, `EmployeeList`) bleiben übersichtlich und fokussiert auf ihre Kernlogik.

## Verwendung

### Props
- **`search`**: Der aktuelle Suchbegriff (String).
- **`size`**: Die aktuelle Anzahl der Elemente pro Seite (Number).
- **`handleSearchChange`**: Funktion, die bei Änderungen des Suchbegriffs aufgerufen wird.
- **`handleSizeChange`**: Funktion, die bei Änderungen der Anzahl der Elemente pro Seite aufgerufen wird.

### Beispiel
```jsx
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
```

### Integration in eine Hauptkomponente
Hier ist ein Beispiel, wie die `SearchComponent` in der `CustomerList`-Komponente verwendet wird:

```jsx
import React, { useState, useEffect } from "react";
import Spinner from "./shared/Spinner";
import { getCustomers } from "../api/customers";
import SearchComponent from "./SearchComponent";

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
          {/* Tabellenkopf und -körper */}
        </table>
      )}
    </div>
  );
};

export default CustomerList;
```

Durch die Verwendung der `SearchComponent` bleibt der Code modular und übersichtlich. Du kannst die Komponente jetzt leicht in anderen Teilen der Anwendung wiederverwenden.

## Fazit
Die Implementierung einer wiederverwendbaren Suchkomponente verbessert die Modularität und Wartbarkeit deiner Anwendung. Sie ermöglicht es dir, Such- und Filterfunktionen konsistent und effizient zu verwalten.