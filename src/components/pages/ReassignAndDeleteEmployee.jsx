import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Table,
  OverlayTrigger,
  Tooltip,
  Modal,
} from "react-bootstrap";
import Spinner from "../common/Spinner";
import {
  getEmployee,
  getEmployees,
  reassignAndDeleteEmployee,
} from "../../api/employees";

const ReassignAndDeleteEmployee = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loadingEmployee, setLoadingEmployee] = useState(true);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [newEmployeeId, setNewEmployeeId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const departmentTooltip = (
    <Tooltip id="department-tooltip">
      Wähle eine Abteilung, um die Mitarbeiter zu filtern.
    </Tooltip>
  );

  const employeeSelectTooltip = (
    <Tooltip id="employee-select-tooltip">
      Wähle einen Mitarbeiter, um Kunden neu zuzuweisen.
    </Tooltip>
  );

  const reassignDeleteTooltip = (
    <Tooltip id="reassign-delete-tooltip">
      Weise Kunden einem neuen Mitarbeiter zu und lösche den aktuellen
      Mitarbeiter.
    </Tooltip>
  );

  const backToListTooltip = (
    <Tooltip id="back-to-list-tooltip">Zurück zur Mitarbeiterliste.</Tooltip>
  );

  const handleShowModal = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmDelete = () => {
    handleReassignAndDelete();
    handleCloseModal();
  };

  useEffect(() => {
    setLoadingEmployee(true);
    setLoadingEmployees(true);

    // Fetch employee details
    getEmployee(employeeId)
      .then((data) => {
        console.log(data);
        setEmployee(data);
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
      })
      .finally(() => {
        setLoadingEmployee(false);
      });

    // Fetch all employees
    getEmployees()
      .then((data) => {
        if (Array.isArray(data.data.content)) {
          setEmployees(
            data.data.content.filter((emp) => emp.id !== parseInt(employeeId))
          );
        } else {
          setEmployees([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching employees data:", error);
      })
      .finally(() => {
        setLoadingEmployees(false);
      });
  }, [employeeId]);

  const handleReassignAndDelete = () => {
    reassignAndDeleteEmployee(employeeId, newEmployeeId)
      .then(() => navigate("/view-employees"))
      .catch((error) => console.error("There was an error!", error));
  };

  const handleBackToList = () => {
    navigate("/view-employees");
  };

  return (
    <div>
      <h1>Reassign and Delete Employee</h1>
      {loadingEmployee ? (
        <Spinner />
      ) : (
        employee && (
          <div>
            <p>
              Reassign customers from
              <strong>
                {employee.firstName} {employee.lastName}
              </strong>
            </p>

            <OverlayTrigger overlay={departmentTooltip} placement="left">
              <Form.Group controlId="departmentSelect">
                <Form.Label>Filter by Department</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  <option value="">Select Department</option>
                  {Array.from(
                    new Set(employees.map((emp) => emp.department))
                  ).map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </OverlayTrigger>
            {loadingEmployees ? (
              <Spinner />
            ) : (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Select</th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Department</th>
                  </tr>
                </thead>
                <tbody>
                  {employees
                    .filter(
                      (emp) =>
                        emp.department === selectedDepartment ||
                        selectedDepartment === ""
                    )
                    .map((emp) => (
                      <tr key={emp.id}>
                        <td>
                          <OverlayTrigger
                            overlay={employeeSelectTooltip}
                            placement="left"
                          >
                            <Form.Check
                              type="radio"
                              name="employeeSelect"
                              value={emp.id}
                              onChange={() => setNewEmployeeId(emp.id)}
                            />
                          </OverlayTrigger>
                        </td>
                        <td>{emp.id}</td>
                        <td>
                          {emp.firstName} {emp.lastName}
                        </td>
                        <td>{emp.department}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            )}

            <OverlayTrigger overlay={reassignDeleteTooltip} placement="top">
              <Button
                variant="danger"
                onClick={() =>
                  handleShowModal(
                    "Are you sure you want to reassign customers and delete this employee?"
                  )
                }
                disabled={!newEmployeeId}
              >
                Reassign Customers and Delete Employee
              </Button>
            </OverlayTrigger>
            {/* Space between buttons */}
            <OverlayTrigger overlay={backToListTooltip} placement="top">
              <Button variant="secondary" onClick={handleBackToList}>
                Back to List
              </Button>
            </OverlayTrigger>

            <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title>Confirm Action</Modal.Title>
              </Modal.Header>
              <Modal.Body>{modalMessage}</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleConfirmDelete}>
                  Confirm
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        )
      )}
    </div>
  );
};

export default ReassignAndDeleteEmployee;
