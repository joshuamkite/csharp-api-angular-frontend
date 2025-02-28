# Loan Management Client

This is an Angular-based frontend application for the Loan Management API. It provides a user-friendly interface to interact with all API endpoints.

## Features

- View all loans with sorting and pagination
- Search loans by borrower name
- Add new loans with validation
- View loan details with calculated metrics (interest, interest rate)
- Delete loans with confirmation
- Responsive design that works on all devices
- Modern UI with Angular Material components

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+
- Angular CLI 19+

## Development Setup

### Install dependencies

```bash
npm install
```

### Start development server

```bash
ng serve
```

This will start a development server at http://localhost:4200.

## Building for Production

```bash
ng build --configuration production
```

## Docker Deployment

The application is dockerized for easy deployment:

```bash
# Build the Docker image
docker build -t loan-management-client .

# Run the container
docker run -p 80:80 loan-management-client
```

## Using with Docker Compose

The project includes a docker-compose.yml file that will start both the API and the frontend:

```bash
docker-compose up -d
```

This will:
- Build and start the API at http://localhost:9090
- Build and start the frontend at http://localhost:80
- Configure proper networking between the services

## Project Structure

- `src/app/components`: Angular components organized by feature
- `src/app/models`: TypeScript interfaces for data models
- `src/app/services`: Services for API communication
- `src/environments`: Environment configuration

## API Integration

The application communicates with the Loan Management API through the LoanService. The API URL is configurable in the environment files.