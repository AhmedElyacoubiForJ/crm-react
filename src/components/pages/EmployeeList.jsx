import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { Table, Button } from "react-bootstrap";
import StatusMessage from "../common/StatusMessage";
import useFetchData from "../common/hooks/useFetchData";
import { getEmployees } from "../../api/employees";
import SearchComponent from "../common/SearchComponent";
import PaginationComponent from "../common/PaginationComponent";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [search, setSearch] = useState("");
  const {
    data: employeesData,
    loading,
    error,
  } = useFetchData(
    () => getEmployees(page, size, search),
    [page, size, search]
  );

  useEffect(() => {
    if (employeesData) {
      console.log("Employees Data:", employeesData);
      setEmployees(employeesData.content);
      setTotalPages(employeesData.totalPages);
      setTotalElements(employeesData.totalElements);
    }
  }, [employeesData]);

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="mb-4 p-2">Mitarbeiterliste</h2>
        <Link to="/add-employee" className="p-2">
          <Button variant="primary" style={{ marginBottom: "20px" }}>
            Add neue Mitarbeiter
          </Button>
        </Link>
      </div>

      <SearchComponent
        search={search}
        size={size}
        handleSearchChange={setSearch}
        handleSizeChange={(newSize) => {
          setSize(newSize);
          setPage(0); // Zur ersten Seite wechseln, wenn sich die Seitengröße ändert
        }}
      />

      <StatusMessage loading={loading} error={error}>
        {employees.length === 0 ? (
          <p>Keine Mitarbeiter gefunden.</p>
        ) : (
          <Table bordered hover>
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
                    <Link
                      to={`/edit-employee/${employee.id}`}
                      title="Bearbeiten"
                    >
                      <FaEdit className="icon" />
                    </Link>
                    <Link to={`/view-employee/${employee.id}`} title="Anzeigen">
                      <FaEye className="icon" />
                    </Link>
                    <Link
                      to={`/reassign-and-delete/${employee.id}`}
                      title="Löschen"
                    >
                      <FaTrash className="icon icon-trash" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </StatusMessage>

      <PaginationComponent
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={setPage}
      />
    </div>
  );
};

export default EmployeeList;
