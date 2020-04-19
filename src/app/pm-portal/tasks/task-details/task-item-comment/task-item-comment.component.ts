import { Component, OnInit, OnDestroy } from '@angular/core';
import { TaskEventsService } from 'src/app/services/task-events.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { TaskEvent } from 'src/app/models/taskEvent';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TasksService } from 'src/app/services/tasks.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-task-item-comment',
  templateUrl: './task-item-comment.component.html',
  styleUrls: ['./task-item-comment.component.css'],
  providers: [
        // This is for formatting to expected DB date format: yyyy-MM-dd HH:mm:ss
        DatePipe
  ]
})
export class TaskItemCommentComponent implements OnInit, OnDestroy {
  eventID: number;
  currentEvent: TaskEvent;
  taskForm: FormGroup;
  selectedTaskId: number;
  currentUser: User;
  sub1: Subscription;
  sub2: Subscription;
  sub3: Subscription;

  constructor(
    private authService: AuthService,
    private tasksService: TasksService, 
    private taskEventService: TaskEventsService, 
    private route: ActivatedRoute, 
    private router: Router, 
    private datepipe: DatePipe) { }

  ngOnInit() {

    this.sub1 = this.tasksService.taskSelected.subscribe(
      (selectedTaskId: number) => {
        console.log('TICC - selectedTaskId value = ' + selectedTaskId);
        this.selectedTaskId = selectedTaskId;
      }
    );
    
    
    this.sub2 = this.authService.user.subscribe(
      user => {
        console.log('TICC - user value = ' + user.id);
        this.currentUser = user;
      }
    );

    // initialise the reactive form elements here
    this.taskForm = new FormGroup({
      'comment': new FormControl(null, Validators.required)
    });

    //this.eventID = this.route.snapshot.params['id'];
    //this.loadData(this.eventID);

    // retrieve changing values of parameters from the Router
    this.sub3 = this.route.params.subscribe(
      (params: Params) => {
        this.eventID  = params['id'];
        console.log('TICC - In route.params.subscribe - calling loadData(' + this.eventID + ')');
        this.loadData(this.eventID);
      }
    );

  }

  loadData(eventID:number){
    console.log('TICC - In loadData(.) with event ID = ' + eventID);
    if(eventID){
      // In EDIT mode 
      this.taskEventService.getTaskEvent(eventID).subscribe(taskEvent => {
        console.log('TICC - In taskEventService.getTaskEvent - got TaskEvent from REST API');
        console.log(taskEvent);

        this.currentEvent = taskEvent
        this.taskForm.setValue({ comment: this.currentEvent.comment });
        });

    } else {
      // In ADD mode 
      this.taskForm.setValue({ comment: null });
    }
  }

  ngOnDestroy(){
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
    this.sub3.unsubscribe();
  }

  onSubmit(){
    console.log('In onSubmit() method. Form values submitted are ..');
    console.log(this.taskForm);

    if(this.eventID){
      // In EDIT mode - just update the existing currentEvent in DB
      this.currentEvent.comment = this.taskForm.value.comment;
      this.taskEventService.updateTaskEvent(this.currentEvent.id, this.currentEvent).subscribe(taskEvent => {
        this.currentEvent = taskEvent
        // i.e. NOTE: navigation - current path is 'comment/edit/:id'
        this.router.navigate(['../../../detail', this.selectedTaskId], {relativeTo: this.route} );
      });
    } 
    else {
      // In ADD mode  - create a new currentEvent and insert it into DB
      this.currentEvent = new TaskEvent();
      this.currentEvent.comment = this.taskForm.value.comment;
      this.currentEvent.eventType = { id: 1, description: 'Comment' };
      let commentDate = this.datepipe.transform(new Date(), 'dd-MM-yyyy HH:mm');
      this.currentEvent.event_date = commentDate;
      this.currentEvent.taskId = this.selectedTaskId;
      this.currentEvent.eventUser = {
        id: +this.currentUser.id,
        name: this.currentUser.name,
        email: this.currentUser.email,
        orgId: null,
        roles: null
      };
      this.taskEventService.createTaskEvent(this.currentEvent).subscribe(taskEvent => {
        this.currentEvent = taskEvent
        // i.e. NOTE: navigation - current path is 'comment/add'
        this.router.navigate(['../../detail', this.selectedTaskId], {relativeTo: this.route} );
      });
    }
  }

  onCancel(){
    if(this.eventID){
        // i.e. NOTE: navigation - current path is 'comment/edit/:id'
        this.router.navigate(['../../../detail', this.selectedTaskId], {relativeTo: this.route} );
    } else {
        // i.e. NOTE: navigation - current path is 'comment/add'
        this.router.navigate(['../../detail', this.selectedTaskId], {relativeTo: this.route} );
    }
  }
}
