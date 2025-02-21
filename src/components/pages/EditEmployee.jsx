import React, { useState, useEffect} from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getEmployee, updateEmployee } from "../../api/employees";
import Spinner from "../common/Spinner";
import { Card, Form, Button } from "react-bootstrap";
import useFetchData from "../common/hooks/useFetchData";

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });
  const [error, setError] = useState(null); // Fehlerzustand hinzufügen
  const { data, loading, error: fetchError } = useFetchData(() => getEmployee(id), [id]);
  
  useEffect(() => {
    if (data) {
      setEmployee(data);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateEmployee(id, employee);
      navigate(`/view-employee/${id}`);
    } catch (error) {
      setError("Fehler beim Aktualisieren der Mitarbeiterdaten");
    }
  };

  if (loading) return <Spinner />;
  if (fetchError || error) return <p>{fetchError || error}</p>;
  
  if (!loading) {
    console.log("Employee");
    console.log(employee);
  }
  
  return (
    <div className="container mt-4">
      <Card>
        <Card.Header>
          <h2>Mitarbeiter bearbeiten</h2>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formFirstName">
              <Form.Label>Vorname:</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={employee.firstName}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formLastName" className="mt-3">
              <Form.Label>Nachname:</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={employee.lastName}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="mt-3">
              <Form.Label>E-Mail:</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={employee.email}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formDepartment" className="mt-3">
              <Form.Label>Abteilung:</Form.Label>
              <Form.Control
                type="text"
                name="department"
                value={employee.department}
                onChange={handleChange}
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

export default EditEmployee;
