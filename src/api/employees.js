import axios from "axios";
import { handleApiError } from "./utils/errorHandler";

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
    const response = await axios.delete(
      `${BASE_URL}/${employeeId}/reassignAndDelete`, {
        params: { newEmployeeId },
    });

    if (response.data.statusCode === 200) {
      return response.data.message;
    } else {
      throw response; // Den ursprünglichen Fehler weitergeben
    }
  } catch (error) {
    handleApiError(error); // Fehlerbehandlung durch die Utility-Funktion
  }
};

export const addEmployee = async (employee) => {
  try {
    const response = await axios.post(BASE_URL, employee);
    if (response.data.statusCode === 201) {
      return response.data.data;
    } else {
      throw response; // Den ursprünglichen Fehler weitergeben
    }
  } catch (error) {
    handleApiError(error); // Fehlerbehandlung durch die Utility-Funktion
  }
};

export const updateEmployee = async (id, employee) => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, employee);
    if (response.data.statusCode === 200) {
      return response.data.data;
    } else {
      throw response; // Den ursprünglichen Fehler weitergeben
    }
  } catch (error) {
    handleApiError(error); // Fehlerbehandlung durch die Utility-Funktion
  }
};

export const getDepartments = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/departments`);
    if (response.data.statusCode === 200) {
      return response.data.data;
    } else {
      throw response; // Den ursprünglichen Fehler weitergeben
    }
  } catch (error) {
    handleApiError(error); // Fehlerbehandlung durch die Utility-Funktion
  }
};
