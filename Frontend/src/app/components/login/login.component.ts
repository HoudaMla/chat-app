import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/AuthService';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';  // Importer le Router pour la navigation

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  signInForm;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router  // Injecter Router pour la navigation
  ) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.signInForm.valid) {
      const { email, password } = this.signInForm.value;

      if (email && password) {  // Vérifie que email et password sont non null et non undefined
        this.authService.signIn(email, password).subscribe(
          (response) => {
            console.log('Sign-in successful:', response);
            // Afficher un message de succès
            alert('Login successful! Redirecting to home...');
            // Naviguer vers la page d'accueil
            this.router.navigate(['/home']);  // Assurez-vous que la route "/home" est configurée
          },
          (error) => {
            console.error('Sign-in failed:', error);
            // Afficher un message d'erreur
            alert('Sign-in failed. Please try again.');
          }
        );
      } else {
        console.error('Email or password is missing');
      }
    } else {
      console.error('Form is invalid');
    }
  }
}
