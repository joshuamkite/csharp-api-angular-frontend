#!/bin/bash

# Fix styles.scss - move @use to the top
cat >frontend/src/styles.scss <<'EOL'
/* Use modern approach for Angular Material styling */
@use '@angular/material' as mat;

/* Global Styles */
html, body { height: 100%; }
body { 
  margin: 0; 
  font-family: Roboto, "Helvetica Neue", sans-serif; 
  background-color: #f5f5f5;
}

/* Card styling */
.mat-mdc-card {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1) !important;
  border-radius: 8px !important;
  margin-bottom: 16px;
}

/* Button styling */
.mat-mdc-raised-button {
  border-radius: 4px;
}

/* Table styling */
.mat-mdc-table {
  width: 100%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1) !important;
  border-radius: 8px !important;
  overflow: hidden;
}

.mat-mdc-header-cell {
  font-weight: bold;
  color: rgba(0, 0, 0, 0.87);
  background-color: #f5f5f5;
}

.mat-mdc-row:hover {
  background-color: rgba(0, 0, 0, 0.04);
}
EOL

# Create Nav Header Component
mkdir -p frontend/src/app/components/nav-header
cat >frontend/src/app/components/nav-header/nav-header.component.ts <<'EOL'
import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterLink, RouterLinkActive],
  templateUrl: './nav-header.component.html',
  styleUrls: ['./nav-header.component.scss']
})
export class NavHeaderComponent {}
EOL

cat >frontend/src/app/components/nav-header/nav-header.component.html <<'EOL'
<mat-toolbar color="primary" class="navbar">
  <a mat-button routerLink="/" class="brand">
    <mat-icon>account_balance</mat-icon>
    <span>Loan Management</span>
  </a>
  <span class="spacer"></span>
  <div class="nav-items">
    <a mat-button routerLink="/loans" routerLinkActive="active">
      <mat-icon>list</mat-icon>
      <span>View Loans</span>
    </a>
    <a mat-button routerLink="/loans/new" routerLinkActive="active">
      <mat-icon>add</mat-icon>
      <span>New Loan</span>
    </a>
  </div>
</mat-toolbar>
EOL

cat >frontend/src/app/components/nav-header/nav-header.component.scss <<'EOL'
.navbar {
  display: flex;
  box-shadow: 0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12);
  position: relative;
  z-index: 10;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.2rem;
  font-weight: 500;
  text-decoration: none;
  color: white;
}

.spacer {
  flex: 1;
}

.nav-items {
  display: flex;
  gap: 16px;
}

.nav-items a {
  display: flex;
  align-items: center;
  gap: 8px;
}

.active {
  background-color: rgba(255, 255, 255, 0.15);
}

@media (max-width: 600px) {
  .nav-items span {
    display: none;
  }
  
  .brand span {
    display: none;
  }
}
EOL

# Create Loan List Component
mkdir -p frontend/src/app/components/loan-list
cat >frontend/src/app/components/loan-list/loan-list.component.ts <<'EOL'
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
EOL

cat >frontend/src/app/components/loan-list/loan-list.component.html <<'EOL'
<div class="container">
  <div class="header">
    <h1>Loans</h1>
    <button mat-raised-button color="primary" routerLink="/loans/new">
      <mat-icon>add</mat-icon>
      Add New Loan
    </button>
  </div>

  <mat-card class="search-card">
    <mat-card-content>
      <div class="search-form">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search by Borrower Name</mat-label>
          <input matInput [(ngModel)]="searchTerm" placeholder="Enter borrower name">
          <button *ngIf="searchTerm" matSuffix mat-icon-button aria-label="Clear" (click)="clearSearch()">
            <mat-icon>close</mat-icon>
          </button>
        </mat-form-field>
        <button mat-raised-button color="primary" (click)="applyFilter()">Search</button>
      </div>
    </mat-card-content>
  </mat-card>

  <div *ngIf="isLoading" class="loading-container">
    <mat-spinner diameter="50"></mat-spinner>
    <p>Loading loans...</p>
  </div>

  <div *ngIf="errorMessage" class="error-container">
    <mat-icon color="warn">error</mat-icon>
    <p>{{ errorMessage }}</p>
    <button mat-raised-button color="primary" (click)="loadLoans()">Retry</button>
  </div>

  <div *ngIf="!isLoading && !errorMessage">
    <div *ngIf="loans.length === 0" class="no-data-container">
      <mat-icon>info</mat-icon>
      <p>No loans found</p>
      <button mat-raised-button color="primary" routerLink="/loans/new">Create New Loan</button>
    </div>

    <table mat-table [dataSource]="loans" *ngIf="loans.length > 0" class="mat-elevation-z8">
      <!-- Loan ID Column -->
      <ng-container matColumnDef="loanID">
        <th mat-header-cell *matHeaderCellDef> Loan ID </th>
        <td mat-cell *matCellDef="let loan"> {{ loan.loanID }} </td>
      </ng-container>

      <!-- Borrower Name Column -->
      <ng-container matColumnDef="borrowerName">
        <th mat-header-cell *matHeaderCellDef> Borrower Name </th>
        <td mat-cell *matCellDef="let loan"> {{ loan.borrowerName }} </td>
      </ng-container>

      <!-- Funding Amount Column -->
      <ng-container matColumnDef="fundingAmount">
        <th mat-header-cell *matHeaderCellDef> Funding Amount </th>
        <td mat-cell *matCellDef="let loan"> {{ formatCurrency(loan.fundingAmount) }} </td>
      </ng-container>

      <!-- Repayment Amount Column -->
      <ng-container matColumnDef="repaymentAmount">
        <th mat-header-cell *matHeaderCellDef> Repayment Amount </th>
        <td mat-cell *matCellDef="let loan"> {{ formatCurrency(loan.repaymentAmount) }} </td>
      </ng-container>

      <!-- Actions Column -->
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef> Actions </th>
        <td mat-cell *matCellDef="let loan">
          <button mat-icon-button color="primary" (click)="viewLoanDetails(loan)" matTooltip="View Details">
            <mat-icon>visibility</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="confirmDelete(loan)" matTooltip="Delete">
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
  </div>
