# EmployeeList Komponente

## Übersicht
Die `EmployeeList` Komponente zeigt eine Liste von Mitarbeitern mit Such- und Paginierungsfunktionalität. Sie nutzt die wiederverwendbare `SearchComponent`, um die Benutzerfreundlichkeit zu verbessern und den Code modular zu halten.

## Props
Die `EmployeeList` Komponente verwendet keine direkten Props, da sie ihren Zustand und die API-Aufrufe intern verwaltet.

## State
- **employees**: Array von Mitarbeitern, die von der API abgerufen werden.
- **totalPages**: Gesamte Anzahl der Seiten.
- **totalElements**: Gesamte Anzahl der Mitarbeiter.
- **loading**: Boolescher Wert, der angibt, ob die Daten gerade geladen werden.
- **error**: Fehlernachricht, falls ein Fehler beim Abrufen der Daten auftritt.
- **page**: Aktuelle Seite.
- **size**: Anzahl der Elemente pro Seite.
- **search**: Aktueller Suchbegriff.

## Verwendung

### Initialisierung und API-Aufruf
Die `EmployeeList` Komponente verwendet den `useEffect` Hook, um die Mitarbeiterdaten bei jeder Änderung von `page`, `size` oder `search` abzurufen.

```jsx
useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getEmployees(page, size, search);
      setEmployees(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
      setLoading(false);
    } catch (error) {
      setError("Fehler beim Abrufen der Mitarbeiterdaten");
      setLoading(false);
    }
  };

  fetchData();
}, [page, size, search]);
```

### Such- und Paginierungskomponente
Die Komponente verwendet die `SearchComponent`, um die Such- und Paginierungsfunktionalität zu kapseln und wiederverwendbar zu machen.

```jsx
<SearchComponent
  search={search}
  size={size}
  handleSearchChange={setSearch}
  handleSizeChange={(newSize) => {
    setSize(newSize);
    setPage(0); // Zur ersten Seite wechseln, wenn sich die Seitengröße ändert
  }}
/>
```

### Darstellung der Mitarbeiterliste
Die Mitarbeiterdaten werden in einer Tabelle angezeigt. Jede Zeile enthält die Mitarbeiterinformationen sowie Links zum Bearbeiten, Anzeigen und Löschen.

```jsx
return (
  <div>
    <h2 className="mb-4">Mitarbeiterliste</h2>

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
    ) : employees.length === 0 ? (
      <p>Keine Mitarbeiter gefunden.</p>
    ) : (
      <table className="table table-hover">
        <thead className="table-dark">
          <tr>
            <th>Vorname</th>
            <th>Nachname</th>
            <th>E-Mail</th>
            <th>Abteilung</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.firstName}</td>
              <td>{employee.lastName}</td>
              <td>{employee.email}</td>
              <td>{employee.department}</td>
              <td>
                <Link to={`/edit-employee/${employee.id}`} title="Bearbeiten">
                  <FaEdit className="icon" />
                </Link>
                <Link to={`/view-employee/${employee.id}`} title="Anzeigen">
                  <FaEye className="icon" />
                </Link>
                <Link to={`/delete-employee/${employee.id}`} title="Löschen">
                  <FaTrash className="icon icon-trash" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
    <div className="pagination">
      <button
        className="pagination-button"
        disabled={page === 0}
        onClick={() => setPage(page - 1)}
      >
        Vorherige Seite
      </button>
      <span className="pagination-info">
        Seite {page + 1} von {totalPages}
      </span>
      <button
        className="pagination-button"
        disabled={page >= totalPages - 1}
        onClick={() => setPage(page + 1)}
      >
        Nächste Seite
      </button>
      <span className="pagination-info">
        Insgesamt {totalElements} Mitarbeiter
      </span>
    </div>
  </div>
);
```

## Fazit
Die `EmployeeList` Komponente nutzt eine wiederverwendbare `SearchComponent`, um die Such- und Paginierungslogik zu kapseln und den Code modular zu halten. Durch diese Struktur bleibt die Hauptkomponente übersichtlich und leicht wartbar.