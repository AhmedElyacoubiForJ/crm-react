import React, { useState, useEffect } from "react";
import { getEmployees } from "../../api/employees";
import { getCustomersByEmployeeId } from "../../api/customers";
import { getNotesByCustomerId } from "../../api/notes";
import { Card, Form, Button } from "react-bootstrap";

const NoteList = () => {
  const [employees, setEmployees] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [notes, setNotes] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      const data = await getEmployees(0, 100, "");
      setEmployees(data.data.content);
      setLoading(false);
    };
    fetchEmployees();
  }, []);

  const handleEmployeeChange = async (event) => {
    setSelectedEmployee(event.target.value);
    if (event.target.value) {
      const data = await getCustomersByEmployeeId(event.target.value); // Fetch customers for selected employee
      setCustomers(data.data);
    } else {
      setCustomers([]);
    }
    setSelectedCustomer("");
    setNotes([]);
  };

  const handleCustomerChange = async (event) => {
    setSelectedCustomer(event.target.value);
    if (event.target.value) {
      const data = await getNotesByCustomerId(event.target.value); // Fetch notes for selected customer
      setNotes(data.data);
    } else {
      setNotes([]);
    }
  };

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header>
          <h1>Notizen</h1>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <p>Lade Daten...</p>
          ) : (
            <>
              <Form.Group controlId="employeeSelect">
                <Form.Label>Mitarbeiter auswählen</Form.Label>
                <Form.Control as="select" onChange={handleEmployeeChange}>
                  <option value="">Wähle einen Mitarbeiter</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.firstName} {employee.lastName}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="customerSelect" className="mt-3">
                <Form.Label>Kunde auswählen</Form.Label>
                <Form.Control
                  as="select"
                  onChange={handleCustomerChange}
                  disabled={!selectedEmployee}
                >
                  <option value="">Wähle einen Kunden</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.firstName} {customer.lastName}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <h2 className="mt-4">Notizen für ausgewählten Kunden</h2>
              <ul>
                {notes.map((note) => (
                  <li key={note.id}>
                    <h3>{note.title}</h3>
                    <p>{note.content}</p>
                    <Button variant="warning">Edit</Button>
                    <Button variant="danger" className="ms-2">
                      Delete
                    </Button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default NoteList;