</div>
EOL

cat >frontend/src/app/components/loan-list/loan-list.component.scss <<'EOL'
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.loading-container, .error-container, .no-data-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 20px;
  gap: 16px;
}

.error-container {
  color: #f44336;
}

.search-card {
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  gap: 16px;
  align-items: center;
}

.search-field {
  flex: 1;
}

table {
  width: 100%;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .search-form {
    flex-direction: column;
    align-items: stretch;
  }
}
EOL

# Create Loan Form Component
mkdir -p frontend/src/app/components/loan-form
cat >frontend/src/app/components/loan-form/loan-form.component.ts <<'EOL'
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LoanService } from '../../services/loan.service';

@Component({
  selector: 'app-loan-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './loan-form.component.html',
  styleUrls: ['./loan-form.component.scss']
})
export class LoanFormComponent implements OnInit {
  loanForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.loanForm = this.fb.group({
      loanID: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9-_]+$/)]],
      borrowerName: ['', [Validators.required, Validators.minLength(2)]],
      fundingAmount: [0, [Validators.required, Validators.min(0.01)]],
      repaymentAmount: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  onSubmit(): void {
    if (this.loanForm.invalid) {
      this.markFormGroupTouched(this.loanForm);
      return;
    }

    this.isSubmitting = true;
    this.loanService.addLoan(this.loanForm.value).subscribe({
      next: (response) => {
        this.snackBar.open('Loan created successfully', 'Close', {
          duration: 3000
        });
        this.router.navigate(['/loans']);
      },
      error: (error) => {
        let errorMessage = 'Failed to create loan';
        if (error.error && typeof error.error === 'string') {
          errorMessage = error.error;
        }
        this.snackBar.open(errorMessage, 'Close', {
          duration: 5000
        });
        this.isSubmitting = false;
      }
    });
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/loans']);
  }

  getErrorMessage(controlName: string): string {
    const control = this.loanForm.get(controlName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    if (control.errors['required']) {
      return 'This field is required';
    }

    if (control.errors['pattern']) {
      return 'Invalid format (only letters, numbers, dashes, and underscores allowed)';
    }

    if (control.errors['minlength']) {
      return `Minimum length is ${control.errors['minlength'].requiredLength} characters`;
    }

    if (control.errors['min']) {
      return `Minimum value is ${control.errors['min'].min}`;
    }

    return 'Invalid value';
  }
}
EOL

cat >frontend/src/app/components/loan-form/loan-form.component.html <<'EOL'
<div class="container">
  <div class="header">
    <h1>Create New Loan</h1>
  </div>

  <mat-card>
    <mat-card-content>
      <form [formGroup]="loanForm" (ngSubmit)="onSubmit()">
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Loan ID</mat-label>
            <input matInput formControlName="loanID" placeholder="Enter a unique ID (e.g., L12345)">
            <mat-error *ngIf="loanForm.get('loanID')?.invalid">
              {{ getErrorMessage('loanID') }}
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Borrower Name</mat-label>
            <input matInput formControlName="borrowerName" placeholder="Enter borrower's full name">
            <mat-error *ngIf="loanForm.get('borrowerName')?.invalid">
              {{ getErrorMessage('borrowerName') }}
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row two-columns">
          <mat-form-field appearance="outline">
            <mat-label>Funding Amount</mat-label>
            <input matInput type="number" formControlName="fundingAmount" placeholder="Enter amount in USD">
            <span matPrefix>$&nbsp;</span>
            <mat-error *ngIf="loanForm.get('fundingAmount')?.invalid">
              {{ getErrorMessage('fundingAmount') }}
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Repayment Amount</mat-label>
            <input matInput type="number" formControlName="repaymentAmount" placeholder="Enter amount in USD">
            <span matPrefix>$&nbsp;</span>
            <mat-error *ngIf="loanForm.get('repaymentAmount')?.invalid">
              {{ getErrorMessage('repaymentAmount') }}
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-actions">
          <button mat-button type="button" (click)="onCancel()">Cancel</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="isSubmitting">
            <mat-spinner diameter="20" *ngIf="isSubmitting"></mat-spinner>
            <span *ngIf="!isSubmitting">Create Loan</span>
          </button>
        </div>
      </form>
    </mat-card-content>
  </mat-card>
