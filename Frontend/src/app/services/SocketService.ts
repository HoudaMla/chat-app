import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client'; // Import du client Socket.IO
import { environment } from '../environments/environment'; // Pour charger les variables d'environnement
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'; // Import HttpClient for HTTP requests

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor(private http: HttpClient) { // Inject HttpClient in the constructor
    this.socket = io(environment.baseUrl);
  }

  getConnectedUsers(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.baseUrl}/users/connected`); // Use the correct URL
  }

  sendChat(sender: string, receiver: string, message: string): void {
    this.socket.emit('sendChat', { sender, receiver, message });
  }

  receiveChat(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('receiveChat', (data) => {
        observer.next(data);
      });
    });
  }

  emitUserConnected(username: string): void {
    this.socket.emit('user-connected', username);  // Emit the user-connected event
}

  disconnect(): void {
    this.socket.disconnect();
  }
}
