import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, Form, Button } from "react-bootstrap";
import { addEmployee } from "../../api/employees";

const AddEmployee = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });
  // Handle input change event and update employee state
  const handleInputChange = (event) => {
    setEmployee({ ...employee, [event.target.name]: event.target.value });
  };
  // Handle form submission event
  const handleSubmit = (event) => {
    event.preventDefault();
    addEmployee(employee)
      .then(() => navigate("/view-employees"))
      .catch((error) => console.error("Error adding employee:", error));
    setEmployee({
      firstName: "",
      lastName: "",
      email: "",
      department: "",
    });
  };
  return (
    <div className="container mt-4">
      <Card>
        <Card.Header>
          <h1>Mitarbeiter hinzufügen</h1>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="firstName">
              <Form.Label>Vorname</Form.Label>
              <Form.Control
                type="text"
                placeholder="Vorname"
                name="firstName"
                value={employee.firstName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="lastName" className="mt-3">
              <Form.Label>Nachname</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nachname"
                name="lastName"
                value={employee.lastName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="email" className="mt-3">
              <Form.Label>E-Mail</Form.Label>
              <Form.Control
                type="email"
                placeholder="E-Mail"
                name="email"
                value={employee.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="department" className="mt-3">
              <Form.Label>Abteilung</Form.Label>
              <Form.Control
                type="text"
                placeholder="Abteilung"
                name="department"
                value={employee.department}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <div className="flex-container">
              <Button
                variant="primary"
                type="submit"
                className="mt-3 uniform-button"
              >
                Speichern
              </Button>
              <Link to="/view-employees" className="mt-3 ms-3">
                <Button className="uniform-button" variant="secondary">
                  Zurück zur Liste
                </Button>
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddEmployee;
