import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule, NgFor, NgForOf } from '@angular/common'; 
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms'; // Importer ReactiveFormsModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,        
    RouterLink,          
    RouterLinkActive,    
    CommonModule,
    HttpClientModule,
    NgFor,
    ReactiveFormsModule  // Assurez-vous d'importer ReactiveFormsModule ici

  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Frontend';
}
