import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/AuthService';  
import { ChatService } from '../../services/chatService';  
import { SocketService } from '../../services/SocketService';  
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  sender: string = ''; 
  receivers: string[] = []; 
  message: string = ''; 
  messages: any[] = [];
  users: { username: string, isOnline: boolean, unreadCount: number }[] = [];
  isGroupChat: boolean = false;  

  constructor(
    private authService: AuthService,
    private socketService: SocketService,
    private chatService: ChatService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    console.log("Initialisation de HomeComponent...");
    this.socketService.initializeSocket(); 
    this.sender = this.authService.getUsername();  
    this.socketService.emitUserConnected(this.sender);

    this.messages = [];

    this.socketService.getUpdatedUsers().subscribe((onlineUsernames: string[]) => {
      this.users = onlineUsernames
        .filter(username => username !== this.sender)
        .map(username => ({ username, isOnline: true, unreadCount: 0 }));

      console.log('Utilisateurs connectés:', this.users);
    });

    this.socketService.receiveChat().subscribe((message) => {
      console.log('Message reçu:', message);
    
      this.snackBar.open(`Nouveau message de ${message.sender}: ${message.message}`, 'Fermer', {
        duration: 3000,  
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: ['snackbar-custom']
      });
    
      if (!this.isGroupChat) {
        const userIndex = this.users.findIndex(user => user.username === message.sender);
    
        if (message.sender === this.receivers[0]) {
          this.messages.push(message);
        } else {
          if (userIndex !== -1) {
            this.users[userIndex].unreadCount += 1;
          }
        }
      } else {
        this.messages.push(message);
      }
    });
  }

  toggleGroupChat(): void {
    this.isGroupChat = !this.isGroupChat;
    this.receivers = [];

    if (this.isGroupChat) {
      this.chatService.getGroupChat().subscribe(
        (messages: any[]) => {
          this.messages = messages;
          console.log('Messages du groupe chargés:', messages);
        },
        (error) => console.log('Erreur lors du chargement du chat de groupe:', error)
      );
    } else {
      this.messages = []; 
    }
  }

  selectUser(username: string): void {
    if (this.isGroupChat) return;

    this.receivers = [username];
    this.fetchConversation();

    const userIndex = this.users.findIndex(user => user.username === username);
    if (userIndex !== -1) {
      this.users[userIndex].unreadCount = 0;
    }
  }

  sendMessage(): void {
    if (this.message.trim()) {
      const chatData = {
        sender: this.sender,
        message: this.message,
        receiver: this.isGroupChat ? 'all' : this.receivers[0],  
        isGroup: this.isGroupChat
      };

      this.socketService.sendChat(chatData);

      if (!this.isGroupChat) {
        this.messages.push(chatData);
      }

      this.message = '';  
    }
  }

  fetchConversation(): void {
    const receiver = this.isGroupChat ? 'all' : this.receivers[0];

    this.chatService.getConversation(this.sender, receiver).subscribe(
      (conversation) => {
        this.messages = conversation;
      },
      (error) => console.log('Erreur chargement conversation:', error)
    );
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
    this.router.navigate(['/login']);
  }
}
