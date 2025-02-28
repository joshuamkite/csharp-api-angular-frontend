# Loan Management System - Frontend Documentation

## Project Overview
This Angular application serves as the frontend for a Loan Management API. It provides a responsive, user-friendly interface to manage loan data while implementing modern Angular patterns and security best practices.

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
- **Purpose**: Main navigation header
- **Features**: Responsive design, route highlighting

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

## API Integration

The frontend communicates with the backend via REST API:
- GET, POST, DELETE operations
- JSON data format
- Error handling and user feedback
- Environment-specific API URLs

## Potential Improvements

1. Authentication/Authorization
2. Advanced filtering
3. Error tracking
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