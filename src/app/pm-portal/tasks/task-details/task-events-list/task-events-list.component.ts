import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Task } from 'src/app/models/task';
import { TasksService } from 'src/app/services/tasks.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TaskEvent } from 'src/app/models/taskEvent';

@Component({
	encapsulation: ViewEncapsulation.None,
  selector: 'app-task-events-list',
  templateUrl: './task-events-list.component.html',
  styleUrls: ['./task-events-list.component.css']
})
export class TaskEventsListComponent implements OnInit {
  //private taskid: number;
  //currentTask: Observable<Task>;
  //private sub1: Subscription;
  //eventsList: TaskEvent[];

  @Input() taskItem: Task;

  constructor(
    private tasksService: TasksService, 
    private router: Router, 
    private route: ActivatedRoute) { }

  ngOnInit() {
    // this.sub1 = this.tasksService.taskSelected.subscribe(
    //   (selectedTaskId: number) => {
    //     console.log('TEL - taskSelected: selectedTaskId value = ' + selectedTaskId);
    //     this.taskid = selectedTaskId;
    //     //this.loadData(selectedTaskId);
    //   }
    // );

    // this.route.params.subscribe(
    //   (params: Params) => {
    //     this.taskid = params['id'];
    //     if(this.taskid){
    //       console.log('TEL - route.params: selectedTaskId value = ' + this.taskid);
    //       //this.loadData(this.taskid);
    //     }
    //   }
    // )

  }

  // loadData(taskId: number) {
  //   this.tasksService.getTask(taskId).subscribe(
  //     task => {
  //       console.log('task = ' + task);
  //       this.currentTask = task;
        
  //       // TODO - Now get list of associated Events for display
  //       //this.eventsList = this.currentTask.
  //     }
  //   );
  // }

  onEditEvent(){
    const id: number = + this.route.snapshot.params['id'];
    this.router.navigate(['../../edit', id], {relativeTo: this.route} );
  }

  onAddEvent(){
    this.router.navigate(['../../add'], {relativeTo: this.route} );
  }

  onAddCommentEvent(){
    this.router.navigate(['../../comment/add'], {relativeTo: this.route} );
  }


  ngOnDestroy(){
    //this.sub1.unsubscribe();
  }
  
}
