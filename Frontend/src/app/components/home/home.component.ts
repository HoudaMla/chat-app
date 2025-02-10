import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/AuthService';  
import { ChatService } from '../../services/chatService';  
import { SocketService } from '../../services/SocketService';  
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
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
    this.socketService.initializeSocket(); 
    this.sender = this.authService.getUsername();
    
    console.log(`📢 Utilisateur connecté: ${this.sender}`);
    this.socketService.emitUserConnected(this.sender);

    this.socketService.getConnectedUsers().subscribe((onlineUsernames: string[]) => {
        console.log('📌 Liste des utilisateurs connectés reçue:', onlineUsernames);

        this.users = onlineUsernames
            .filter(username => username !== this.sender)
            .map(username => ({ username, isOnline: true, unreadCount: 0 }));

        console.log('👥 Utilisateurs mis à jour:', this.users);
    });

    this.socketService.receiveChat().subscribe((message) => {
      console.log('📩 Message reçu:', message);
      
      if (message.sender !== this.sender) {
        this.messages.push(message);
    
        const userIndex = this.users.findIndex(user => user.username === message.sender);
        if (userIndex !== -1) {
          this.users[userIndex].unreadCount += 1;
        }
    
        this.snackBar.open(`New message from ${message.sender}: "${message.message}"`, 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['snackbar-style']
        });
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
  
      this.messages.push({ ...chatData, fromSelf: true });
  
      this.socketService.sendChat(chatData);
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
