import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, Form, Button } from "react-bootstrap";
import { addCustomer } from "../../api/customers";
import { getEmployees } from "../../api/employees"; // Importiere die getEmployees-Funktion

const AddCustomer = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees(0, 100, ""); // Abrufen der Mitarbeiterdaten ohne Paginierung und Suche
        console.log("Fetched employees:", data.data.content); // Debug-Ausgabe hinzufügen
        setEmployees(data.data.content || []); // Wenn die Daten in `content` enthalten sind
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setLoading(false);
      }
    };
  
    fetchEmployees();
  }, []);
  

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCustomer({ ...customer, [name]: value });
  };

  const handleEmployeeChange = (event) => {
    setSelectedEmployee(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidationErrors({}); // Reset validation errors

    try {
      const customerWithCreationDate = {
        ...customer,
        lastInteractionDate: new Date().toISOString().split("T")[0], // Setze das aktuelle Datum
      };
      await addCustomer(customerWithCreationDate, selectedEmployee); // Übergib die ausgewählte employeeId
      setCustomer({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
      });
      navigate("/view-customers");
    } catch (error) {
      if (error.response && error.response.data.errors) {
        // Backend-Validierungsfehler verarbeiten
        console.log("Validation errors:", error.response.data.errors); // Debug-Ausgabe hinzufügen
        const errors = error.response.data.errors.reduce((acc, err) => {
          acc[err.field] = err.errorMessage;
          return acc;
        }, {});
        setValidationErrors(errors);
      } else {
        console.error("Error adding customer:", error);
      }
    }
  };

  if (loading) return <p>Lade Mitarbeiterdaten...</p>;

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header>
          <h1>Kunde hinzufügen</h1>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="firstName">
              <Form.Label>Vorname</Form.Label>
              <Form.Control
                type="text"
                placeholder="Vorname"
                name="firstName"
                value={customer.firstName}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.firstName}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.firstName}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="lastName" className="mt-3">
              <Form.Label>Nachname</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nachname"
                name="lastName"
                value={customer.lastName}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.lastName}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.lastName}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="email" className="mt-3">
              <Form.Label>E-Mail</Form.Label>
              <Form.Control
                type="email"
                placeholder="E-Mail"
                name="email"
                value={customer.email}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.email}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.email}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="phone" className="mt-3">
              <Form.Label>Telefonnummer</Form.Label>
              <Form.Control
                type="text"
                placeholder="Telefonnummer"
                name="phone"
                value={customer.phone}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.phone}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.phone}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="address" className="mt-3">
              <Form.Label>Adresse</Form.Label>
              <Form.Control
                type="text"
                placeholder="Adresse"
                name="address"
                value={customer.address}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.address}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.address}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="employee" className="mt-3">
              <Form.Label>Mitarbeiter</Form.Label>
              <Form.Control
                as="select"
                name="employee"
                value={selectedEmployee}
                onChange={handleEmployeeChange}
                isInvalid={!!validationErrors.employee}
              >
                <option value="">Wählen Sie einen Mitarbeiter</option>
                {employees && employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.firstName} {employee.lastName}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {validationErrors.employee}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="flex-container">
              <Button
                variant="primary"
                type="submit"
                className="mt-3 uniform-button"
              >
                Speichern
              </Button>
              <Link to="/view-customers" className="mt-3 ms-3">
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

export default AddCustomer;
