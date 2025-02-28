namespace LoanManagementApi.Models
{
    /// <summary>
    /// Represents a loan record in the system
    /// </summary>
    public class Loan
    {
        /// <summary>
        /// Unique identifier for the loan
        /// </summary>
        /// <example>L12345</example>
        public required string LoanID { get; set; }

        /// <summary>
        /// Name of the borrower
        /// </summary>
        /// <example>John Smith</example>
        public required string BorrowerName { get; set; }

        /// <summary>
        /// Total amount to be repaid by the borrower
        /// </summary>
        /// <example>15000.00</example>
        public decimal RepaymentAmount { get; set; }

        /// <summary>
        /// Initial amount funded for the loan
        /// </summary>
        /// <example>10000.00</example>
        public decimal FundingAmount { get; set; }
    }
}