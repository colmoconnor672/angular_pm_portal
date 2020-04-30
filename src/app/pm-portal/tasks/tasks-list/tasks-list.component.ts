import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Task } from 'src/app/models/task';
import { TasksService } from 'src/app/services/tasks.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { Role } from 'src/app/models/role';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css']
})
export class TasksListComponent implements OnInit, OnDestroy {

  tasks: Observable<Task[]>;
  loggedInUserId: number;
  loggedInUserRoles: Role[];
  projectId: number;
  sub1: Subscription;
  sub2: Subscription;
  sub3: Subscription;


  constructor(
    private authService: AuthService,
    private tasksService: TasksService, 
    private projectsService: ProjectsService,
    private router: Router, 
    private route: ActivatedRoute) {
      console.log('TLC - In constructor() method');
      route.params.subscribe(
      params => console.log("TLC - Tasks id parameter was ", params['id'])
    );
  }

  ngOnInit() {
    console.log('TLC - In ngOnInit() method - b4 projectsService.projectSelected.subscribe ..');

    this.sub1 = this.authService.user.subscribe((user:User) => {
      this.loggedInUserId = + user.id
      this.loggedInUserRoles = user.roles
    });

    this.sub2 = this.projectsService.projectSelected.subscribe(
      (selectedProject: number) => {
        console.log('TLC - In projectsService.projectSelected.subscribe');
        this.projectId = selectedProject;
        this.reloadData();
      }
    );

    this.sub3 = this.tasksService.tasksUpdated.subscribe(
      (updatedTaskId: number) => {
        console.log('updatedTaskId value = ' + updatedTaskId);
        this.reloadData();
      }
    );

  }

  reloadData() {
    console.log('TLC - In reloadData() method');
    if (this.projectId) {
      this.tasks = this.tasksService.getTaskListForProject(this.projectId);
    }
    console.log('TLC - Leaving reloadData() method');
  }
  
  
  ngOnDestroy(){
    console.log('TLC - In ngOnDestroy() method');
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
    this.sub3.unsubscribe();
  }

}
