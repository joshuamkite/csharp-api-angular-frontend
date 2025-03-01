import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoanListComponent } from './loan-list.component';
import { LoanService } from '../../services/loan.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Loan } from '../../models/loan.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('LoanListComponent', () => {
  let component: LoanListComponent;
  let fixture: ComponentFixture<LoanListComponent>;
  let loanServiceSpy: jasmine.SpyObj<LoanService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockLoans: Loan[] = [
    { loanID: '1', borrowerName: 'John Doe', fundingAmount: 1000, repaymentAmount: 1200 },
    { loanID: '2', borrowerName: 'Jane Smith', fundingAmount: 2000, repaymentAmount: 2400 }
  ];

  beforeEach(async () => {
    const loanService = jasmine.createSpyObj('LoanService', [
      'getAllLoans', 'getLoansByBorrowerName', 'deleteLoan'
    ]);
    const matSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    const router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        FormsModule,
        MatCardModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        LoanListComponent
      ],
      providers: [
        { provide: LoanService, useValue: loanService },
        { provide: MatSnackBar, useValue: matSnackBar },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    loanServiceSpy = TestBed.inject(LoanService) as jasmine.SpyObj<LoanService>;
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanListComponent);
    component = fixture.componentInstance;
    loanServiceSpy.getAllLoans.and.returnValue(of(mockLoans));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load loans on initialization', () => {
    fixture.detectChanges(); // Triggers ngOnInit
    
    expect(loanServiceSpy.getAllLoans).toHaveBeenCalled();
    expect(component.loans).toEqual(mockLoans);
    expect(component.isLoading).toBeFalse();
  });

  it('should handle API errors when loading loans', () => {
    loanServiceSpy.getAllLoans.and.returnValue(throwError(() => new Error('API error')));
    
    fixture.detectChanges(); // Triggers ngOnInit
    
    expect(component.errorMessage).toBeTruthy();
    expect(component.isLoading).toBeFalse();
  });

  it('should filter loans by borrower name', () => {
    const filteredLoans = [mockLoans[0]]; // Only John Doe
    loanServiceSpy.getLoansByBorrowerName.and.returnValue(of(filteredLoans));
    
    component.searchTerm = 'John';
    component.applyFilter();
    
    expect(loanServiceSpy.getLoansByBorrowerName).toHaveBeenCalledWith('John');
    expect(component.loans).toEqual(filteredLoans);
  });

  it('should clear search and reload all loans', () => {
    component.searchTerm = 'John';
    component.clearSearch();
    
    expect(component.searchTerm).toBe('');
    expect(loanServiceSpy.getAllLoans).toHaveBeenCalled();
  });

  it('should navigate to loan details when view button is clicked', () => {
    const loan = mockLoans[0];
    component.viewLoanDetails(loan);
    
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/loans', loan.loanID]);
  });

  it('should delete loan and show success message', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    loanServiceSpy.deleteLoan.and.returnValue(of(undefined));
    
    component.confirmDelete(mockLoans[0]);
    
    expect(loanServiceSpy.deleteLoan).toHaveBeenCalledWith('1');
    expect(snackBarSpy.open).toHaveBeenCalledWith('Loan deleted successfully', 'Close', jasmine.any(Object));
    expect(loanServiceSpy.getAllLoans).toHaveBeenCalled();
  });

  it('should not delete loan when user cancels confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    
    component.confirmDelete(mockLoans[0]);
    
    expect(loanServiceSpy.deleteLoan).not.toHaveBeenCalled();
  });

  it('should format currency correctly', () => {
    const formatted = component.formatCurrency(1000);
    expect(formatted).toBe('$1,000.00');
  });
});
