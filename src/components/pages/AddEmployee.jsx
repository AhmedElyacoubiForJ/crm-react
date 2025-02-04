import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, Form, Button } from "react-bootstrap";
import useFetchData from "../common/hooks/useFetchData";
import { addEmployee, getDepartments } from "../../api/employees";
import StatusMessage from "../common/StatusMessage";

const AddEmployee = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });
  const { data: departments, loading, error } = useFetchData(getDepartments);
  const [validationErrors, setValidationErrors] = useState({});
  const [customDepartment, setCustomDepartment] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEmployee({ ...employee, [name]: value });

    if (name === "department" && value === "custom") {
      setCustomDepartment(true);
    } else if (name === "department") {
      setCustomDepartment(false);
    }
  };

  const handleCustomDepartmentChange = (event) => {
    setEmployee({ ...employee, department: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidationErrors({}); // Reset validation errors

    try {
      await addEmployee(employee);
      setEmployee({
        firstName: "",
        lastName: "",
        email: "",
        department: "",
      });
      navigate("/view-employees");
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
        console.error("Error adding employee:", error);
      }
    }
  };

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header>
          <h1>Mitarbeiter hinzufügen</h1>
        </Card.Header>
        <Card.Body>
          <StatusMessage loading={loading} error={error}>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="firstName">
                <Form.Label>Vorname</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Vorname"
                  name="firstName"
                  value={employee.firstName}
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
                  value={employee.lastName}
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
                  value={employee.email}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.email}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="department" className="mt-3">
                <Form.Label>Abteilung</Form.Label>
                {departments ? (
                  <>
                    <Form.Control
                      as="select"
                      name="department"
                      value={customDepartment ? "custom" : employee.department}
                      onChange={handleInputChange}
                      isInvalid={!!validationErrors.department}
                    >
                      <option value="">Wählen Sie eine Abteilung</option>
                      {departments.map((dept, index) => (
                        <option key={index} value={dept}>
                          {dept}
                        </option>
                      ))}
                      <option value="custom">Andere Abteilung...</option>
                    </Form.Control>
                    {customDepartment && (
                      <Form.Control
                        type="text"
                        placeholder="Geben Sie eine neue Abteilung ein"
                        name="customDepartment"
                        value={employee.department}
                        onChange={handleCustomDepartmentChange}
                        isInvalid={!!validationErrors.customDepartment}
                        className="mt-2"
                      />
                    )}
                  </>
                ) : (
                  <p className="text-danger">
                    Abteilungen konnten nicht geladen werden.
                  </p>
                )}
                <Form.Control.Feedback type="invalid">
                  {validationErrors.department ||
                    validationErrors.customDepartment}
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
                <Link to="/view-employees" className="mt-3 ms-3">
                  <Button className="uniform-button" variant="secondary">
                    Zurück zur Liste
                  </Button>
                </Link>
              </div>
            </Form>
          </StatusMessage>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddEmployee;
