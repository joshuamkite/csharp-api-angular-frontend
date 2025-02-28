FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copy csproj and restore dependencies
COPY *.csproj ./
RUN dotnet restore

# Copy everything else and build
COPY . ./

# Generate XML documentation explicitly during build
RUN dotnet build -c Release /p:GenerateDocumentationFile=true

RUN dotnet publish -c Release -o out

# Make sure XML is copied to output
RUN find /app -name "*.xml" -type f -exec cp {} /app/out/ \; || true

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/out .

# Install curl for health checks
RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN adduser --disabled-password --gecos "" appuser && \
    chown -R appuser:appuser /app

# Configure application to run on port 8080 instead of 80 (ports < 1024 require root)
ENV ASPNETCORE_URLS=http://+:8080

# Switch to non-root user
USER appuser

EXPOSE 8080
ENTRYPOINT ["dotnet", "LoanManagementApi.dll"]