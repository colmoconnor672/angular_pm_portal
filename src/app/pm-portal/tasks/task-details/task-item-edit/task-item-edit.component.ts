import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Task } from 'src/app/models/task';
import { TasksService } from 'src/app/services/tasks.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TaskStatus } from 'src/app/models/TaskStatus';
import { TaskPriority } from 'src/app/models/TaskPriority';
import { SupportDataService } from 'src/app/services/support-data.service';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/format-datepicker';
import { DatePipe } from '@angular/common';
import { Project } from 'src/app/models/project';
import { ProjectsService } from 'src/app/services/projects.service';
import { OrganisationService } from 'src/app/services/organisation.service';

@Component({
  selector: 'app-task-item-edit',
  templateUrl: './task-item-edit.component.html',
  styleUrls: ['./task-item-edit.component.css'],
  providers: [
    // These 2 provisions relate solely to formatting the Material DatePicker control on the UI
    // See shared/format-datepicker.ts for more details - format: dd/MM/yyyy
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS},
    // This is for formatting back to expected DB date format: yyyy-MM-dd HH:mm:ss
    DatePipe
  ]
})
export class TaskItemEditComponent implements OnInit {
  private isAddMode: boolean = false;
  private orgId: number;
  private projectId: number;
  private taskid: number;
  currentTask: Observable<Task>;
  private sub1: Subscription;
  private sub2: Subscription;
  private sub3: Subscription;
  private sub4: Subscription;
  private sub5: Subscription;
  taskForm: FormGroup;
  allStatus: Observable<TaskStatus>;
  allPriorities: Observable<TaskPriority>;
  allProjects: Observable<Project>;
  allTasks: Observable<Task>;

  constructor(
    private orgService: OrganisationService,
    private projectsService: ProjectsService,
    private tasksService: TasksService, 
    private supportDataService: SupportDataService,
    public datepipe: DatePipe,
    private router: Router, 
    private route: ActivatedRoute) { }

  ngOnInit() {
    // populate the allProjects supporting list
    this.sub2 = this.orgService.organisationSelected.subscribe(org => {
      this.orgId = org;
      this.projectsService.getProjectListForOrganisation(org).subscribe(projectsList => {
        this.allProjects = projectsList;
      });
    });

    // populate the allTasks supporting list
    this.sub3 = this.projectsService.projectSelected.subscribe(projectId => {
      this.projectId = projectId;
      this.tasksService.getTaskListForProject(projectId).subscribe(tasksList => {
        this.allTasks = tasksList;
      })
    });

    // populate the allStatus supporting list
    this.sub4 = this.supportDataService.getTaskStatusList().subscribe( statusList => {
      this.allStatus = statusList;
    });
 
    // populate the allPriorities supporting list
    this.sub5 = this.supportDataService.getTaskPriorityList().subscribe( priorityList => {
      this.allPriorities = priorityList;
    });

    // initialise the reactive form elements here
    this.taskForm = new FormGroup({
      'id': new FormControl(null),
      'text': new FormControl(null, Validators.required),
      'description': new FormControl(null, Validators.required),
      'projectId': new FormControl(null, Validators.required),
      'status': new FormControl(null, Validators.required),
      'priority': new FormControl(null, Validators.required),
      'start_date': new FormControl(null, Validators.required),
      'progress': new FormControl(null, Validators.required),
      'duration': new FormControl(null, Validators.required),
      'parent': new FormControl(null)
    });

    this.sub1 = this.tasksService.taskSelected.subscribe(
      (selectedTaskId: number) => {
        console.log('selectedTaskId value = ' + selectedTaskId);
        this.loadData(selectedTaskId, false);
      }
    );

    this.route.params.subscribe(
      (params: Params) => {
        this.taskid = params['id'];
        let mode = this.route.snapshot.queryParams['addMode'];
        this.isAddMode = (mode === 'true') ? true : false;
        this.loadData(this.taskid, this.isAddMode);
      }
    )

  }

