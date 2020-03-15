import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  webSocketEndPoint: string = 'http://localhost:8081/pm_portal/ws';
  topic: string = "/topic/messageBoard";
  stompClient: any;
  chatUpdated = new Subject<string>();
  
  constructor(){}

  _connect() {
      console.log("Initialize WebSocket Connection");
      let ws = new SockJS(this.webSocketEndPoint);
      this.stompClient = Stomp.over(ws);
      const _this = this;
      _this.stompClient.connect(
          {"Authorization": 'Basic ' + btoa('admin' + ':' + 'password')}, 
          function (frame) {
            _this.stompClient.subscribe(
                _this.topic, function (sdkEvent) {
                    const payload = JSON.parse(sdkEvent.body);
                    _this.onMessageReceived(payload.content);
                }
            );
            //_this.stompClient.reconnect_delay = 2000;
        }, this.errorCallBack
      );
  };

  _disconnect() {
      if (this.stompClient !== null) {
          this.stompClient.disconnect();
      }
      console.log("Disconnected");
  }

  // on error, schedule a reconnection attempt
  errorCallBack(error) {
      console.log("errorCallBack -> " + error)
      setTimeout(() => {
          this._connect();
      }, 5000);
  }

/**
* Send message to sever via web socket
* @param {*} message 
*/
  _send(message) {
      console.log("calling logout api via web socket");
      this.stompClient.send("/app/uploadMessage", {}, JSON.stringify(this.getCurrentUserEmail() + message));
  }

  onMessageReceived(message) {
      console.log("Message Recieved from Server :: " + message);
      //console.log("Parsed Message from Server :: " + JSON.parse(message));
      this.chatUpdated.next(message);
  }

    private getCurrentUserEmail(): string {
        let userEmail: string = '';
        const userData: {
            email: string,
            id: string,
            authorities: string,
            roles: string,
            _token: string,
            _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userData'));
        if (userData) {
            userEmail = userData.email + ' :: ';
        }
        return userEmail;
    }

}
