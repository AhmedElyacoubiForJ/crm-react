import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/common/NavBar";
import CustomerList from "./components/CustomerList";
import Home from "./Home";

function App() {
  return (
    <div className="container mt-5">
      <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/view-customers" element={<CustomerList />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
