import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Task } from 'src/app/models/task';
import { TasksService } from 'src/app/services/tasks.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-task-item-detail',
  templateUrl: './task-item-detail.component.html',
  styleUrls: ['./task-item-detail.component.css']
})
export class TaskItemDetailComponent implements OnInit, OnDestroy {
  private taskid: number;
  currentTask: Observable<Task>;
  private assignedToUser: User;
  private sub1: Subscription;
  private sub2: Subscription;

  constructor(
    private userService: UsersService,
    private tasksService: TasksService, 
    private router: Router, 
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.sub1 = this.tasksService.taskSelected.subscribe(
      (selectedTaskId: number) => {
        if(selectedTaskId){
          console.log('TIDC - tasksService.taskSelected.subscribe(.) - selectedTaskId value = ' + selectedTaskId);
          this.loadData(selectedTaskId);
        }
      }
    );

    this.sub2 = this.tasksService.tasksUpdated.subscribe(
      (updatedTaskId: number) => {
        console.log('TIDC - tasksService.tasksUpdated.subscribe(.) - updatedTaskId value = ' + updatedTaskId);
        this.loadData(updatedTaskId);
      }
    );

    this.route.params.subscribe(
      (params: Params) => {
        this.taskid = params['id'];
        console.log('TIDC - route.params.subscribe(..) route TaskId value = ' + this.taskid);
        this.tasksService.taskSelected.next(this.taskid);
      }
    )

  }

  loadData(taskId: number) {
    this.tasksService.getTask(taskId).subscribe(
      task => {
        console.log('task = ' + task);
        this.currentTask = task;
        if(task && task.assignedTo){
          this.userService.getUser(task.assignedTo).subscribe(user =>{
            this.assignedToUser = user;
          });
          }
      }
    );
  }


  onEditTask(){
    const id: number = + this.route.snapshot.params['id'];
    this.router.navigate(['../../edit', id], {relativeTo: this.route} );
  }

  onAddTask(){
    this.router.navigate(['../../add'], {queryParams: {addMode: 'true'}, relativeTo: this.route} );
  }

  onAssignTask(){
    const id: number = + this.route.snapshot.params['id'];
    this.router.navigate(['../../assign', id], {relativeTo: this.route} );
  }

  ngOnDestroy(){
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
  }

}
