# Use Case: Reassign and Delete Employee

## Übersicht

Dieser Use Case beschreibt den Prozess der Neuzuweisung von Kunden eines Mitarbeiters zu einem anderen Mitarbeiter, bevor der ursprüngliche Mitarbeiter deaktiviert und archiviert wird. Die Implementierung erfolgt im CRM-Frontend (React) und nutzt bestehende API-Endpunkte.

## Ziel

Eine benutzerfreundliche Oberfläche bereitstellen, die es ermöglicht, Mitarbeiter zu löschen, nachdem ihre zugewiesenen Kunden neu zugewiesen wurden. Die Seite soll die Mitarbeiter nach Abteilungen filtern können, ohne zusätzliche Anfragen an den Server zu stellen.

## Implementierungsdetails

### 1. Erweiterung von `EmployeeList.jsx`

- Füge eine Schaltfläche „Löschen“ hinzu, die den Benutzer zur neuen Seite `ReassignAndDeleteEmployee.jsx` weiterleitet.

```jsx
import React from "react";
import { Link } from "react-router-dom";
import { Button, Table } from "react-bootstrap";

const EmployeeList = ({ employees }) => {
  return (
    <div>
      <h1>Employee List</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.firstName} {employee.lastName}</td>
              <td>{employee.department}</td>
              <td>
                <Link to={`/reassign-and-delete/${employee.id}`}>
                  <Button variant="danger">Delete</Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default EmployeeList;
```

### 2. Erstellung der neuen Seite `ReassignAndDeleteEmployee.jsx`

- Entwickle eine neue Komponente, die:
  - Eine Liste von Abteilungen zur Filterung der Mitarbeiter anzeigt.
  - Eine Liste der gefilterten Mitarbeiter zur Auswahl eines neuen Mitarbeiters bietet.
  - Die Aktion der Neuzuweisung und Löschung auslöst.

```jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Table } from "react-bootstrap";
import axios from "axios";
import { getEmployeeById, reassignAndDeleteEmployee } from "../api/employee";

const ReassignAndDeleteEmployee = ({ employees }) => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [newEmployeeId, setNewEmployeeId] = useState("");

  useEffect(() => {
    // Fetch employee details
    getEmployeeById(employeeId).then(response => setEmployee(response.data));
  }, [employeeId]);

  const handleReassignAndDelete = () => {
    reassignAndDeleteEmployee(employeeId, newEmployeeId)
      .then(() => navigate("/employee-list"))
      .catch(error => console.error("There was an error!", error));
  };

  return (
    <div>
      <h1>Reassign and Delete Employee</h1>
      {employee && (
        <div>
          <p>Reassign customers from <strong>{employee.firstName} {employee.lastName}</strong></p>

          <Form.Group controlId="departmentSelect">
            <Form.Label>Filter by Department</Form.Label>
            <Form.Control as="select" value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
              <option value="">Select Department</option>
              {Array.from(new Set(employees.map(emp => emp.department))).map(department => (
                <option key={department} value={department}>{department}</option>
              ))}
            </Form.Control>
          </Form.Group>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {employees
                .filter(emp => emp.department === selectedDepartment)
                .map(emp => (
                  <tr key={emp.id} onClick={() => setNewEmployeeId(emp.id)}>
                    <td>{emp.id}</td>
                    <td>{emp.firstName} {emp.lastName}</td>
                    <td>{emp.department}</td>
                  </tr>
                ))}
            </tbody>
          </Table>

          <Button variant="danger" onClick={handleReassignAndDelete} disabled={!newEmployeeId}>
            Reassign Customers and Delete Employee
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReassignAndDeleteEmployee;
```

### 3. Anpassung der Route in `App.js`

- Füge die Route für die neue Seite hinzu.

```jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import EmployeeList from "./components/EmployeeList";
import ReassignAndDeleteEmployee from "./components/ReassignAndDeleteEmployee";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/employee-list" element={<EmployeeList />} />
        <Route path="/reassign-and-delete/:employeeId" element={<ReassignAndDeleteEmployee />} />
      </Routes>
    </Router>
  );
}

export default App;
```

### Vorteile dieser Implementierung

1. **Benutzerfreundlichkeit**: Die Benutzeroberfläche ist intuitiv und ermöglicht eine einfache Filterung und Auswahl der Mitarbeiter.
2. **Wiederverwendbarkeit**: Die Methode `assignCustomerToEmployee` kann in verschiedenen Szenarien wiederverwendet werden, z.B. Urlaub, Beschwerden, Support-Level-Wechsel oder Löschvorgänge.
3. **Datenintegrität**: Die Kunden werden vor dem Löschen des Mitarbeiters neu zugewiesen, wodurch Datenverlust vermieden wird.

---

Dieses Dokument bietet eine umfassende Übersicht über den Use Case und die Lösungsansatz.