  loadData(taskId: number, isAddMode: boolean) {
    console.log('TIEC -  in loadData(.) method. Parameter isAddMode = ' + isAddMode);
    if (isAddMode) {
      this.taskForm.setValue(
        {
          id: null,
          text: null,
          description: null,
          projectId: this.projectId,
          status: new TaskStatus(),
          priority: new TaskPriority(),
          start_date: new Date(),
          progress: 0,
          duration: null,
          parent: null
        }
      );
    } 
    else {
      this.tasksService.getTask(taskId).subscribe(
        task => {
          console.log('task = ' + task);
          this.currentTask = task;
          this.taskid = task.id;
          this.taskForm.setValue(
            {
              id: task.id,
              text: task.text,
              description: task.description,
              projectId: task.projectId,
              status: task.status.id,
              priority: task.priority.id,
              start_date: new Date(task.start_date),
              progress: task.progress,
              duration: task.duration,
              parent: task.parent
            }
          );
        }
      );
    }
  }

  onSubmit(){
    console.log('In onSubmit() method. Form values submitted are ..');
    console.log(this.taskForm);

    // prepare a new Task instance based on incoming user values
    let updatedTask: Task = new Task();
    updatedTask.id = this.taskForm.value.id;
    updatedTask.text = this.taskForm.value.text;
    updatedTask.description = this.taskForm.value.description;
    updatedTask.projectId = this.taskForm.value.projectId;
    updatedTask.progress = this.taskForm.value.progress;
    updatedTask.duration = this.taskForm.value.duration;
    updatedTask.parent = this.taskForm.value.parent;

    // format the selected date to the approriate date-string json format
    // let updatedStartDate = this.datepipe.transform(this.taskForm.value.start_date, 'yyyy-MM-dd HH:mm:ss');
    let updatedStartDate = this.datepipe.transform(this.taskForm.value.start_date, 'yyyy-MM-dd 00:00:00');
    updatedTask.start_date = updatedStartDate;

    // find and set the relevant TaskStatus for the selected Status value
    this.allStatus.forEach((value: TaskStatus) => {
      if(value.id === this.taskForm.value.status){
        updatedTask.status = value;
      }
    });


    // find and set the relevant TaskPriority for the selected Priority value
    this.allPriorities.forEach((value: TaskPriority) => {
      if(value.id === this.taskForm.value.priority){
        updatedTask.priority = value;
      }
    });

    if(this.isAddMode) {
      // call local taskService to ADD the TASK to the DB via REST api
      this.tasksService.createTask(updatedTask).subscribe(
        task => {
          this.currentTask = task;
          this.taskid = task.id;
          this.tasksService.tasksUpdated.next(task.id);
          console.log('TIEC - Added new Task with id ' + task.id);
          console.log('TIEC - last Route = ' + this.route.toString() );
          console.log('TIEC - last Route.queryParams = ' + this.route.queryParams );

          this.router.navigate(['projects/tasks/detail', this.taskid]);
        }
      );
    } 
    else {
      // call local taskService to UPDATE the TASK in the DB via REST api
      this.tasksService.updateTask(updatedTask.id, updatedTask).subscribe(
        task => {
          this.currentTask = task;
          this.taskid = task.id;
          this.tasksService.tasksUpdated.next(updatedTask.id);
          console.log('TIEC - Update existing Task with id ' + updatedTask.id);
          this.router.navigate(['../../detail', this.taskid], {relativeTo: this.route} );
        }
      );
    }

  }

  ngOnDestroy(){
    // unsubscribe from all subscriptions
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
    this.sub3.unsubscribe();
    this.sub4.unsubscribe();
    this.sub5.unsubscribe();
  }

  formatProgressLabel = (v: boolean) => {
    return (value: number) => {
      var result = value * 100 + '%'; 
      return result;
   }
  }
  
  onProgressSliderChanged(value: number){
    this.taskForm.patchValue({
      progress: value
    });
  }

}
