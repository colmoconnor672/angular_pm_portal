import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Task } from 'src/app/models/task';
import { TasksService } from 'src/app/services/tasks.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css']
})
export class TasksListComponent implements OnInit {

  tasks: Observable<Task[]>;
  projectId: number;
  sub1: Subscription;


  constructor(
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
    this.sub1 = this.projectsService.projectSelected.subscribe(
      selectedProject => {
        console.log('TLC - In projectsService.projectSelected.subscribe');
        this.projectId = selectedProject;
        this.reloadData();
      }
    );
    
    //this.reloadData();
  }

  reloadData() {
    console.log('TLC - In reloadData() method');
    if (this.projectId == undefined) {
      this.tasks = this.tasksService.getTaskList();
    } else {
      this.tasks = this.tasksService.getTaskListForProject(this.projectId);
    }
    console.log('TLC - Leaving reloadData() method');
  }
  
  onTaskSelected(taskId:number) {
    console.log('TLC - In onTaskSelected() method');
    this.tasksService.taskSelected.next(taskId);
  }
  
  ngOnDestroy(){
    console.log('TLC - In ngOnDestroy() method');
    this.sub1.unsubscribe();
  }

}
