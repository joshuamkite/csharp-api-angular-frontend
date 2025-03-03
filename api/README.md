# Loan Management API

A RESTful Web API for managing loan information, created as part of a coding challenge.

## Technical Task Requirements

### Core Requirements
- **API Properties:**
  - LoanID
  - Borrower Name
- **API Methods:**
  - POST - Adding a loan
  - GET - Get a loan by Borrower Name
  - DELETE - Delete a loan by LoanID

### Bonus Requirements (Implemented)
1. **Tech Stack:**
   - C# (.NET Core 9.0)
2. **In-Memory Data Store:**
   - Loans stored in memory while API is running
3. **Additional API Properties:**
   - Repayment Amount
   - Funding Amount
4. **Additional API Methods:**
   - GET - Get a Loan by LoanID
   - GET - Get all loans
5. **Tests**
   - The solution includes a comprehensive test suite using xUnit.

## Technical Implementation Details

### Dependencies
- .NET 9.0
- Microsoft.AspNetCore.OpenApi (Version 9.0.0)
- Swashbuckle.AspNetCore (Version 7.3.1)

### API Documentation
- XML comments added to all API methods in `Controllers/LoansController.cs`
- Example values provided in `Models/Loan.cs` to enhance Swagger documentation
- Manual configuration in `LoanManagementApi.csproj` to ensure XML comments are generated and included in Swagger

### Security & Best Practices
- Dockerfile configured to run as non-root user
- Service runs on port 8080 internally (non-privileged port)
- CORS policies configured to allow integration with frontend applications

## Running the Application

### Using Docker
```bash
# Build the Docker image
docker build -t loan-management-api .

# Run the container
docker run -p 9090:8080 loan-management-api
```

### Using .NET CLI
```bash
# Restore dependencies
dotnet restore

# Build the application
dotnet build

# Run the application
dotnet run
```

## API Endpoints

Once running, the API is available at:
- API Base URL: `http://localhost:9090/api/loans`
- Swagger Documentation: `http://localhost:9090/swagger/index.html`
- Health Check: `http://localhost:9090/health`

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/loans` | Get all loans |
| GET | `/api/loans/{id}` | Get loan by LoanID |
| GET | `/api/loans/borrower/{borrowerName}` | Get loans by borrower name |
| POST | `/api/loans` | Create a new loan |
| DELETE | `/api/loans/{id}` | Delete a loan by LoanID |

## Data Persistence

Note that this API uses an in-memory data store, so all data will be lost when the application stops running. This is per the requirements of the coding challenge.

## Testing

The solution includes a comprehensive test suite using xUnit. The tests cover:

- Adding loans with valid and invalid data
- Retrieving loans by ID
- Retrieving loans by borrower name
- Deleting loans
- Getting all loans

To run the tests:

```bash
# Navigate to the test project directory
cd LoanManagementApi.Tests

# Run the tests
dotnet test

# On Mac with Homebrew installation, you may need to use the explicit path
/opt/homebrew/opt/dotnet/bin/dotnet test

# For verbose output with detailed test information
dotnet test --logger "console;verbosity=detailed"
```

For more verbose output, which can be helpful for debugging, you can add various verbosity levels:
- `minimal` - Shows basic test results
- `normal` - Shows summary information
- `detailed` - Shows all test output information
- `diagnostic` - Shows full diagnostic information including internal xUnit messages

Example of diagnostic output:
```bash
dotnet test --logger "console;verbosity=diagnostic"
```

All 9 tests should pass successfully, validating the functionality of the API endpoints:
- ✅ Creating loans with valid data
- ✅ Validating required fields
- ✅ Retrieving loans by ID
- ✅ Handling non-existent loan IDs
- ✅ Retrieving loans by borrower name
- ✅ Retrieving all loans
- ✅ Deleting loans

As a result of the testing process, we identified and fixed nullability warnings in the `Loan` model by adding the `required` modifier to string properties, enhancing the robustness of the code.

## Health Checks

A health check endpoint is available at `http://localhost:9090/health` which returns a 200 OK response when the service is running properly. This can be used for container orchestration and monitoring.

## Potential Improvements

For a production environment, the following improvements could be implemented:

* Add a PUT endpoint to update an existing loan
* Implement global exception handling middleware
* Add authentication/authorization mechanisms
* Replace in-memory storage with a persistent database
* Add more input validation and error handling
* Implement logging and monitoring
* Add integration tests to complement the existing unit tests