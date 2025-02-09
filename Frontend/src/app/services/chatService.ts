// In your AuthService or another service (e.g., ChatService)
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = environment.baseUrl; 

  constructor(private http: HttpClient) {}

  getConversation(user1: string, user2: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${user1}/${user2}`);
  }

  getGroupChat(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/group`);
  }
}
