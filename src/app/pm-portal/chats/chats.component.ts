import { Component, OnInit } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit {

  title = 'angular8-springboot-websocket';
  greeting: any;
  name: string;
  messages: string[] = [];
  isConnected: boolean = false;

  // constructor() { }
  constructor(private webSocketService: WebsocketService) { }

  ngOnInit() {
    this.webSocketService.chatUpdated.subscribe( message => {
      this.greeting = message;
      this.messages.push(message);
    })
  }

  connect(){
    this.webSocketService._connect();
    this.isConnected = true;
  }

  disconnect(){
    this.webSocketService._disconnect();
    this.isConnected = false;
  }

  sendMessage(){
    this.webSocketService._send(this.name);
    this.name = '';
  }

}
