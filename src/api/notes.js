import axios from 'axios';

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
    return response.data;
  } catch (error) {
    throw new Error('Fehler beim Abrufen der Notizen');
  }
};
