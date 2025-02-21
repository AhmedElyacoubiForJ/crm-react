import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { Table, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import Spinner from "../common/Spinner";
import SearchComponent from "../common/SearchComponent";
import { getCustomers } from "../../api/customers";
import PaginationComponent from "../common/PaginationComponent";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getCustomers(page, size, search);
        setCustomers(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
        setLoading(false);
      } catch (error) {
        setError("Fehler beim Abrufen der Kundendaten");
        setLoading(false);
      }
    };

    fetchData();
  }, [page, size, search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSizeChange = (e) => {
    setSize(parseInt(e.target.value, 10));
    setPage(0); // Reset to first page when size changes
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="mb-4">Kundenliste</h2>
        <Link to="/add-customer" className="p-2">
          <Button variant="primary" style={{ marginBottom: "20px" }}>
            Add neuer Kunde
          </Button>
        </Link>
      </div>

      <SearchComponent
        search={search}
        size={size}
        handleSearchChange={setSearch}
        handleSizeChange={(newSize) => {
          setSize(newSize);
          setPage(0);
        }}
      />

      {loading ? (
        <Spinner />
      ) : error ? (
        <div>
          <p>{error}</p>
          <button onClick={() => setPage(0)}>Erneut versuchen</button>
        </div>
      ) : customers.length === 0 ? (
        <p>Keine Kunden gefunden.</p>
      ) : (
        <table className="table table-hover">
          <thead className="table-dark">
            <tr>
              <th>Vorname</th>
              <th>Nachname</th>
              <th>E-Mail</th>
              <th>Phone</th>
              <th>Adresse</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.firstName}</td>
                <td>{customer.lastName}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{customer.address}</td>
                <td>
                  <Link to={`/edit-customer/${customer.id}`} title="Bearbeiten">
                    <FaEdit className="icon" />
                  </Link>
                  <Link to={`/view-customer/${customer.id}`} title="Anzeigen">
                    <FaEye className="icon" />
                  </Link>
                  <Link to={`/delete-customer/${customer.id}`} title="Löschen">
                    <FaTrash className="icon icon-trash" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <PaginationComponent
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={setPage}
      />
    </div>
  );
};

export default CustomerList;
