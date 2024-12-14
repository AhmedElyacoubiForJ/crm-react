import axios from 'axios';
import { handleApiError } from './utils/errorHandler';

const BASE_URL = 'http://localhost:8080/api/notes';

export const getNotes = async (page, size, search) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        page: page,
        size: size,
        search: search,
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
