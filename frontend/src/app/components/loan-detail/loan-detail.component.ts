import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Loan } from '../../models/loan.model';
import { LoanService } from '../../services/loan.service';

@Component({
  selector: 'app-loan-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './loan-detail.component.html',
  styleUrls: ['./loan-detail.component.scss']
})
export class LoanDetailComponent implements OnInit {
  loan: Loan | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loanService: LoanService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadLoan(id);
    } else {
      this.errorMessage = 'No loan ID provided';
      this.isLoading = false;
    }
  }


  calculateInterestRate(principal: number, total: number): string {
    const rate = ((total - principal) / principal) * 100;
    return rate.toFixed(2) + '%';
  }

  loadLoan(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.loanService.getLoanById(id).subscribe({
      next: (loan) => {
        this.loan = loan;
        this.isLoading = false;
      },
      error: (error) => {
        if (error.status === 404) {
          this.errorMessage = `Loan with ID '${id}' not found`;
        } else {
          this.errorMessage = 'An error occurred while loading the loan details';
        }
        this.isLoading = false;
      }
    });
  }

  confirmDelete(): void {
    if (!this.loan) return;

    const confirm = window.confirm(`Are you sure you want to delete the loan with ID ${this.loan.loanID}?`);

    if (confirm) {
      this.deleteLoan(this.loan.loanID);
    }
  }

  deleteLoan(id: string): void {
    this.loanService.deleteLoan(id).subscribe({
      next: () => {
        this.snackBar.open('Loan deleted successfully', 'Close', {
          duration: 3000
        });
        this.router.navigate(['/loans']);
      },
      error: (error) => {
        this.snackBar.open('Failed to delete loan', 'Close', {
          duration: 3000
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/loans']);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}
