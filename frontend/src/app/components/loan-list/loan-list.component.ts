import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Loan } from '../../models/loan.model';
import { LoanService } from '../../services/loan.service';

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.scss']
})
export class LoanListComponent implements OnInit {
  displayedColumns: string[] = ['loanID', 'borrowerName', 'fundingAmount', 'repaymentAmount', 'actions'];
  loans: Loan[] = [];
  isLoading = true;
  errorMessage = '';
  searchTerm = '';

  constructor(
    private loanService: LoanService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLoans();
  }

  loadLoans() {
    this.isLoading = true;
    this.errorMessage = '';

    this.loanService.getAllLoans().subscribe({
      next: (loans) => {
        this.loans = loans;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load loans. Please try again later.';
        this.isLoading = false;
        console.error('Error loading loans:', error);
      }
    });
  }

  applyFilter() {
    if (this.searchTerm.trim()) {
      this.isLoading = true;
      this.loanService.getLoansByBorrowerName(this.searchTerm).subscribe({
        next: (loans) => {
          this.loans = loans;
          this.isLoading = false;
        },
        error: (error) => {
          if (error.status === 404) {
            this.loans = [];
          } else {
            this.errorMessage = 'Error searching for loans. Please try again.';
            console.error('Error searching loans:', error);
          }
          this.isLoading = false;
        }
      });
    } else {
      this.loadLoans();
    }
  }

  clearSearch() {
    this.searchTerm = '';
    this.loadLoans();
  }

  viewLoanDetails(loan: Loan) {
    this.router.navigate(['/loans', loan.loanID]);
  }

  confirmDelete(loan: Loan) {
    const confirm = window.confirm(`Are you sure you want to delete the loan with ID ${loan.loanID}?`);
    
    if (confirm) {
      this.deleteLoan(loan.loanID);
    }
  }

  deleteLoan(loanId: string) {
    this.loanService.deleteLoan(loanId).subscribe({
      next: () => {
        this.snackBar.open('Loan deleted successfully', 'Close', {
          duration: 3000
        });
        this.loadLoans();
      },
      error: (error) => {
        this.snackBar.open('Failed to delete loan', 'Close', {
          duration: 3000
        });
        console.error('Error deleting loan:', error);
      }
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}
