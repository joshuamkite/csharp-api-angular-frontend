using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using LoanManagementApi.Models;

namespace LoanManagementApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoansController : ControllerBase
    {
        // In-memory data store
        private static List<Loan> _loans = new List<Loan>();

        // POST - Add a loan
        [HttpPost]
        public ActionResult<Loan> AddLoan(Loan loan)
        {
            if (string.IsNullOrEmpty(loan.LoanID) || string.IsNullOrEmpty(loan.BorrowerName))
            {
                return BadRequest("LoanID and BorrowerName are required.");
            }

            _loans.Add(loan);
            return CreatedAtAction(nameof(GetLoanById), new { id = loan.LoanID }, loan);
        }

        // GET - Get loan by Borrower Name
        [HttpGet("borrower/{borrowerName}")]
        public ActionResult<IEnumerable<Loan>> GetLoanByBorrowerName(string borrowerName)
        {
            var loans = _loans.Where(l => l.BorrowerName.Equals(borrowerName, StringComparison.OrdinalIgnoreCase)).ToList();
            
            if (loans.Count == 0)
            {
                return NotFound();
            }

            return loans;
        }

        // DELETE - Delete loan by LoanID
        [HttpDelete("{id}")]
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

        // BONUS - GET - Get loan by LoanID
        [HttpGet("{id}")]
        public ActionResult<Loan> GetLoanById(string id)
        {
            var loan = _loans.FirstOrDefault(l => l.LoanID == id);
            
            if (loan == null)
            {
                return NotFound();
            }

            return loan;
        }

        // BONUS - GETALL - Get all loans
        [HttpGet]
        public ActionResult<IEnumerable<Loan>> GetAllLoans()
        {
            return _loans;
        }
    }
}
