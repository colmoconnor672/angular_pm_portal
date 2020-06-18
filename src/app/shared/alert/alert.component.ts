import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  // 1. Allows different error messages to be passed in
  @Input() message: string;

  // 2. Signals when Alert Close button clicked to signal to client
  // Components that the Alert message has been confirmed by the 
  // user and can be removed to proceed accordingly.
  @Output() close = new EventEmitter<void>();

  constructor() { }

  // Called from this components Html when Close btn clicked
  // Sends signal to Clients to react accordingly.
  onClose(){
    this.close.emit();
  }

  ngOnInit() {
  }

}
