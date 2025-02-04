import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms'; // Importer ReactiveFormsModule
import { AuthService } from '../../services/AuthService';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';  

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  // Déclaration de la propriété formBuilder dans la classe
  signUpForm;

  // Injection de FormBuilder dans le constructeur
  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    // Initialisation du formulaire dans le constructeur
    this.signUpForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.signUpForm.valid) {
      const { email, password } = this.signUpForm.value;
      if (email && password) {  // Vérifie que email et password sont non null et non undefined
        this.authService.signUp(email, password).subscribe(
          (response) => {
            console.log('Sign-up successful:', response);
            // Handle success (e.g., redirect or show a success message)
          },
          (error) => {
            console.error('Sign-up failed:', error);
            // Handle error (e.g., show error message)
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
