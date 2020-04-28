import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { Subscription } from 'rxjs';
import { OrganisationService } from 'src/app/services/organisation.service';
import { FormGroup, FormControl } from '@angular/forms';
import { User } from 'src/app/models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksService } from 'src/app/services/tasks.service';
import { TaskEvent } from 'src/app/models/taskEvent';
import { TaskEventsService } from 'src/app/services/task-events.service';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-task-item-assign',
  templateUrl: './task-item-assign.component.html',
  styleUrls: ['./task-item-assign.component.css'],
  providers: [
    // This is for formatting to expected DB date format: yyyy-MM-dd HH:mm:ss
    DatePipe
]

})
export class TaskItemAssignComponent implements OnInit, OnDestroy {
  orgUsersList: User[];
  orgId: number;
  sub1: Subscription;
  sub2: Subscription;
  sub3: Subscription;
  assignmentForm: FormGroup;
  selectedTaskId: number;
  currentUser: User;


  constructor(
    private authService: AuthService,
    private usersService: UsersService, 
    private orgService: OrganisationService,
    private tasksService: TasksService,
    private taskEventService: TaskEventsService,
    private datepipe: DatePipe,
    private router:Router,
    private route: ActivatedRoute){}

  ngOnInit() {
    // setup a simple form to reflect the screen content needed
    this.assignmentForm = new FormGroup({
      'selectedUser': new FormControl(null),
      'comment': new FormControl(null)
    });

    // subscribe to the orgService.organisationSelected BehaviorSubject to get the current orgId
    this.sub1 = this.orgService.organisationSelected.subscribe((loggedInOrgId: number) => {
      this.orgId = loggedInOrgId;
      // use the orgId to get the users list for this Organisation
      this.usersService.getUsersForOrg(this.orgId).subscribe(
        (userList: any) => {
          this.orgUsersList = userList;
        }
      );
    });

    this.sub2 = this.tasksService.taskSelected.subscribe(
      (selectedTaskId: number) => {
        console.log('TIAC - selectedTaskId value = ' + selectedTaskId);
        this.selectedTaskId = selectedTaskId;
      }
    );

    this.sub3 = this.authService.user.subscribe(
      user => {
        console.log('TICC - user value = ' + user.id);
        this.currentUser = user;
      }
    );

  }

  ngOnDestroy(){
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
    this.sub3.unsubscribe();
  }

  isUserSelected(id: number){
    if(!this.assignmentForm.value.selectedUser){
      return false;
    } else {
      return id == this.assignmentForm.value.selectedUser;
    }
  }

  onSubmit(){
    let assEvent = new TaskEvent();
    assEvent.assignedTo =  {
      id: +this.assignmentForm.value.selectedUser,
      name: null, email: null, orgId: null, roles: null
    };
    assEvent.assignedBy = { id: +this.currentUser.id,
      name: null, email: null, orgId: null, roles: null
    };    
    assEvent.comment = this.assignmentForm.value.comment;
    assEvent.eventType = { id: 3, description: 'Assignment' };
    let commentDate = this.datepipe.transform(new Date(), 'dd-MM-yyyy HH:mm');
    assEvent.event_date = commentDate;
    assEvent.taskId = this.selectedTaskId;
    assEvent.eventUser = { id: +this.currentUser.id,
      name: null, email: null, orgId: null, roles: null
    };
    this.taskEventService.createTaskEvent(assEvent).subscribe(taskEvent => {
      // i.e. NOTE: navigation - current path is 'assign/add'
      this.router.navigate(['../../detail', this.selectedTaskId], {relativeTo: this.route} );
    });

  }

  onCancel(){
    // i.e. NOTE: navigation - current path is 'assign/:id'
    this.router.navigate(['../../detail', this.selectedTaskId], {relativeTo: this.route} );
  }
  
}
