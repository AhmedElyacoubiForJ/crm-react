import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { deleteEmployee } from "../../api/employees";
import { Card, Button } from "react-bootstrap";

const DeleteEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await deleteEmployee(id);
      navigate("/view-employees");
    } catch (error) {
      alert("Fehler beim Löschen des Mitarbeiters");
    }
  };

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header>
          <h2>Mitarbeiter mit dem ID: {id} löschen</h2>
        </Card.Header>
        <Card.Body>
          <p>Bist du sicher, dass du diesen Mitarbeiter löschen möchtest?</p>
          <Button variant="danger" onClick={handleDelete} className="me-2">
            Löschen
          </Button>
          <Button variant="secondary" onClick={() => navigate(`/view-employee/${id}`)}>
            Abbrechen
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default DeleteEmployee;
