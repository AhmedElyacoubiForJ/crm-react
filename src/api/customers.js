import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/customers';

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
    return response.data;
  } catch (error) {
    throw new Error('Fehler beim Abrufen der Kundendaten');
  }
};
