import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client'; 
import { environment } from '../environments/environment'; 
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'; 

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor(private http: HttpClient) { 
    this.socket = io(environment.baseUrl);
  }

  getConnectedUsers(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.baseUrl}/users/connected`); 
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
    this.socket.emit('user-connected', username);  
}

  getUpdatedUsers(): Observable<string[]> {
    return new Observable((observer) => {
        this.socket.on('update-users', (users) => {
            observer.next(users);
        });
    });
  }


  disconnect(): void {
    this.socket.disconnect();
  }
}
