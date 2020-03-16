import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Task } from 'src/app/models/task';
import { TasksService } from 'src/app/services/tasks.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-task-item-detail',
  templateUrl: './task-item-detail.component.html',
  styleUrls: ['./task-item-detail.component.css']
})
export class TaskItemDetailComponent implements OnInit {
  private taskid: number;
  currentTask: Observable<Task>;
  private sub1: Subscription;

  constructor(
    private tasksService: TasksService, 
    private router: Router, 
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.sub1 = this.tasksService.taskSelected.subscribe(
      (selectedTaskId: number) => {
        console.log('selectedTaskId value = ' + selectedTaskId);
        this.loadData(selectedTaskId);
      }
    );

    this.route.params.subscribe(
      (params: Params) => {
        this.taskid = params['id'];
        this.loadData(this.taskid);
      }
    )

  }

  loadData(taskId: number) {
    this.tasksService.getTask(taskId).subscribe(
      task => {
        console.log('task = ' + task);
        this.currentTask = task;
      }
    );
  }

  onEditTask(){
    const id: number = + this.route.snapshot.params['id'];
    this.router.navigate(['../../edit', id], {relativeTo: this.route} );
  }

  onAddTask(){
    this.router.navigate(['../../add'], {relativeTo: this.route} );
  }

  ngOnDestroy(){
    this.sub1.unsubscribe();
  }

}
