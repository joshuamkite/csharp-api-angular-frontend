import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { LoanFormComponent } from './loan-form.component';
import { LoanService } from '../../services/loan.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

describe('LoanFormComponent', () => {
  let component: LoanFormComponent;
  let fixture: ComponentFixture<LoanFormComponent>;
  let loanServiceSpy: jasmine.SpyObj<LoanService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const loanService = jasmine.createSpyObj('LoanService', ['createLoan']);
    const matSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    const router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        LoanFormComponent
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

    fixture = TestBed.createComponent(LoanFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with an empty form', () => {
    expect(component.loanForm).toBeDefined();
    expect(component.loanForm.get('borrowerName')?.value).toBeFalsy();
    expect(component.loanForm.get('fundingAmount')?.value).toBeFalsy();
    expect(component.loanForm.get('repaymentAmount')?.value).toBeFalsy();
  });

  it('should require borrower name', () => {
    const borrowerNameControl = component.loanForm.get('borrowerName');
    borrowerNameControl?.setValue('');
    expect(borrowerNameControl?.valid).toBeFalsy();
    expect(borrowerNameControl?.errors?.['required']).toBeTruthy();
    
    borrowerNameControl?.setValue('John Doe');
    expect(borrowerNameControl?.valid).toBeTruthy();
  });

  it('should require funding amount greater than zero', () => {
    const fundingAmountControl = component.loanForm.get('fundingAmount');
    fundingAmountControl?.setValue(0);
    expect(fundingAmountControl?.valid).toBeFalsy();
    
    fundingAmountControl?.setValue(1000);
    expect(fundingAmountControl?.valid).toBeTruthy();
  });

  it('should require repayment amount greater than funding amount', () => {
    const fundingAmountControl = component.loanForm.get('fundingAmount');
    const repaymentAmountControl = component.loanForm.get('repaymentAmount');
    
    fundingAmountControl?.setValue(1000);
    repaymentAmountControl?.setValue(900);
    
    expect(component.loanForm.valid).toBeFalsy();
    
    repaymentAmountControl?.setValue(1100);
    expect(component.loanForm.valid).toBeTruthy();
  });

  it('should submit the form and create a loan', () => {
    const newLoan = {
      borrowerName: 'John Doe',
      fundingAmount: 1000,
      repaymentAmount: 1200
    };
    
    const mockResponse = { loanID: '1', ...newLoan };
    loanServiceSpy.createLoan.and.returnValue(of(mockResponse));
    
    component.loanForm.patchValue(newLoan);
    component.onSubmit();
    
    expect(loanServiceSpy.createLoan).toHaveBeenCalledWith(newLoan);
    expect(snackBarSpy.open).toHaveBeenCalledWith('Loan created successfully', 'Close', jasmine.any(Object));
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/loans']);
  });

  it('should handle API errors during submission', () => {
    loanServiceSpy.createLoan.and.returnValue(throwError(() => new Error('API error')));
    
    component.loanForm.patchValue({
      borrowerName: 'John Doe',
      fundingAmount: 1000,
      repaymentAmount: 1200
    });
    
    component.onSubmit();
    
    expect(snackBarSpy.open).toHaveBeenCalledWith('Failed to create loan', 'Close', jasmine.any(Object));
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should navigate back to loans list when cancel is clicked', () => {
    component.cancel();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/loans']);
  });
});
