import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit, OnDestroy {

  greeting: any;
  message: string;
  messages: string[] = [];
  isConnected: boolean = false;
  sub1: Subscription;

  constructor(private webSocketService: WebsocketService) { }

  ngOnInit() {
    this.sub1 = this.webSocketService.chatUpdated.subscribe( message => {
      this.greeting = message;
      this.messages.push(message);
    })
  }

  ngOnDestroy(){
    if(this.isConnected){
      this.disconnect();
      this.sub1.unsubscribe();
    }
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
    this.webSocketService._send(this.message);
    this.message = '';
  }

}
