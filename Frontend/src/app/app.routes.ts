import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  // Redirection par défaut vers la liste des produits
  {
    path: '',
    redirectTo: 'signup',
    pathMatch: 'full',
  },

  // Route pour afficher la liste des produits
  {
    path: 'login',
    component: LoginComponent,
  },

  // Route pour ajouter un nouveau produit
  {
    path: 'signup',
    component: SignupComponent,
  },

  // Route pour ajouter un nouveau produit
  {
    path: 'home',
    component: HomeComponent,
  }
 
];
