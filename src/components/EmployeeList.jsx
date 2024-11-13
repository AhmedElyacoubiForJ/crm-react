import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import Spinner from "./shared/Spinner";
import { getEmployees } from "../api/employees";
import SearchComponent from "./SearchComponent";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
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

  return (
    <div>
      <h2 className="mb-4">Mitarbeiterliste</h2>

      <SearchComponent
        search={search}
        size={size}
        handleSearchChange={setSearch}
        handleSizeChange={(newSize) => {
          setSize(newSize);
          setPage(0); // Zur ersten Seite wechseln, wenn sich die Seitengröße ändert
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
};

export default EmployeeList;
