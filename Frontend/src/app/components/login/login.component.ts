import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/AuthService';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  signInForm;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router 
  ) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.signInForm.valid) {
      const { email, password } = this.signInForm.value;

      if (email && password) {
        this.authService.signIn(email, password).subscribe(
          (response) => {
            if (response.status) {
              console.log('Sign-in successful:', response);
              alert('Login successful! Redirecting to home...');
              this.router.navigate(['/home']);
            } else {
              console.error('Sign-in failed:', response.message);
              this.errorMessage = response.message || 'Invalid credentials. Please try again.';
              alert(response.message);

            }
          },
          (error) => {
            console.error('Sign-in failed:', error);
            this.errorMessage = 'An error occurred. Please try again later.';
          }
        );
      } else {
        this.errorMessage = 'Email or password is missing';
      }
    } else {
      this.errorMessage = 'Form is invalid. Please check your inputs.';
    }
  }
}