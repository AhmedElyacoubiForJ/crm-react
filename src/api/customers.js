import axios from 'axios';
import { handleApiError } from './utils/errorHandler';

const BASE_URL = 'http://localhost:8080/api/customers';

// Funktion zum Abrufen der Kundendaten
export const getCustomers = async (page, size, search) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        page: page,     // Seite
        size: size,     // Größe der Seite
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
