import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getEmployee } from "../../api/employees";
import Spinner from "../common/Spinner";
import { Card, Button, ButtonGroup } from "react-bootstrap";

const ShowEmployee = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      setLoading(true);
      try {
        const response = await getEmployee(id);
        setEmployee(response.data);
        setLoading(false);
      } catch (error) {
        setError("Fehler beim Abrufen der Mitarbeiterdaten");
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading) return <Spinner />;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-4">
      {employee && (
        <Card>
          <Card.Header>
            <h2>Mitarbeiterdetails</h2>
          </Card.Header>
          <Card.Body>
            <p>Vorname: {employee.firstName}</p>
            <p>Nachname: {employee.lastName}</p>
            <p>E-Mail: {employee.email}</p>
            <p>Abteilung: {employee.department}</p>
            <ButtonGroup className="flex-container">
              <Link to="/view-employees">
                <Button className="uniform-button" variant="secondary">
                  Zurück zur Liste
                </Button>
              </Link>
              <Link to={`/edit-employee/${employee.id}`}>
                <Button className="uniform-button" variant="primary">
                  Bearbeiten
                </Button>
              </Link>
            </ButtonGroup>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default ShowEmployee;
