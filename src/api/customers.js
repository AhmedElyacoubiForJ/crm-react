import axios from "axios";
import { handleApiError } from "./utils/errorHandler";

const BASE_URL = "http://localhost:8080/api/customers";

// Funktion zum Abrufen der Kundendaten
export const getCustomers = async (page, size, search) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        page: page, // Seite
        size: size, // Größe der Seite
        search: search, // Suchbegriff
      },
    });
    if (response.data.statusCode === 200) {
      return response.data;
    } else {
      throw response; // Den ursprünglichen Fehler weitergeben
    }
  } catch (error) {
    handleApiError(error); // Fehlerbehandlung durch die Utility-Funktion
  }
};

// Funktion zum Abrufen der Kundendaten basierend auf der Mitarbeiter-ID
export const getCustomersByEmployeeId = async (employeeId) => {
  try {
    const response = await axios.get(`${BASE_URL}/for/${employeeId}`); // Anpassung des Endpoints
    if (response.status === 200) { // Überprüfen des HTTP-Statuscodes
      return response.data;
    } else {
      throw new Error("Fehler beim Abrufen der Kundendaten");
    }
  } catch (error) {
    handleApiError(error); // Fehlerbehandlung durch die Utility-Funktion
  }
};


export const addCustomer = async (customer, employeeId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}?employeeId=${employeeId}`,
      customer
    );
    if (response.data.statusCode === 201) {
      return response.data.data;
    } else {
      throw response; // Den ursprünglichen Fehler weitergeben
    }
  } catch (error) {
    handleApiError(error); // Fehlerbehandlung durch die Utility-Funktion
  }
};

// Funktion zum Abrufen eines einzelnen Kunden
export const getCustomerById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    if (response.data.statusCode === 200) {
      return response.data.data;
    } else {
      throw response; // Den ursprünglichen Fehler weitergeben
    }
  } catch (error) {
    handleApiError(error); // Fehlerbehandlung durch die Utility-Funktion
  }
};

// Funktion zum Aktualisieren eines Kunden
export const updateCustomer = async (id, customer) => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, customer);
    if (response.data.statusCode === 200) {
      return response.data.data;
    } else {
      throw response;
    }
  } catch (error) {
    handleApiError(error);
  }
};
