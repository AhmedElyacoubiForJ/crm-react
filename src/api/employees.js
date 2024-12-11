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
    return response.data;
  } catch (error) {
    throw new Error("Fehler beim Laden der Mitarbeiterdaten");
  }
};

export const reassignAndDeleteEmployee = async (employeeId, newEmployeeId) => {
  try {
    await axios.delete(`${BASE_URL}/${employeeId}/reassignAndDelete`, {
      params: {
        newEmployeeId: newEmployeeId
      }
    });
  } catch (error) {
    throw new Error("Fehler beim Löschen und Neuzuweisen der Mitarbeiterdaten");
  }
};

export const addEmployee = async (employee) => {
  try {
    const response = await axios.post(BASE_URL, employee);
    return response.data;
  } catch (error) {
    throw new Error("Fehler beim Erstellen einer Mitarbeiterdaten");
  }
};

export const updateEmployee = async (id, employee) => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, employee);
    return response.data;
  } catch (error) {
    throw new Error("Fehler beim Aktualisieren der Mitarbeiterdaten");
  }
};
