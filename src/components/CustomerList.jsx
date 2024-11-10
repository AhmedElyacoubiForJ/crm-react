import React, { useState, useEffect } from 'react';
// how to import botstrap
import axios from 'axios';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8080/api/customers', {
          params: {
            page: page,
            size: size,
            search: search
          }
        });
        setCustomers(response.data.data.content); // Passen Sie den Pfad basierend auf Ihrer APIResponse-Struktur an
        setLoading(false);
        console.log(response.data.data.content); // Überprüfen Sie die Struktur der Daten in der Konsole
      } catch (error) {
        setError('Fehler beim Abrufen der Kundendaten');
        setLoading(false);
      }
    };

    fetchData();
  }, [page, size, search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div className='container mt-4'>
      <h2 className='mb-4'>Kundenliste</h2>
      <input
        type="text"
        value={search}
        onChange={handleSearchChange}
        placeholder="Suche nach Vorname oder E-Mail..."
      />
      {loading ? (
        <p>Lade Customers...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table className="table table-hover table-condensed">
          <thead className='table-dark'>
            <tr>
              <th>Vorname</th>
              <th>Nachname</th>
              <th>E-Mail</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.firstName}</td>
                <td>{customer.lastName}</td>
                <td>{customer.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div>
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>Vorherige Seite</button>
        <button onClick={() => setPage(page + 1)}>Nächste Seite</button>
      </div>
    </div>
  );
};

export default CustomerList;
