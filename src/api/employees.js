import axios from "axios";

const BASE_URL = "http://localhost:8080/api/employees";

export const getEmployees = async (page, size, search) => {
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
    throw new Error("Fehler beim Abrufen der Mitarbeiterdaten");
  }
};

export const getEmployee = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data.data;
  } catch (error) {
    throw new Error("Fehler beim Laden der Mitarbeiterdaten");
  }
};

export const reassignAndDeleteEmployee = async (employeeId, newEmployeeId) => {
  try {
    await axios.delete(`${BASE_URL}/${employeeId}/reassignAndDelete`, {
      params: {
        newEmployeeId: newEmployeeId,
      },
    });
  } catch (error) {
    throw new Error("Fehler beim Löschen und Neuzuweisen der Mitarbeiterdaten");
  }
};

export const addEmployee = async (employee) => {
  try {
    const response = await axios.post(BASE_URL, employee);
    if (response.data.statusCode === 201) {
      console.log(response.data.data);
      return response.data.data;
    } else {
      throw new Error(response.data.message);
    }
    
  } catch (error) {
    if (error.response) {
      // Server-Antwort mit Statuscode außerhalb des Bereichs 2xx
      // Der Server hat eine Antwort zurückgegeben
      console.error('Fehlerstatus:', error.response.status);
      console.error('Fehlermeldung:', error.response.data.errors);
      throw error;
    } else if (error.request) {
      // Anfrage wurde gesendet, aber keine Antwort erhalten
      console.error("No response received:", error.request);
      throw new Error(
        "Server ist nicht erreichbar. Bitte versuchen Sie es später erneut."
      );
    } else {
      // Ein Fehler ist beim Einrichten der Anfrage aufgetreten
      console.error("Error setting up request:", error.message);
      throw new Error("Ein unerwarteter Fehler ist aufgetreten.");
    }
  }
};

export const updateEmployee = async (id, employee) => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, employee);
    return response.data.data;
  } catch (error) {
    throw new Error("Fehler beim Aktualisieren der Mitarbeiterdaten");
  }
};

export const getDepartments = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/departments`);
    return response.data.data;
  } catch (error) {
    throw new Error("Fehler beim Abrufen der Abteilungen");
  }
};
