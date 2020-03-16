import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Task } from 'src/app/models/task';
import { TasksService } from 'src/app/services/tasks.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-item-edit',
  templateUrl: './task-item-edit.component.html',
  styleUrls: ['./task-item-edit.component.css']
})
export class TaskItemEditComponent implements OnInit {

  private taskid: number;
  currentTask: Observable<Task>;
  private sub1: Subscription;
  taskForm: FormGroup;

  constructor(
    private tasksService: TasksService, 
    private router: Router, 
    private route: ActivatedRoute) { }

  ngOnInit() {
    // initialise the reactive form here
    this.taskForm = new FormGroup({
      'id': new FormControl(null),
      'title': new FormControl(null, Validators.required),
      'description': new FormControl(null, Validators.required),
      'projectId': new FormControl(null),
      'status': new FormControl(null, Validators.required),
      'statusId': new FormControl(null)
    });

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

        this.taskForm.setValue(
          {
            id: task.id,
            title: task.title,
            description: task.description,
            projectId: task.projectId,
            status: task.status.description,
            statusId: task.status.id
          }
        );
          }
    );
  }

  onSubmit(){
    console.log('In onSubmit() method. Form values submitted are ..');
    console.log(this.taskForm);
  }

  ngOnDestroy(){
    this.sub1.unsubscribe();
  }

}
