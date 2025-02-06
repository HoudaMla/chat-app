import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/AuthService';  
import { ChatService } from '../../services/chatService';  
import { SocketService } from '../../services/SocketService';  
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
  connectedUsers: { username: string }[] = [];

  constructor(
    private authService: AuthService,
    private socketService: SocketService,
    private chatService: ChatService  
  ) {}

  ngOnInit(): void {
    this.sender = this.authService.getUsername();  

    this.socketService.emitUserConnected(this.sender);


    this.authService.getOnlineUsers().subscribe((users) => {
        this.connectedUsers = users;  
        console.log('Initial users:', users);
    });


    this.socketService.getUpdatedUsers().subscribe((usernames: string[]) => {
      this.connectedUsers = usernames.map(username => ({ username, id: '' })); 
      console.log('Updated user list:', this.connectedUsers);
  });
  


    // Listen for incoming chat messages
    this.socketService.receiveChat().subscribe((message) => {
        this.messages.push(message);  
        console.log('Received message:', message);
    });
}


  sendMessage(): void {
    if (this.message.trim()) {
      this.socketService.sendChat(this.sender, this.receiver, this.message);
      this.message = '';  
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
