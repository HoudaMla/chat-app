import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: Socket;
  private initialized = false;  // Prevent multiple initializations

  constructor(private http: HttpClient) {}

  initializeSocket(): void {
    if (!this.initialized) {
      this.socket = io(environment.baseUrl, { transports: ['websocket', 'polling'] });
      this.initialized = true;
      console.log("WebSocket connection initialized...");
    }
  }

  getConnectedUsers(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.baseUrl}/users/connected`);
  }

  sendChat(chatData: { sender: string, receiver: string | string[], message: string, isGroup: boolean }) {
    this.socket.emit('sendChat', chatData);
  }

  receiveChat(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('receiveChat', (data) => observer.next(data));
    });
  }

  emitUserConnected(username: string): void {
    this.socket.emit('user-connected', username);
  }

  getUpdatedUsers(): Observable<string[]> {
    return new Observable((observer) => {
      this.socket.on('update-users', (users) => observer.next(users));
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      console.log("WebSocket disconnected...");
    }
  }
}
