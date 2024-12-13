# Fehlerbehandlung in Unserer Anwendung

## Übersicht

In dieser Dokumentation wird das Fehlerhandling innerhalb der Anwendung beschrieben. Ziel ist es, sicherzustellen, dass alle Fehler korrekt erfasst, verarbeitet und dem Benutzer auf eine verständliche und nützliche Weise angezeigt werden. Dies umfasst sowohl Backend- als auch Frontend-Fehler.

## Backend Error Handling

### DTO-Klassen

Die DTO-Klassen definieren die Struktur der Daten, die zwischen dem Client und dem Server ausgetauscht werden. Diese Klassen verwenden Validierungsannotationen, um sicherzustellen, dass die empfangenen Daten korrekt sind.

**EmployeeRequestDTO:**

```java
package edu.yacoubi.crm.dto.employee;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EmployeeRequestDTO {
    @NotBlank(message = "First name is mandatory")
    private String firstName;

    @NotBlank(message = "Last name is mandatory")
    private String lastName;

    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is mandatory")
    private String email;

    @NotBlank(message = "Department is mandatory")
    private String department;
}
```

### Global Exception Handler

Ein globaler Exception Handler wird verwendet, um alle unbehandelten Ausnahmen abzufangen und zu verarbeiten. Dies sorgt dafür, dass eine konsistente Fehlerantwort an das Frontend gesendet wird.

**Beispielcode:**

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<APIResponse<Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        List<ValidationError> errors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(error -> new ValidationError(error.getField(), error.getDefaultMessage()))
            .collect(Collectors.toList());

        APIResponse<Void> response = new APIResponse<>();
        response.setStatus("error");
        response.setStatusCode(HttpStatus.BAD_REQUEST.value());
        response.setMessage("Validierungsfehler");
        response.setErrors(errors);

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}
```

### Endpoint

Der Endpunkt für das Erstellen eines neuen Mitarbeiters verwendet die Validierungsannotation `@Valid`, um sicherzustellen, dass die empfangenen Daten den definierten Anforderungen entsprechen.

**Beispielcode:**

```java
@Operation(
    summary = "Create a new employee",
    description = "This operation creates a new employee in the CRM system."
)
@PostMapping
public ResponseEntity<APIResponse<EmployeeResponseDTO>> createEmployee(
        @Valid @RequestBody EmployeeRequestDTO employeeRequestDTO) {
    log.info("EmployeeRestController::createEmployee request {}", jsonAsString(employeeRequestDTO));

    Employee employee = convertToEntity(employeeRequestDTO);
    Employee savedEmployee = employeeService.createEmployee(employee);

    EmployeeResponseDTO employeeResponseDTO = convertToResponseDTO(savedEmployee);
    APIResponse<EmployeeResponseDTO> response = APIResponse.<EmployeeResponseDTO>builder()
            .status("success")
            .statusCode(HttpStatus.CREATED.value())
            .data(employeeResponseDTO)
            .build();

    log.info("EmployeeRestController::createEmployee response {}", jsonAsString(response));
    return ResponseEntity.ok(response);
}
```

### Response Schema

Das Schema der API-Antworten stellt sicher, dass Fehlermeldungen konsistent und verständlich sind.

**Beispielschema:**

```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Validierungsfehler",
  "errors": [
    {
      "field": "firstName",
      "errorMessage": "First name is mandatory"
    }
  ],
  "data": null
}
```

## Frontend Error Handling

### Utility Function

Eine Utility-Funktion wird verwendet, um API-Fehler im Frontend zu handhaben. Diese Funktion verarbeitet die verschiedenen Arten von Fehlern, die von Axios zurückgegeben werden, und wirft sie entsprechend weiter.

**Beispielcode:**

```javascript
// utils/errorHandler.js
export const handleApiError = (error) => {
  if (error.response) {
    console.error('Fehlerstatus:', error.response.status);
    console.error('Fehlermeldung:', error.response.data.errors);
    throw error; // Weitergabe des ursprünglichen Fehlers
  } else if (error.request) {
    console.error("No response received:", error.request);
    throw new Error("Server ist nicht erreichbar. Bitte versuchen Sie es später erneut.");
  } else {
    console.error("Error setting up request:", error.message);
    throw new Error("Ein unerwarteter Fehler ist aufgetreten.");
  }
};
```

### API Method

Die API-Methoden nutzen die Utility-Funktion zur Fehlerbehandlung. Dies sorgt für eine klare und konsistente Fehlerbehandlung im Frontend.

**Beispielcode:**

```javascript
import axios from 'axios';
import { handleApiError } from './utils/errorHandler';

const BASE_URL = '/api/employees';

export const addEmployee = async (employee) => {
  try {
    const response = await axios.post(BASE_URL, employee);
    if (response.data.statusCode === 201) {
      return response.data.data;
    } else {
      throw response; // Den ursprünglichen Fehler weitergeben
    }
  } catch (error) {
    handleApiError(error);
  }
};
```

### Anzeige von Fehlern im UI

Im Frontend werden die Fehler, die vom Backend kommen, verarbeitet und dem Benutzer angezeigt. Hier ist ein Beispiel dafür, wie dies in einer React-Komponente umgesetzt wird.

**Beispielcode:**

```javascript
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, Form, Button } from "react-bootstrap";
import { addEmployee, getDepartments } from "../../api/employees";

const AddEmployee = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [customDepartment, setCustomDepartment] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const departmentsData = await getDepartments();
        setDepartments(departmentsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching departments:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

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
              {loading ? (
                <p>Lade Abteilungen...</p>
              ) : error ? (
                <p className="text-danger">{error}</p>
              ) : (
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
              )}
              <Form.Control.Feedback type="invalid">
                {validationErrors.department || validationErrors.customDepartment}
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
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddEmployee;
```          