# Loan Management System - Frontend Documentation

## Project Overview
This Angular application serves as the frontend for a Loan Management API. It provides a responsive, user-friendly interface to manage loan data while implementing modern Angular patterns and security best practices.

- [Loan Management System - Frontend Documentation](#loan-management-system---frontend-documentation)
  - [Project Overview](#project-overview)
  - [Technology Stack](#technology-stack)
  - [Architecture Overview](#architecture-overview)
  - [Technical Task Fulfillment](#technical-task-fulfillment)
    - [API Integration](#api-integration)
    - [User Interface Features](#user-interface-features)
    - [UI Improvements](#ui-improvements)
  - [Security Considerations](#security-considerations)
  - [Core Files and Components](#core-files-and-components)
    - [Configuration Files](#configuration-files)
      - [`angular.json`](#angularjson)
      - [`tsconfig.json` \& Related Files](#tsconfigjson--related-files)
      - [`package.json`](#packagejson)
      - [`Dockerfile`](#dockerfile)
      - [`nginx.conf`](#nginxconf)
    - [Core Application Files](#core-application-files)
      - [`src/main.ts`](#srcmaints)
      - [`src/app/app.config.ts`](#srcappappconfigts)
      - [`src/app/app.routes.ts`](#srcappapproutests)
      - [`src/app/app.component.ts`](#srcappappcomponentts)
    - [Models and Services](#models-and-services)
      - [`src/app/models/loan.model.ts`](#srcappmodelsloanmodelts)
      - [`src/app/services/loan.service.ts`](#srcappservicesloanservicets)
    - [Feature Components](#feature-components)
      - [Nav Header Component](#nav-header-component)
      - [Loan List Component](#loan-list-component)
      - [Loan Form Component](#loan-form-component)
      - [Loan Detail Component](#loan-detail-component)
    - [Environment Configuration](#environment-configuration)
      - [`src/environments/*`](#srcenvironments)
  - [Design Patterns Used](#design-patterns-used)
    - [Reactive Forms](#reactive-forms)
    - [Observable Pattern](#observable-pattern)
    - [Container/Presentation Pattern](#containerpresentation-pattern)
    - [Standalone Components](#standalone-components)
  - [Styling Approach](#styling-approach)
    - [SCSS Architecture](#scss-architecture)
    - [Responsive Design](#responsive-design)
  - [Testing Documentation](#testing-documentation)
    - [Testing Framework](#testing-framework)
    - [Test Coverage](#test-coverage)
    - [Core Test Specifications](#core-test-specifications)
      - [NavHeaderComponent Tests](#navheadercomponent-tests)
      - [LoanListComponent Tests](#loanlistcomponent-tests)
      - [LoanFormComponent Tests](#loanformcomponent-tests)
      - [LoanService Tests](#loanservice-tests)
      - [App Routes Tests](#app-routes-tests)
    - [Running Tests](#running-tests)
  - [Docker Deployment](#docker-deployment)
  - [Development Workflow](#development-workflow)
  - [Potential Improvements](#potential-improvements)
  - [Project Structure](#project-structure)


## Technology Stack
- **Angular 19.1.7** - Latest version with performance improvements
- **Angular Material** - For modern, accessible UI components
- **RxJS** - For reactive programming patterns
- **TypeScript 5.5+** - For type safety and modern language features
- **Docker** - For containerization and easy deployment
- **Nginx** - As a lightweight web server for production

## Architecture Overview
The application follows a modern Angular architecture with:
- **Standalone Components** - Latest Angular pattern for better modularity
- **Service-based Data Management** - Centralized services for API communication
- **Reactive Data Handling** - Using Observables for state management
- **Responsive Design** - Mobile-first approach for all screen sizes

## Technical Task Fulfillment

This application fully implements the requirements from the technical task:

### API Integration
The frontend communicates with all required API endpoints:
- **GET /loans** - Fetch all loans (implemented in loan-list component)
- **GET /loans/{id}** - Get a specific loan by ID (implemented in loan-detail component)
- **GET /loans?borrowerName={name}** - Search loans by borrower name (implemented in loan-list search functionality)
- **POST /loans** - Create a new loan (implemented via the "New Loan" navigation button)
- **DELETE /loans/{id}** - Delete a loan (implemented in the loan-list actions column)

### User Interface Features
- **Navigation** - Clean navigation bar with "Loan Management" brand and "View Loans"/"New Loan" navigation options
- **Loan Listing** - Table display of all loans with ID, borrower name, funding amount, and repayment amount
- **Loan Creation** - Form accessible via the "New Loan" navigation button
- **Loan Details** - Detailed view of individual loans
- **Loan Deletion** - Delete functionality with confirmation
- **Search** - Filter loans by borrower name
- **Error Handling** - Proper error displays and retry options
- **Empty States** - User-friendly empty state with create option

### UI Improvements
- **Streamlined Navigation** - Eliminated redundant "Add New Loan" button from the loan list, keeping only the navigation bar button for a cleaner interface
- **Responsive Design** - Mobile-first approach with proper layout adjustments for different screen sizes
- **Visual Feedback** - Loading states, error messages, and success notifications
- **Material Design** - Consistent styling with Angular Material components

## Security Considerations
- **Non-root Docker User** - Running as unprivileged user for security
- **Non-privileged Port** - Using port 8080 instead of 80 in container
- **Input Validation** - Form validation to prevent injection attacks
- **HTTPOnly Cookies** - For secure authentication (when implemented)
- **Docker Multi-stage Builds** - Minimizing attack surface in final image

## Core Files and Components

### Configuration Files

#### `angular.json`
- Defines project structure and build configurations
- Configures Angular Material themes and assets
- Sets up production optimization settings

#### `tsconfig.json` & Related Files
- TypeScript configuration for Angular
- Path mappings and compiler options
- Strict type checking enabled

#### `package.json`
- Defines dependencies and scripts
- Angular 19.1.7 and Material UI libraries
- TypeScript 5.5+ as required by Angular 19

#### `Dockerfile`
- Multi-stage build for optimized image size
- First stage builds Angular app with Node.js
- Second stage serves with Nginx
- Configured to run as non-root user

#### `nginx.conf`
- Proxy configuration for API communication
- Proper caching headers for static assets
- Angular routing support (HTML5 history mode)
- Gzip compression for better performance

### Core Application Files

#### `src/main.ts`
- Application entry point
- Bootstraps the Angular application
- Applies global configurations

#### `src/app/app.config.ts`
- Central application configuration
- Provides services and modules
- Configures routing and animations

#### `src/app/app.routes.ts`
- Defines application routes
- Maps paths to components
- Handles redirects and wild card routes

#### `src/app/app.component.ts`
- Root component that bootstraps other components
- Minimal, focused on layout and routing
- Uses standalone component pattern

### Models and Services

#### `src/app/models/loan.model.ts`
- TypeScript interface for Loan data
- Defines shape of loan entities
- Ensures type safety across application

#### `src/app/services/loan.service.ts`
- Centralized API communication
- Uses Angular HttpClient for requests
- Implements CRUD operations for loans
- Error handling and response mapping

### Feature Components

#### Nav Header Component
- **Files**: `src/app/components/nav-header/*`
- **Purpose**: Main navigation header with "Loan Management" brand and navigation options
- **Features**: Responsive design, route highlighting, "New Loan" button for loan creation

#### Loan List Component
- **Files**: `src/app/components/loan-list/*`
- **Purpose**: Displays all loans in a table
- **Features**: Sorting, filtering, pagination, search, delete functionality

#### Loan Form Component
- **Files**: `src/app/components/loan-form/*`
- **Purpose**: Create new loans with validation
- **Features**: Real-time validation, error messages, form submission

#### Loan Detail Component
- **Files**: `src/app/components/loan-detail/*`
- **Purpose**: View detailed loan information
- **Features**: Display calculated fields (interest rate), deletion

### Environment Configuration

#### `src/environments/*`
- Environment-specific configuration
- API URL configuration for dev/prod
- Feature flags and settings

## Design Patterns Used

### Reactive Forms
Used in the loan form for robust validation and state management.

### Observable Pattern
Used throughout for asynchronous operations and data streams.

### Container/Presentation Pattern
Components are structured to separate data management from presentation.

### Standalone Components
Modern Angular pattern used to reduce bundle size and improve modularity.

## Styling Approach

### SCSS Architecture
- Component-scoped styles for isolation
- Global styles for consistency
- Angular Material theming used for cohesive design

### Responsive Design
- Mobile-first approach
- Flexbox and Grid for layouts
- Material breakpoints for consistent responsiveness

---------------

## Testing Documentation

### Testing Framework
- **Jasmine 4.6.1** - Used as the primary testing framework
- **Karma 6.4.4** - Test runner for executing tests in browser environments

### Test Coverage
The application has moderate test coverage with 27 test specifications, all passing successfully. Tests are organized by component and verify that the relevant part of the application meets the requirements specified in the technical task.

### Core Test Specifications

#### NavHeaderComponent Tests
- Verify component creation
- Confirm brand link navigates to home
- Validate "View Loans" navigation link functionality
- Ensure active class is applied correctly when route is active

#### LoanListComponent Tests
- Verify component creation
- Handle API errors during loan loading
- Properly clear search and reload all loans
- Load loans on initialization
- Navigate to loan details when view button is clicked
- Filter loans by borrower name
- Display deletion confirmation dialog
- Format currency correctly

#### LoanFormComponent Tests
- Navigate back to loans list when cancel is clicked
- Verify component creation
- Initialize with an empty form
- Require funding amount greater than zero
- Require borrower name

#### LoanService Tests
- Service should be created
- Handle errors when the API fails
- Delete a loan via DELETE method
- Retrieve all loans via GET
- Retrieve a loan by ID via GET

#### App Routes Tests
- Redirect unknown routes to loans list
- Contain route to loan details
- Contain empty path to loans
- Contain route to loan list
- Contain route to create loan

### Running Tests
To run the tests locally:
```bash
# Navigate to the frontend directory
cd frontend

# Run tests with Karma
npm test
```

## Docker Deployment

The application is containerized using Docker for easy deployment:

```bash
# Build the Docker image
docker build -t loan-management-frontend .

# Run the container
docker run -p 80:8080 loan-management-frontend
```

With Docker Compose:
```bash
docker-compose up -d
```

## Development Workflow

To run locally:
```bash
# Install dependencies
npm install

# Start development server
npm start
```

## Potential Improvements

1. Authentication/Authorization with Auth0 (bonus requirement)
2. Advanced filtering options
3. Error tracking integration
4. Unit and E2E testing
5. Internationalization (i18n)
6. Accessibility improvements
7. State management (NGRX/NGXS)

## Project Structure
```
frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── loan-list/
│   │   │   ├── loan-form/
│   │   │   ├── loan-detail/
│   │   │   └── nav-header/
│   │   ├── models/
│   │   │   └── loan.model.ts
│   │   ├── services/
│   │   │   └── loan.service.ts
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── assets/
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.scss
├── Dockerfile
├── nginx.conf
├── package.json
├── tsconfig.json
├── tsconfig.app.json
└── tsconfig.spec.json
```