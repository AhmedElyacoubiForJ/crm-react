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
  const [customDepartment, setCustomDepartment] = useState(false);

  // Fetch departments when component mounts
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const departmentsData = await getDepartments();
        setDepartments(departmentsData);
        console.log(departmentsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching departments:", error);
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  // Handle input change event and update employee state
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
              {loading ? (
                <p>Lade Abteilungen...</p>
              ) : (
                <>
                  <Form.Control
                    as="select"
                    name="department"
                    value={customDepartment ? "custom" : employee.department}
                    onChange={handleInputChange}
                    required={!customDepartment}
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
                      required
                      className="mt-2"
                    />
                  )}
                </>
              )}
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
