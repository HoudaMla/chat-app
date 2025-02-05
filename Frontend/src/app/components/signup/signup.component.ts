import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/AuthService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';  

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signUpForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
     private authService: AuthService,
     private router: Router 

    ) {
    this.signUpForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_-]{3,15}$')]], // Ajout d'une validation correcte pour le username
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.signUpForm.valid) {
      const { username, email, password } = this.signUpForm.value;

      this.authService.signUp(username, email, password).subscribe({
        next: (response) => {
          console.log('Sign-up successful:', response);
          alert('user created successfully');
          this.router.navigate(['/login']);  
        
        },
        error: (error) => {
          console.error('Sign-up failed:', error);
        }
      });

    } else {
      console.error('Form is invalid:', this.signUpForm.errors);
    }
  }
}
