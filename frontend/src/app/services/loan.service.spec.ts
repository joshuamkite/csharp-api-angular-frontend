import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { LoanService } from './loan.service';
import { Loan } from '../models/loan.model';

describe('LoanService', () => {
  let service: LoanService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoanService]
    });
    service = TestBed.inject(LoanService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all loans via GET', () => {
    const mockLoans: Loan[] = [
      { loanID: '1', borrowerName: 'John', fundingAmount: 100, repaymentAmount: 120 },
      { loanID: '2', borrowerName: 'Jane', fundingAmount: 200, repaymentAmount: 240 }
    ];

    service.getAllLoans().subscribe(loans => {
      expect(loans).toEqual(mockLoans);
    });

    const req = httpMock.expectOne('api/loans');
    expect(req.request.method).toBe('GET');
    req.flush(mockLoans);
  });

  it('should retrieve a loan by ID via GET', () => {
    const mockLoan: Loan = { loanID: '1', borrowerName: 'John', fundingAmount: 100, repaymentAmount: 120 };

    service.getLoanById('1').subscribe(loan => {
      expect(loan).toEqual(mockLoan);
    });

    const req = httpMock.expectOne('api/loans/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockLoan);
  });

  it('should retrieve loans by borrower name via GET', () => {
    const mockLoans: Loan[] = [
      { loanID: '1', borrowerName: 'John', fundingAmount: 100, repaymentAmount: 120 }
    ];

    service.getLoansByBorrowerName('John').subscribe(loans => {
      expect(loans).toEqual(mockLoans);
    });

    const req = httpMock.expectOne('api/loans?borrowerName=John');
    expect(req.request.method).toBe('GET');
    req.flush(mockLoans);
  });

  it('should create a loan via POST', () => {
    const newLoan = { borrowerName: 'Bob', fundingAmount: 300, repaymentAmount: 360 };
    const mockResponse = { loanID: '3', ...newLoan };

    service.createLoan(newLoan).subscribe(loan => {
      expect(loan).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('api/loans');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newLoan);
    req.flush(mockResponse);
  });

  it('should delete a loan via DELETE', () => {
    service.deleteLoan('1').subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('api/loans/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should handle errors when the API fails', () => {
    service.getAllLoans().subscribe({
      next: () => fail('Expected an error, not loans'),
      error: error => {
        expect(error.status).toBe(500);
        expect(error.error).toBeTruthy();
      }
    });

    const req = httpMock.expectOne('api/loans');
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
  });
});
