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
