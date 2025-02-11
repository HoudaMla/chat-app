import {  ApplicationRef, inject, Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../environments/environment';
import { first, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;
  private initialized = false;

  constructor(private http: HttpClient) {
    this.socket = io(environment.baseUrl, { autoConnect: false });
    inject(ApplicationRef).isStable.pipe(
      first((isStable) => isStable))
    .subscribe(() => { this.socket.connect() });
  }

  // initializeSocket(): void {
  //   if (!this.initialized) {
  //     this.socket = io(environment.baseUrl, { autoConnect: false });

  //     this.socket.on('connect', () => {
  //       console.log(" WebSocket connection established.");
  //     });

  //     // this.socket.on('disconnect', () => {
  //     //   console.log("WebSocket disconnected.");
  //     // });

  //     this.initialized = true;
  //   }
  // }

  getConnectedUsers(): Observable<string[]> {
    return new Observable((observer) => {
      this.socket.on('update-users', (users) => {
        console.log(' Utilisateurs connectés reçus:', users);
        observer.next(users);
      });
    });
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
    console.log(` Envoi de user-connected pour ${username}`);
    this.socket.emit('user-connected', username);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      console.log(" WebSocket déconnecté...");
    }
  }
}
