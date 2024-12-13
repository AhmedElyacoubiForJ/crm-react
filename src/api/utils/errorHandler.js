export const handleApiError = (error) => {
    if (error.response) {
        console.error('Fehlerstatus:', error.response.status);
        console.error('Fehlermeldung:', error.response.data.errors);
        throw error; // Weitergabe des ursprünglichen Fehlers
    } else if (error.request) {
        console.error('Keine Antwort erhalten:', error.request);
        throw new Error('Server ist nicht erreichbar. Bitte versuchen Sie es später erneut.');
    } else {
        console.error('Fehler beim einrichten der Anfrage:', error.message);
        throw new Error('Ein unerwarteter Fehler ist aufgetreten.');
    }
};