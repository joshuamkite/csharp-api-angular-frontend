import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LoanDetailComponent } from './loan-detail.component';
import { LoanService } from '../../services/loan.service';

describe('LoanDetailComponent', () => {
  let component: LoanDetailComponent;
  let fixture: ComponentFixture<LoanDetailComponent>;
  let loanServiceSpy: jasmine.SpyObj<LoanService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRoute: ActivatedRoute;

  const mockLoan = {
    loanID: '1',
    borrowerName: 'John Doe',
    fundingAmount: 1000,
    repaymentAmount: 1200
  };

  beforeEach(async () => {
    const loanService = jasmine.createSpyObj('LoanService', ['getLoanById', 'deleteLoan']);
    const matSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    const router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        LoanDetailComponent
      ],
      providers: [
        { provide: LoanService, useValue: loanService },
        { provide: MatSnackBar, useValue: matSnackBar },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: '1' }))
          }
        }
      ]
    }).compileComponents();

    loanServiceSpy = TestBed.inject(LoanService) as jasmine.SpyObj<LoanService>;
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedRoute = TestBed.inject(ActivatedRoute);

    loanServiceSpy.getLoanById.and.returnValue(of(mockLoan));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load loan details on initialization', () => {
    expect(loanServiceSpy.getLoanById).toHaveBeenCalledWith('1');
    expect(component.loan).toEqual(mockLoan);
    expect(component.isLoading).toBeFalse();
  });

  it('should handle API errors when loading loan details', () => {
    loanServiceSpy.getLoanById.and.returnValue(throwError(() => new Error('API error')));
    
    component.ngOnInit();
    
    expect(component.errorMessage).toBeTruthy();
    expect(component.isLoading).toBeFalse();
  });

  it('should delete loan and navigate back to list', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    loanServiceSpy.deleteLoan.and.returnValue(of(undefined));
    
    component.deleteLoan();
    
    expect(loanServiceSpy.deleteLoan).toHaveBeenCalledWith('1');
    expect(snackBarSpy.open).toHaveBeenCalledWith('Loan deleted successfully', 'Close', jasmine.any(Object));
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/loans']);
  });

  it('should not delete loan when user cancels confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    
    component.deleteLoan();
    
    expect(loanServiceSpy.deleteLoan).not.toHaveBeenCalled();
  });

  it('should navigate back to loan list', () => {
    component.goBack();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/loans']);
  });

  it('should format currency correctly', () => {
    const formatted = component.formatCurrency(1000);
    expect(formatted).toBe('$1,000.00');
  });

  it('should calculate interest rate', () => {
    const rate = component.calculateInterestRate(1000, 1100);
    expect(rate).toBe('10.00%');
  });
});
