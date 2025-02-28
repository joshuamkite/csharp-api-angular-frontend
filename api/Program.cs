using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.OpenApi.Models;
using System.IO;
using System.Reflection; 

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Add Swagger documentation
builder.Services.AddSwaggerGen(options =>
{
    // Set up Swagger document
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "Loan Management API", Version = "v1" });

    try
    {
        // Include XML comments with additional debugging
        var xmlFilename = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
        var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFilename);
        Console.WriteLine($"Looking for XML file at: {xmlPath}");
        
        if (File.Exists(xmlPath))
        {
            Console.WriteLine($"XML file found. Size: {new FileInfo(xmlPath).Length} bytes");
            // Print first few lines to verify content
            var xmlContent = File.ReadLines(xmlPath).Take(10);
            Console.WriteLine("XML content preview:");
            foreach (var line in xmlContent)
            {
                Console.WriteLine(line);
            }
            options.IncludeXmlComments(xmlPath);
            Console.WriteLine("XML comments included in Swagger");
        }
        else
        {
            Console.WriteLine($"XML file not found at: {xmlPath}");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error loading XML documentation: {ex}");
    }
});

// Add CORS to allow requests from Streamlit
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

// Add health checks
builder.Services.AddHealthChecks();

var app = builder.Build();

// Configure the HTTP request pipeline
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowAll");

// Add a basic health endpoint that returns 200 OK
app.MapGet("/health", () => "Healthy");

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();