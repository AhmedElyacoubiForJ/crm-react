import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import { getCustomerById } from "../../api/customers";
import Spinner from "../common/Spinner";

const ShowCustomer = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const data = await getCustomerById(id);
        setCustomer(data);
        setLoading(false);
      } catch (error) {
        setError("Fehler beim Abrufen der Kundendaten");
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  if (loading) return <Spinner />;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header>
          <h2>Kundendetails</h2>
        </Card.Header>
        <Card.Body>
          {customer && (
            <div>
              <p>
                <strong>Vorname:</strong> {customer.firstName}
              </p>
              <p>
                <strong>Nachname:</strong> {customer.lastName}
              </p>
              <p>
                <strong>E-Mail:</strong> {customer.email}
              </p>
              <p>
                <strong>Telefonnummer:</strong> {customer.phone}
              </p>
              <p>
                <strong>Adresse:</strong> {customer.address}
              </p>
              <p>
                <strong>Letzte Interaktion:</strong>{" "}
                {customer.lastInteractionDate}
              </p>
            </div>
          )}
          <div className="flex-container mt-4">
            <Link to="/view-customers">
              <Button className="uniform-button" variant="secondary">
                Zurück zur Liste
              </Button>
            </Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ShowCustomer;
