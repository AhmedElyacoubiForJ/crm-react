import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import NavBar from "./components/common/NavBar";
import Footer from "./components/common/Footer";
import CustomerList from "./components/pages/CustomerList";
import AddCustomer from "./components/pages/AddCustomer";
import ShowCustomer from "./components/pages/ShowCustomer";
import EditCustomer from "./components/pages/EditCustomer";
import EmployeeList from "./components/pages/EmployeeList";
import ShowEmployee from "./components/pages/ShowEmployee";
import EditEmployee from "./components/pages/EditEmployee";
import AddEmployee from "./components/pages/AddEmployee";
import ReassignAndDeleteEmployee from "./components/pages/ReassignAndDeleteEmployee";
import NoteList from "./components/pages/NoteList";

function App() {
  return (
    <div className="container mt-5">
      <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/view-customers" element={<CustomerList />} />
          <Route path="/add-customer" element={<AddCustomer />} />
          <Route path="/view-customer/:id" element={<ShowCustomer />} />
          <Route path="/edit-customer/:id" element={<EditCustomer />} />
          <Route path="/view-employees" element={<EmployeeList />} />
          <Route path="/view-employee/:id" element={<ShowEmployee />} />
          <Route path="/edit-employee/:id" element={<EditEmployee />} />
          <Route path="/add-employee" element={<AddEmployee />} />
          <Route
            path="/reassign-and-delete/:employeeId"
            element={<ReassignAndDeleteEmployee />}
          />
          <Route path="/view-notes" element={<NoteList />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
