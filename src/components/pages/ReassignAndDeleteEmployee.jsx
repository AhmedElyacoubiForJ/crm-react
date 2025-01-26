import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Table } from "react-bootstrap";
import { getEmployee, getEmployees, reassignAndDeleteEmployee } from "../../api/employees";

const ReassignAndDeleteEmployee = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [newEmployeeId, setNewEmployeeId] = useState(null);

  useEffect(() => {
    // Fetch employee details
    getEmployee(employeeId).then((data) => {
      console.log(data);
      setEmployee(data);
    }).catch((error) => {
      console.error("Error fetching employee data:", error);
    });

    // Fetch all employees
    getEmployees().then((data) => {
      if (Array.isArray(data.data.content)) {
        setEmployees(data.data.content.filter(emp => emp.id !== parseInt(employeeId)));
      } else {
        setEmployees([]);
      }
    }).catch((error) => {
      console.error("Error fetching employees data:", error);
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
      {employee && (
        <div>
          <p>
            Reassign customers from
            <strong> {employee.firstName} {employee.lastName}</strong>
          </p>

          <Form.Group controlId="departmentSelect">
            <Form.Label>Filter by Department</Form.Label>
            <Form.Control
              as="select"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="">Select Department</option>
              {Array.from(new Set(employees.map((emp) => emp.department))).map(
                (department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                )
              )}
            </Form.Control>
          </Form.Group>

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
                .filter((emp) => emp.department === selectedDepartment || selectedDepartment === "")
                .map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <Form.Check 
                        type="radio" 
                        name="employeeSelect" 
                        value={emp.id} 
                        onChange={() => setNewEmployeeId(emp.id)} 
                      />
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

          <Button
            variant="danger"
            onClick={handleReassignAndDelete}
            disabled={!newEmployeeId}
          >
            Reassign Customers and Delete Employee
          </Button>
          {' '} {/* Space between buttons */}
          <Button
            variant="secondary"
            onClick={handleBackToList}
          >
            Back to List
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReassignAndDeleteEmployee;
