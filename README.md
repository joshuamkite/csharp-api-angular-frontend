# Loan Management System

A full-stack containerized application developed in response to a technical challenge for managing loan information, built with CSharp .NET Core 9.0 API and Angular frontend. Dockerised for local development and deployment to kubernetes.

- [Loan Management System](#loan-management-system)
  - [Technical Challenge Overview](#technical-challenge-overview)
  - [Also included](#also-included)
  - [Repository Structure](#repository-structure)
  - [Technical Task 1: Web API](#technical-task-1-web-api)
    - [Required API Properties:](#required-api-properties)
    - [Required API Methods:](#required-api-methods)
    - [Implemented Bonus Features:](#implemented-bonus-features)
    - [Also included](#also-included-1)
  - [Technical Task 2: Single Page Website](#technical-task-2-single-page-website)
    - [Implemented Bonus Features:](#implemented-bonus-features-1)
    - [Also included](#also-included-2)
  - [Technical Task 3: Containerization](#technical-task-3-containerization)
    - [Implemented Bonus Features:](#implemented-bonus-features-2)
  - [Local Development](#local-development)
  - [CI/CD Pipeline](#cicd-pipeline)
    - [Infrastructure Management](#infrastructure-management)
  - [Production Deployment](#production-deployment)
    - [Prerequisites](#prerequisites)
    - [Deploying with Helm (Technical Task 3 Bonus)](#deploying-with-helm-technical-task-3-bonus)
    - [Accessing the Deployed Application](#accessing-the-deployed-application)
  - [Testing](#testing)
    - [Backend Tests](#backend-tests)
    - [Frontend Tests](#frontend-tests)
  - [Security Considerations](#security-considerations)
  - [Implementation Highlights](#implementation-highlights)
- [Helm](#helm)
  - [Ingress Configuration](#ingress-configuration)
    - [Path-Based Routing](#path-based-routing)
    - [Health Checks](#health-checks)
    - [Environment URLs](#environment-urls)
    - [Implementation Details](#implementation-details)


## Technical Challenge Overview

This project implements the solution to a three-part technical challenge:

1. **Web API:** RESTful API for managing loan information
2. **Single Page Website:** Frontend interface for interacting with the API
3. **Containerization:** Docker and Kubernetes deployment

## Also included

1. ECR public gallery for container images
2. GitHub Actions for CI/CD
3. **Tests:** Comprehensive tests for frontend and backend - both locally and in GitHub actions

## Repository Structure

```
.
├── api/                 # .NET Core 9.0 Backend API (Technical Task 1)
├── frontend/            # Angular Frontend Application (Technical Task 2)
├── helm/                # Kubernetes Helm Charts (Technical Task 3 - Bonus)
│   └── loan-management/
├── terraform/           # AWS ECR Public Gallery Infrastructure
├── LoanManagementApi.Tests/ # API Unit Tests
└── docker-compose.yml   # Local Development Configuration
```

## Technical Task 1: Web API

The backend API implements all required features using .NET Core 9.0:

### Required API Properties:
- LoanID
- Borrower Name

### Required API Methods:
- POST - Adding a loan
- GET - Get a loan by Borrower Name
- DELETE - Delete a loan by LoanID

### Implemented Bonus Features:
- Tech Stack: C# (.NET Core 9.0)
- In-Memory Data Store for loans while the API is running
- Additional API Properties: Repayment Amount, Funding Amount
- Additional API Methods: GET by LoanID, GET all loans

### Also included
- GitHub actions build 
- Local and CI/CD test suite

For detailed API documentation, see the [API README](./api/README.md).

## Technical Task 2: Single Page Website

The frontend Angular application allows users to interact with all API methods:

- Form for adding new loans
- Display of all loans
- Search functionality by Borrower Name and LoanID
- Delete functionality for loans

### Implemented Bonus Features:
- Tech Stack: Angular
- Responsive design with clean UI

### Also included
- GitHub actions build 
- Local and CI/CD test suite

> **Note:** User authentication with Auth0 was not implemented due to time constraints.

For more information about the frontend, see the [Frontend README](./frontend/README.md).

## Technical Task 3: Containerization

This project includes complete containerization with Docker and Kubernetes deployment:

- Dockerfiles for both API and Website components
- Docker images published to AWS ECR Public Gallery - see [Terraform README](./terraform/README.md)
- Kubernetes configuration via Helm charts

### Implemented Bonus Features:
- Docker images pushed to AWS ECR Public Gallery
- Kubernetes deployment configured for AWS EKS
- Application exposed to internet via AWS ALB
- Helm charts for managing Kubernetes releases

## Local Development

For local development, Docker Compose is provided to run both the API and frontend services:

```bash
# Start all services
docker compose up -d

# Access the services
Frontend: http://localhost:80
API: http://localhost:9090/api/loans
Swagger: http://localhost:9090/swagger/index.html
```

## CI/CD Pipeline

This project uses GitHub Actions to build and publish Docker images to ECR Public Gallery. The workflows:

1. Run both frontend and backend test suites
2. Build the API and frontend containers
3. Push images to the ECR Public Gallery repositories
4. Tag images with Git commit SHA and 'latest'

Public images are available at:
```
public.ecr.aws/o7k2q9z1/loan-management-api:latest
public.ecr.aws/o7k2q9z1/loan-management-frontend:latest
```

### Infrastructure Management

- **Terraform**: The Terraform configuration for AWS ECR Public Gallery is designed to be run locally, not through GitHub Actions. This provides control over infrastructure deployment and avoids storing sensitive credentials in the CI pipeline.

- **Helm Charts**: The Helm chart is included in the repository for deployment flexibility but is not published to a Helm registry.

## Production Deployment

### Prerequisites

For production deployment, follow the instructions in the [eks-argocd-crossplane](https://github.com/joshuamkite/eks-argocd-crossplane) repository up to and including the "Installing the Monitoring ApplicationSet" step. This deploys a small EKS cluster with Terraform, and sets up Prometheus, Grafana and AWS Load Balancer Controller (required for ingress of `loan-management` stack). This deployment applies NACLs to restrict access to approved CIDRs.

### Deploying with Helm (Technical Task 3 Bonus)

After setting up the EKS cluster with ArgoCD as described in the prerequisites:

```bash
# Clone this repository
git clone <this-repository-url>
cd <repository-folder>

# Install the Helm chart
helm upgrade --install loan-management ./helm/loan-management
```

This will deploy:
- The API service with health checks
- The frontend service
- An AWS Application Load Balancer with appropriate routing

### Accessing the Deployed Application

Once deployed, the application will be available at:
- Frontend UI: `http://<load-balancer-hostname>/`
- Swagger UI: `http://<load-balancer-hostname>/swagger/index.html`

## Testing

The solution includes comprehensive test suites for both frontend and backend components:

### Backend Tests

The API includes a test suite using xUnit:

```bash
# Navigate to the test project directory
cd LoanManagementApi.Tests

# Run the tests
dotnet test
```

### Frontend Tests

The Angular frontend includes unit and integration tests:

```bash
# Navigate to the frontend directory
cd frontend

# Run tests
npm test
```

All tests are incorporated into GitHub Actions workflows to ensure code quality on every push.

For more details on testing, see the [API README](./api/README.md) and [Frontend README](./frontend/README.md).

## Security Considerations

- Services run as non-root users
- Containers use non-privileged ports
- AWS ECR repositories are secured with GitHub Actions OIDC integration
- AWS Load Balancer Controller authenticates using IAM Roles For Service Accounts (IRSA)
- Kubernetes ingress is secured with appropriate network policies

## Implementation Highlights

- **API**: C# (.NET Core 9.0) with in-memory data store, complete with Swagger documentation
- **Frontend**: Angular SPA with responsive design
- **Infrastructure**: 
  - AWS ECR Public Gallery repositories via Terraform
  - Kubernetes configuration via Helm charts
  - AWS Application Load Balancer for internet exposure
  - Health checks and resource management

# Helm

## Ingress Configuration

The application is exposed using AWS Application Load Balancer (ALB) through Kubernetes ingress resources. The ingress is configured to route traffic to the frontend and API services based on URL paths.

### Path-Based Routing

| Path Pattern | Service |
|--------------|---------|
| `/swagger/*` | loan-management-api |
| `/*` | loan-management-frontend |

### Health Checks

The ALB is configured with health checks:

- HTTP protocol for all services
- Custom health check path for Swagger endpoints
- Success codes configured to accept 200-399 response codes
- Health check intervals set to 30 seconds with 5-second timeouts

### Environment URLs

- Frontend UI: `http://<load-balancer-hostname>/`
- Swagger UI: `http://<load-balancer-hostname>/swagger/index.html`

### Implementation Details

- The load balancer is configured as internet-facing
- Target groups use IP-based routing
