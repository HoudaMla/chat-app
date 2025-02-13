import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.baseUrl; 

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object 
  ) {}

  signUp(username: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, { username, email, password });
  }

  signIn(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (response.status === 'ok' && response.data?.username) {
          this.setUsername(response.data.username);
        }
      })
    );
  }

  getOnlineUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/onlineuser`);
  }

  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user`);
  }

  getUsername(): string {
    if (isPlatformBrowser(this.platformId)) { 
      return localStorage.getItem('username') || '';
    }
    return ''; 
  }

  setUsername(username: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('username', username);
    }
  }

  // logout(): void {
  //   if (isPlatformBrowser(this.platformId)) {
  //     localStorage.removeItem('username');
  //   }

  //   this.http.post(`${this.apiUrl}/logout`, {}).subscribe(
  //     (response) => {
  //       console.log('Logged out successfully', response);
  //     },
  //     (error) => {
  //       console.error('Logout failed', error);
  //     }
  //   );
  // }
}
