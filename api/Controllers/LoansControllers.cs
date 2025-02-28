using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using LoanManagementApi.Models;

namespace LoanManagementApi.Controllers
{
    /// <summary>
    /// API Controller for managing loan information
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class LoansController : ControllerBase
    {
        // In-memory data store
        private static List<Loan> _loans = new List<Loan>();

        /// <summary>
        /// Creates a new loan record
        /// </summary>
        /// <param name="loan">The loan information to add</param>
        /// <returns>The created loan information</returns>
        /// <response code="201">Returns the newly created loan</response>
        /// <response code="400">If the loan data is invalid</response>
        [HttpPost]
        [ProducesResponseType(typeof(Loan), 201)]
        [ProducesResponseType(400)]
        public ActionResult<Loan> AddLoan(Loan loan)
        {
            if (string.IsNullOrEmpty(loan.LoanID) || string.IsNullOrEmpty(loan.BorrowerName))
            {
                return BadRequest("LoanID and BorrowerName are required.");
            }

            _loans.Add(loan);
            return CreatedAtAction(nameof(GetLoanById), new { id = loan.LoanID }, loan);
        }

        /// <summary>
        /// Retrieves loans by borrower name
        /// </summary>
        /// <param name="borrowerName">Name of the borrower to search for</param>
        /// <returns>A list of loans for the specified borrower</returns>
        /// <response code="200">Returns the loans for the borrower</response>
        /// <response code="404">If no loans are found for the borrower</response>
        [HttpGet("borrower/{borrowerName}")]
        [ProducesResponseType(typeof(IEnumerable<Loan>), 200)]
        [ProducesResponseType(404)]
        public ActionResult<IEnumerable<Loan>> GetLoanByBorrowerName(string borrowerName)
        {
            var loans = _loans.Where(l => l.BorrowerName.Equals(borrowerName, StringComparison.OrdinalIgnoreCase)).ToList();

            if (loans.Count == 0)
            {
                return NotFound();
            }

            return loans;
        }

        /// <summary>
        /// Deletes a loan by its ID
        /// </summary>
        /// <param name="id">The LoanID to delete</param>
        /// <returns>No content if successful</returns>
        /// <response code="204">If the loan was successfully deleted</response>
        /// <response code="404">If no loan with the specified ID was found</response>
        [HttpDelete("{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public ActionResult DeleteLoan(string id)
        {
            var loan = _loans.FirstOrDefault(l => l.LoanID == id);

            if (loan == null)
            {
                return NotFound();
            }

            _loans.Remove(loan);
            return NoContent();
        }

        /// <summary>
        /// Retrieves a loan by its ID
        /// </summary>
        /// <param name="id">The LoanID to search for</param>
        /// <returns>The loan with the specified ID</returns>
        /// <response code="200">Returns the loan with the specified ID</response>
        /// <response code="404">If no loan with the specified ID was found</response>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(Loan), 200)]
        [ProducesResponseType(404)]
        public ActionResult<Loan> GetLoanById(string id)
        {
            var loan = _loans.FirstOrDefault(l => l.LoanID == id);

            if (loan == null)
            {
                return NotFound();
            }

            return loan;
        }

        /// <summary>
        /// Retrieves all loans in the system
        /// </summary>
        /// <returns>A list of all loans</returns>
        /// <response code="200">Returns the complete list of loans</response>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<Loan>), 200)]
        public ActionResult<IEnumerable<Loan>> GetAllLoans()
        {
            return _loans;
        }
    }
}