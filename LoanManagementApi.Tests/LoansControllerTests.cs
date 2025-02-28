using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using LoanManagementApi.Controllers;
using LoanManagementApi.Models;
using Xunit;

namespace LoanManagementApi.Tests
{
    public class LoansControllerTests
    {
        private LoansController GetControllerWithTestData()
        {
            // Create a controller and add some test data
            var controller = new LoansController();
            
            // Use reflection to access and clear the private static _loans field
            var loansField = typeof(LoansController).GetField("_loans", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Static);
            loansField.SetValue(null, new List<Loan>());
            
            // Add test loans
            controller.AddLoan(new Loan { LoanID = "L1001", BorrowerName = "John Doe", FundingAmount = 10000, RepaymentAmount = 12000 });
            controller.AddLoan(new Loan { LoanID = "L1002", BorrowerName = "Jane Smith", FundingAmount = 5000, RepaymentAmount = 5500 });
            controller.AddLoan(new Loan { LoanID = "L1003", BorrowerName = "John Doe", FundingAmount = 15000, RepaymentAmount = 16500 });
            
            return controller;
        }

        [Fact]
        public void AddLoan_WithValidData_ReturnsCreatedResponse()
        {
            // Arrange
            var controller = new LoansController();
            var newLoan = new Loan { LoanID = "L2001", BorrowerName = "New Borrower", FundingAmount = 7500, RepaymentAmount = 8000 };
            
            // Act
            var result = controller.AddLoan(newLoan);
            
            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.Equal(201, createdResult.StatusCode);
            
            var returnValue = Assert.IsType<Loan>(createdResult.Value);
            Assert.Equal(newLoan.LoanID, returnValue.LoanID);
            Assert.Equal(newLoan.BorrowerName, returnValue.BorrowerName);
        }

        [Fact]
        public void AddLoan_WithMissingRequiredFields_ReturnsBadRequest()
        {
            // Arrange
            var controller = new LoansController();
            var invalidLoan = new Loan { LoanID = "", BorrowerName = "", FundingAmount = 1000, RepaymentAmount = 1100 };
            
            // Act
            var result = controller.AddLoan(invalidLoan);
            
            // Assert
            Assert.IsType<BadRequestObjectResult>(result.Result);
        }

        [Fact]
        public void GetLoanById_WithExistingId_ReturnsLoan()
        {
            // Arrange
            var controller = GetControllerWithTestData();
            string loanId = "L1001";
            
            // Act
            var result = controller.GetLoanById(loanId);
            
            // Assert
            var okResult = Assert.IsType<ActionResult<Loan>>(result);
            var returnValue = Assert.IsType<Loan>(okResult.Value);
            Assert.Equal(loanId, returnValue.LoanID);
        }

        [Fact]
        public void GetLoanById_WithNonexistentId_ReturnsNotFound()
        {
            // Arrange
            var controller = GetControllerWithTestData();
            string nonexistentId = "LXXXX";
            
            // Act
            var result = controller.GetLoanById(nonexistentId);
            
            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public void GetLoanByBorrowerName_WithExistingName_ReturnsLoans()
        {
            // Arrange
            var controller = GetControllerWithTestData();
            string borrowerName = "John Doe";
            
            // Act
            var result = controller.GetLoanByBorrowerName(borrowerName);
            
            // Assert
            var okResult = Assert.IsType<ActionResult<IEnumerable<Loan>>>(result);
            var returnValue = Assert.IsType<List<Loan>>(okResult.Value);
            Assert.Equal(2, returnValue.Count);
            Assert.All(returnValue, loan => Assert.Equal(borrowerName, loan.BorrowerName));
        }

        [Fact]
        public void GetLoanByBorrowerName_WithNonexistentName_ReturnsNotFound()
        {
            // Arrange
            var controller = GetControllerWithTestData();
            string nonexistentName = "Nonexistent Person";
            
            // Act
            var result = controller.GetLoanByBorrowerName(nonexistentName);
            
            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public void GetAllLoans_ReturnsAllLoans()
        {
            // Arrange
            var controller = GetControllerWithTestData();
            
            // Act
            var result = controller.GetAllLoans();
            
            // Assert
            var okResult = Assert.IsType<ActionResult<IEnumerable<Loan>>>(result);
            var returnValue = Assert.IsType<List<Loan>>(okResult.Value);
            Assert.Equal(3, returnValue.Count);
        }

        [Fact]
        public void DeleteLoan_WithExistingId_ReturnsNoContent()
        {
            // Arrange
            var controller = GetControllerWithTestData();
            string loanId = "L1002";
            
            // Act
            var result = controller.DeleteLoan(loanId);
            
            // Assert
            Assert.IsType<NoContentResult>(result);
            
            // Verify the loan was actually deleted
            var getResult = controller.GetLoanById(loanId);
            Assert.IsType<NotFoundResult>(getResult.Result);
        }

        [Fact]
        public void DeleteLoan_WithNonexistentId_ReturnsNotFound()
        {
            // Arrange
            var controller = GetControllerWithTestData();
            string nonexistentId = "LXXXX";
            
            // Act
            var result = controller.DeleteLoan(nonexistentId);
            
            // Assert
            Assert.IsType<NotFoundResult>(result);
        }
    }
}