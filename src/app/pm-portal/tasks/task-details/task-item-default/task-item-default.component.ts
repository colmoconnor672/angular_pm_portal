import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-task-item-default',
  templateUrl: './task-item-default.component.html',
  styleUrls: ['./task-item-default.component.css']
})
export class TaskItemDefaultComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
  }

  onAddTask(){
    this.router.navigate(['add'], {queryParams: {addMode: 'true'}, relativeTo: this.route} );
  }

}