</div>
EOL

cat >frontend/src/app/components/loan-form/loan-form.component.scss <<'EOL'
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 16px;
}

.header {
  margin-bottom: 24px;
}

.form-row {
  margin-bottom: 16px;
}

.form-row mat-form-field {
  width: 100%;
}

.two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 24px;
}

@media (max-width: 768px) {
  .two-columns {
    grid-template-columns: 1fr;
  }
}
EOL

# Create Loan Detail Component
mkdir -p frontend/src/app/components/loan-detail
cat >frontend/src/app/components/loan-detail/loan-detail.component.ts <<'EOL'
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
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadLoan(id);
    } else {
      this.errorMessage = 'No loan ID provided';
      this.isLoading = false;
    }
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
EOL

cat >frontend/src/app/components/loan-detail/loan-detail.component.html <<'EOL'
<div class="container">
  <div class="header">
    <button mat-button (click)="goBack()">
      <mat-icon>arrow_back</mat-icon> Back to Loans
    </button>
  </div>

  <div *ngIf="isLoading" class="loading-container">
    <mat-spinner diameter="50"></mat-spinner>
    <p>Loading loan details...</p>
  </div>

  <div *ngIf="errorMessage" class="error-container">
    <mat-icon color="warn">error</mat-icon>
    <p>{{ errorMessage }}</p>
    <button mat-raised-button color="primary" (click)="goBack()">Back to Loans</button>
  </div>

  <div *ngIf="!isLoading && !errorMessage && loan" class="loan-details">
    <h1>Loan Details</h1>

    <mat-card>
      <mat-card-content>
        <div class="detail-row">
          <div class="detail-label">Loan ID:</div>
          <div class="detail-value">{{ loan.loanID }}</div>
        </div>

        <div class="detail-row">
          <div class="detail-label">Borrower Name:</div>
          <div class="detail-value">{{ loan.borrowerName }}</div>
        </div>

        <div class="detail-row">
          <div class="detail-label">Funding Amount:</div>
          <div class="detail-value">{{ formatCurrency(loan.fundingAmount) }}</div>
        </div>

        <div class="detail-row">
          <div class="detail-label">Repayment Amount:</div>
          <div class="detail-value">{{ formatCurrency(loan.repaymentAmount) }}</div>
        </div>

        <div class="detail-row">
          <div class="detail-label">Interest:</div>
          <div class="detail-value">{{ formatCurrency(loan.repaymentAmount - loan.fundingAmount) }}</div>
        </div>

        <div class="detail-row">
          <div class="detail-label">Interest Rate:</div>
          <div class="detail-value">{{ ((loan.repaymentAmount / loan.fundingAmount - 1) * 100).toFixed(2) }}%</div>
        </div>
      </mat-card-content>

      <mat-card-actions align="end">
        <button mat-raised-button color="warn" (click)="confirmDelete()">
          <mat-icon>delete</mat-icon> Delete Loan
        </button>
      </mat-card-actions>
    </mat-card>
  </div>
</div>
EOL

cat >frontend/src/app/components/loan-detail/loan-detail.component.scss <<'EOL'
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 16px;
}

.header {
  margin-bottom: 24px;
}

.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 20px;
  gap: 16px;
}

.error-container {
  color: #f44336;
}

.loan-details h1 {
  margin-bottom: 24px;
}

.detail-row {
  display: flex;
  margin-bottom: 16px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.detail-label {
  flex: 0 0 150px;
  font-weight: 500;
  color: #666;
}

.detail-value {
  flex: 1;
}

@media (max-width: 768px) {
  .detail-row {
    flex-direction: column;
  }
  
  .detail-label {
    margin-bottom: 4px;
  }
}
EOL

# Update app.component.ts for standalone components
cat >frontend/src/app/app.component.ts <<'EOL'
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavHeaderComponent } from './components/nav-header/nav-header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavHeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Loan Management';
}
EOL

echo "All component files have been created successfully!"
