import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// Common Angular Material imports
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Re-export testing utilities
export * from '@angular/core/testing';
export { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
export { RouterTestingModule } from '@angular/router/testing';

// Common testing modules most components will need
export const CommonTestModules = [
  NoopAnimationsModule,
  RouterTestingModule,
  HttpClientTestingModule,
  FormsModule,
  ReactiveFormsModule,
  MatSnackBarModule,
  MatCardModule,
  MatTableModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatProgressSpinnerModule
];

// Helper for component testing
export function configureTestingModule(config: {
  declarations?: any[],
  imports?: any[],
  providers?: any[]
}) {
  return TestBed.configureTestingModule({
    declarations: config.declarations || [],
    imports: [...CommonTestModules, ...(config.imports || [])],
    providers: config.providers || []
  });
}

// Model mock factory
export const mockLoan = (overrides = {}) => ({
  loanID: '1',
  borrowerName: 'Test User',
  fundingAmount: 1000,
  repaymentAmount: 1200,
  ...overrides
});
