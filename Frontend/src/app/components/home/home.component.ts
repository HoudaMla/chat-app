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
  ) { }

  ngOnInit(): void {
    this.sender = this.authService.getUsername();
    console.log(`📢 Utilisateur connecté: ${this.sender}`);

    this.socketService.emitUserConnected(this.sender);

    // ✅ Fetch connected users
    this.socketService.getConnectedUsers().subscribe((onlineUsernames: string[]) => {
      console.log('📌 Utilisateurs en ligne:', onlineUsernames);

      this.users = onlineUsernames
        .filter(username => username !== this.sender) 
        .map(username => ({
          username,
          isOnline: true,
          unreadCount: 0
        }));

      console.log('👥 Liste des utilisateurs en ligne mise à jour:', this.users);
    });

    // ✅ Listen for incoming messages
    this.socketService.receiveChat().subscribe((message) => {
      console.log('📩 Message reçu:', message);

      if (message.sender !== this.sender) {
        this.messages.push(message);

        // Find the sender in the user list
        const userIndex = this.users.findIndex(user => user.username === message.sender);
        if (userIndex !== -1) {
          this.users[userIndex].unreadCount += 1;
          this.users = [...this.users];  // 🔄 Ensure UI updates in real-time
        }

        // Show notification
        if (Notification.permission === "granted") {
          new Notification(`New message from ${message.sender}`, {
            body: message.message,
            icon: 'assets/chat-icon.png'
          });
        } else {
          this.snackBar.open(`New message from ${message.sender}: "${message.message}"`, 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['snackbar-style']
          });
        }
      }
    });

    // Request notification permission
    if ("Notification" in window) {
      Notification.requestPermission().then(permission => {
        console.log("🔔 Notification permission:", permission);
      });
    }
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

    this.markAsRead(username);
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

  markAsRead(username: string): void {
    const userIndex = this.users.findIndex(user => user.username === username);
    if (userIndex !== -1) {
      this.users[userIndex].unreadCount = 0;
      this.users = [...this.users];  // 🔄 Trigger UI update
    }
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
    this.router.navigate(['/login']);
  }
}
