# CRM Frontend

## Überblick

Dies ist das Frontend eines CRM (Customer Relationship Management) Systems, das mit React entwickelt
wurde. Es ermöglicht Benutzern die Verwaltung von Kunden, Mitarbeitern und Notizen. Die Anwendung bietet Funktionen wie Suche, Paginierung und die Bearbeitung von Kundendaten.

## Inhaltsverzeichnis

- [CRM Frontend](#crm-frontend)
  - [Überblick](#überblick)
  - [Inhaltsverzeichnis](#inhaltsverzeichnis)
  - [Installation](#installation)
  - [Verwendung](#verwendung)
  - [API-Endpunkte](#api-endpunkte)
  - [Verzeichnisstruktur](#verzeichnisstruktur)
  - [Backend-Repository](#backend-repository)

## Installation

1. Klone das Repository:
```bash
   git clone https://github.com/dein-benutzername/crm-frontend.git
```
2. Navigiere in das Projektverzeichnis:
```bash
   cd crm-frontend
```
3. Installiere die Abhängigkeiten:
```bash
   npm install
```

## Verwendung

1. Starte die Entwicklungsumgebung:
```bash
   npm start
```
2. Öffne [http://localhost:3000](http://localhost:3000) in deinem Browser, um die Anwendung zu sehen.

## API-Endpunkte

Die Anwendung verwendet verschiedene API-Endpunkte, um Daten von einem Backend-Server abzurufen. Diese Endpunkte sind in separate Dateien unter `src/api` organisiert:

- `customers.js`: API-Endpunkte für Kunden
- `employees.js`: API-Endpunkte für Mitarbeiter
- `notes.js`: API-Endpunkte für Notizen

Beispiel für einen API-Aufruf:
```javascript
import { getCustomers } from './api/customers';

const fetchData = async () => {
  const response = await getCustomers(page, size, search);
  console.log(response);
};
```

## Verzeichnisstruktur

```plaintext
src/
├── api/                             // API-Aufrufe
│   ├── customers.js
│   ├── employees.js
│   └── notes.js
├── components/
│   ├── assets/                      // Statische Dateien (Bilder, Icons, etc.)
│   │   └── spinner.gif
│   ├── common/                      // Wiederverwendbare Komponenten
│   │   ├── NavBar.jsx
│   │   ├── PaginationComponent.jsx
│   │   ├── SearchComponent.jsx
│   │   └── Spinner.jsx
│   └── pages/                       // Seitenkomponenten
│       ├── CustomerList.jsx
│       ├── EmployeeList.jsx
│       ├── ShowEmployee.jsx
│       ├── EditEmployee.jsx
│       └── DeleteEmployee.jsx
├── App.js                           // Haupt-App-Komponente
├── App.css                          // Haupt-CSS-Datei
├── Home.jsx                         // Startseite
└── index.js                         // Einstiegspunkt

```

## Backend-Repository
Das Backend-Repository für dieses Projekt findest du hier: [CRM Backend](https://github.com/AhmedElyacoubiForJ/crm)
