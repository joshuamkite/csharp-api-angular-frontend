import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Loan } from '../../models/loan.model';
import { LoanService } from '../../services/loan.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-loan-list',
    templateUrl: './loan-list.component.html',
    styleUrls: ['./loan-list.component.scss']
})
export class LoanListComponent implements OnInit {
    displayedColumns: string[] = ['loanID', 'borrowerName', 'fundingAmount', 'repaymentAmount', 'actions'];
    dataSource = new MatTableDataSource<Loan>([]);
    isLoading = true;
    errorMessage = '';
    searchTerm = '';

    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(
        private loanService: LoanService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadLoans();
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    loadLoans() {
        this.isLoading = true;
        this.errorMessage = '';

        this.loanService.getAllLoans().subscribe({
            next: (loans) => {
                this.dataSource.data = loans;
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
                    this.dataSource.data = loans;
                    this.isLoading = false;
                },
                error: (error) => {
                    if (error.status === 404) {
                        this.dataSource.data = [];
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