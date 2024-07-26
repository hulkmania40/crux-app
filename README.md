# CrUX History API

This project demonstrates how to use the Chrome UX Report (CrUX) History API to fetch and display user experience metrics for a given URL. The project consists of a Node.js backend and a React TypeScript frontend.

## Project Structure

    .
    crux-api-server/
    ├── crux-api-client/
    │ ├── node_modules/
    │ ├── public/
    │ │ ├── index.html
    │ ├── src/
    │ │ ├── components/
    │ │ │ └── MultiSelectDropdown/
    │ │ │   └── MultiSelectDropdown.tsx
    │ │ ├── services/
    │ │ │ └── cruxApiService.ts
    │ │ ├── App.tsx
    │ │ ├── App.css
    │ │ ├── index.tsx
    │ │ ├── index.css
    │ │ └── react-app-env.d.ts
    │ ├── package.json
    │ ├── package-lock.json
    │ ├── tsconfig.json
    ├── node_modules/
    ├── package.json
    ├── package-lock.json
    ├── server.ts
    └── README.md


## Prerequisites

- Node.js (v14 or higher recommended)
- npm (v6 or higher recommended)

## Setup

### Backend

1. Navigate to the project root directory (`crux-api-server`):
   cd crux-api-server

2. Install the backend dependencies:
    npm install


### Frontend
1. Navigate to the client directory:
    cd crux-api-server/crux-api-client

2. Install the frontend dependencies:
    npm install

### Running the Application

1. Start the backend server from the project root directory:
    node server.js

    This will run your Node.js server on http://localhost:3001.

2. Start the React frontend from the client directory:
    cd crux-api-client
    npm start

    This will run your React app on http://localhost:3000.

### Usage
1. Open your web browser and go to http://localhost:3000.
2. Enter a URL into the input field (e.g., https://www.example.com/).
3. Select a Metric Type from the dropdown to filter out the data.
4. Click the "Get CrUX Data" button.
5. The CrUX data for the specified URL will be fetched and displayed.

## Project Details
### Backend

File: crux-api-server/server.js
Description: The backend server is built with Node.js and Express. It provides an endpoint to fetch CrUX data from the Chrome UX Report API.

### Frontend

File: src/App.tsx
Description: The React component that allows users to input a URL, select a metric, and fetch CrUX data filtered as per the metric(s) selected. If nothing is selected it fetches all the data
File: src/services/cruxApiService.ts
Description: A service that makes HTTP requests to the backend to fetch CrUX data.