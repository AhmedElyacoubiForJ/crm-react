### Feature-Dokumentation: Abteilungsmanagement in der AddEmployee-Komponente

**Zweck:**

Dieses Feature ermöglicht es Benutzern, entweder eine vorhandene Abteilung aus einer Dropdown-Liste auszuwählen oder eine neue Abteilung einzugeben, falls die gewünschte Abteilung nicht in der Liste vorhanden ist. Dies verbessert die Datenintegrität, indem Tippfehler und Inkonsistenzen vermieden werden.

**Implementierungsdetails:**

1. **Backend:**
   - Ein neuer Endpunkt `/departments` wurde im `EmployeeRestController` hinzugefügt, um alle vorhandenen Abteilungen abzurufen.
   - `EmployeeRepository` enthält eine neue Methode `findAllDepartments()`, um die einzigartigen Abteilungen aus der Datenbank abzurufen.
   - Der `EmployeeServiceImpl` bietet die Methode `getAllDepartments()`, um die Daten aus dem Repository abzurufen.

   ```java
   @Service
   public class EmployeeServiceImpl {

       @Autowired
       private EmployeeRepository employeeRepository;

       public Optional<List<String>> getAllDepartments() {
           return employeeRepository.findAllDepartments();
       }
   }

   @RestController
   @RequestMapping("/api/employees")
   public class EmployeeRestController {

       @Autowired
       private EmployeeService employeeService;

       @GetMapping("/departments")
       public ResponseEntity<APIResponse<List<String>>> getAllDepartments() {
           Optional<List<String>> allDepartments = employeeService.getAllDepartments();
           APIResponse<List<String>> response = APIResponse.<List<String>>builder()
                   .status("success")
                   .statusCode(HttpStatus.OK.value())
                   .data(allDepartments.get())
                   .build();
           return new ResponseEntity<>(response, HttpStatus.OK);
       }
   }

   @Repository
   public interface EmployeeRepository extends JpaRepository<Employee, Long> {
       @Query("SELECT distinct e.department FROM Employee e")
       Optional<List<String>> findAllDepartments();
   }
   ```

2. **Frontend:**
   - Die `AddEmployee.jsx`-Komponente wurde angepasst, um die Abteilungen abzurufen und in einem Dropdown-Menü anzuzeigen.
   - Eine zusätzliche Eingabemöglichkeit für eine neue Abteilung wurde hinzugefügt, falls die gewünschte Abteilung nicht in der Dropdown-Liste enthalten ist.
   
   ```jsx
   import React, { useState, useEffect } from "react";
   import { useNavigate, Link } from "react-router-dom";
   import { Card, Form, Button } from "react-bootstrap";
   import { addEmployee, getAllDepartments } from "../../api/employees";

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

     useEffect(() => {
       const fetchDepartments = async () => {
         try {
           const departmentsData = await getAllDepartments();
           setDepartments(departmentsData);
           setLoading(false);
         } catch (error) {
           console.error("Error fetching departments:", error);
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
   ```

**Anleitung zur Nutzung:**

1. **Mitarbeiter hinzufügen:**
   - Navigiere zur Seite "Mitarbeiter hinzufügen" über den entsprechenden Link in der Mitarbeiterliste.
   - Wähle eine vorhandene Abteilung aus dem Dropdown-Menü aus.
   - Falls die gewünschte Abteilung nicht in der Liste enthalten ist, wähle "Andere Abteilung..." und gib die neue Abteilung in das erscheinende Textfeld ein.
   - Fülle die restlichen Felder aus und klicke auf "Speichern", um den neuen Mitarbeiter hinzuzufügen.

2. **Mitarbeiterliste anzeigen:**
   - Nach dem Hinzufügen eines neuen Mitarbeiters wirst du zur Mitarbeiterliste weitergeleitet, wo du die Details des neuen Mitarbeiters überprüfen kannst.