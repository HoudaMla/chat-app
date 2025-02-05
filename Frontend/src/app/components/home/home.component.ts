import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/AuthService';  // Correct path for service
import { ChatService } from '../../services/chatService';  // Import the ChatService
import { SocketService } from '../../services/SocketService';  // Correct path for service
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  sender: string = ''; 
  receiver: string = ''; 
  message: string = ''; 
  messages: any[] = [];
  connectedUsers: { username: string, id: string }[] = [];

  constructor(
    private authService: AuthService,
    private socketService: SocketService,
    private chatService: ChatService  // Inject ChatService
  ) {}

  ngOnInit(): void {
    this.sender = this.authService.getUsername();  

    this.socketService.emitUserConnected(this.sender);

    this.authService.getOnlineUsers().subscribe((users) => {
      this.connectedUsers = users;  
      console.log(users);
    });

  
    this.socketService.receiveChat().subscribe((message) => {
    this.messages.push(message);  
    console.log('Received message:', message); 
  });
  }

  sendMessage(): void {
    if (this.message.trim()) {
      this.socketService.sendChat(this.sender, this.receiver, this.message);
      this.message = '';  // Reset the message input field
    }
  }

  fetchConversation(): void {
    if (this.receiver) {
        this.chatService.getConversation(this.sender, this.receiver).subscribe(
            (conversation) => {
                this.messages = conversation;  
                console.log('Conversation fetched:', conversation);
            },
            (error) => {
                console.log('Error fetching conversation:', error);
            }
        );
    }
}


  disconnect(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }
}
