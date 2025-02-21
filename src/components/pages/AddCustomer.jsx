import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, Form, Button } from "react-bootstrap";
import { addCustomer } from "../../api/customers";

const AddCustomer = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCustomer({ ...customer, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidationErrors({}); // Reset validation errors

    try {
      const customerWithCreationDate = {
        ...customer,
        lastInteractionDate: new Date().toISOString().split("T")[0], // Setze das aktuelle Datum
      };
      await addCustomer(customerWithCreationDate, 1);
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
