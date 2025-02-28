namespace LoanManagementApi.Models
{
    public class Loan
    {
        public string LoanID { get; set; }
        public string BorrowerName { get; set; }
        
        // Bonus properties
        public decimal RepaymentAmount { get; set; }
        public decimal FundingAmount { get; set; }
    }
}
