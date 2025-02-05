import { useParams, Link } from "react-router-dom";
import { getEmployee } from "../../api/employees";
import Spinner from "../common/Spinner";
import { Card, Button } from "react-bootstrap";
import useFetchData from "../common/hooks/useFetchData";

const ShowEmployee = () => {
  const { id } = useParams();
  const { data: employee, loading, error } = useFetchData(() => getEmployee(id), [id]); 

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
            <div className="flex-container">
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
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default ShowEmployee;
