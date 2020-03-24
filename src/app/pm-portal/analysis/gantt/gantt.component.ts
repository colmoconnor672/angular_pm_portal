import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, AfterViewInit, AfterViewChecked, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TasksService } from 'src/app/services/tasks.service';
import { TaskDependenciesService } from 'src/app/services/task-dependencies.service';
import { Task } from 'src/app/models/task';
import { TaskDependency } from 'src/app/models/taskDependency';
import { ProjectsService } from 'src/app/services/projects.service';
import 'dhtmlx-gantt';
import { Subscription } from 'rxjs';

@Component({
	encapsulation: ViewEncapsulation.None,
	selector: 'gantt',
  styleUrls: ['./gantt.component.css'],
  templateUrl: './gantt.component.html',
	providers: [TasksService, TaskDependenciesService]
	//, template: `<div #gantt_here class='gantt-chart'></div>`,
})
export class GanttComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  private sub1 = new Subscription();
  private sub2 = new Subscription();
  private projectId: number = null;
  private errorMessage;

  @ViewChild('gantt_here', {static: false}) ganttContainer: ElementRef;

	constructor(
    private projectsService: ProjectsService,
    private taskService: TasksService, 
    private dependenciesService: TaskDependenciesService,
    private cdRef : ChangeDetectorRef
    ) {}

  // Added this method to enable the alert-box to be closed. 
  // See AlertComponent for details
  onHandleError(){
      this.errorMessage = null;
    }

    ngOnInit() {
    }

    ngAfterViewChecked() {
      this.cdRef.detectChanges();
    }
  
    ngAfterViewInit() {

      this.sub1 = this.projectsService.projectSelected.subscribe(
        selectedProject => {
          console.log('Gantt - Loading data for Project ' + selectedProject);
          this.projectId = selectedProject;
          this.loadGanntData();
        }
      );

      this.loadGanntData();
    }

    loadGanntData() {
      if(this.projectId === null){
        console.log('Unable to render Gannt component - NO PROJECT SELECTED! ' +
                    'Please select a Project to continue.');
        // SHOW A POP-UP TO INFORM USER BEFORE EXITING HERE !!!
        this.errorMessage = 'Please select a Project to continue.';
        return;
      }

      /* 
      * TODO 
      ***************************************************************
      * NOW THAT WE HAVE A DEFINITE VALUE FOR this.projectId
      * 1. WE NEED TO FILTER TASKS BY PROJECT FOR PROJECT-TASKS ONLY !!
      * 2. ALSO NEED TO FILTER BY CURRENT USER !!
      * 3. ALSO NEED TO FILTER BY CURRENT USER ROLE !!
      * */

      gantt.config.xml_date = '%Y-%m-%d %H:%i:%s';
      gantt.config.date_format = "%Y-%m-%d %H:%i:%s";

      gantt.init(this.ganttContainer.nativeElement);

      gantt.clearAll();

      let _this = this;
      const dp = gantt.createDataProcessor({
        task: {
          update: (data: Task) => {
            console.log('Attempting to update Task id = ' + data.id);
            if (!data.description) {
              data.description = 'GANTT_NO_DATA';
            }
            this.sub2 = this.taskService.updateTask(data.id, data).subscribe((task:Task) => {
              data = task;
              _this.sub2.unsubscribe();
            });
          },
          create: (data: Task) => {
            console.log('Attempting to create Task id = ' + data.id);
            const ganntId: number = data.id;
            data.id = null;
            // TODO - may have to improve this if we can open Gantt for ALL projects!
            if(this.projectId === null){
              console.log('Unable to add Task - NO PROJECT SELECTED! ' +
                          'Please select a Project to continue.');
              
              // SHOW A POP-UP TO INFORM USER BEFORE EXITING HERE !!!
              this.errorMessage = 'Please select a Project to continue.';

              return;
            }
            data.projectId = this.projectId;

            data.description = data.text;
            data.status = {id: 1, description: "Preparing"};
            this.sub2 = this.taskService.createTask(data).subscribe((task:Task) => {
              data = task;
              console.log('Attempting to update Task id in Gannt from ' + ganntId + ' to ' + data.id);
              gantt.changeTaskId(ganntId, data.id);
              _this.sub2.unsubscribe();
            });
          },
          delete: (id) => {
            console.log('Attempting to delete Task id = ' + id);
            this.sub2 = this.taskService.deleteTask(id).subscribe( () => {
              _this.sub2.unsubscribe();
            });
          }
        },
        link: {
          update: (data: TaskDependency) => {
            console.log('Attempting to update TaskDependency id = ' + data.id);
          	this.sub2 = this.dependenciesService.update(data.id, data).subscribe((taskDep: TaskDependency) => {
              data = taskDep;
              _this.sub2.unsubscribe();
            })
          },
          create: (data: TaskDependency) => {
            console.log('Attempting to create TaskDependency id = ' + data.id);
            const ganntId: number = data.id;
            data.id = null;
          	this.sub2 = this.dependenciesService.insert(data).subscribe((taskDep: TaskDependency) => {
              data = taskDep;
              console.log('Attempting to update TaskDependency id in Gannt from ' + ganntId + ' to ' + data.id);
              gantt.changeLinkId(ganntId, data.id);
              _this.sub2.unsubscribe();
            })
          },
          delete: (id) => {
            console.log('Attempting to delete TaskDependency id = ' + id);
            this.sub2 = this.dependenciesService.remove(id).subscribe( 
              truth => {
                console.log( truth ? 'TaskDependency deleted at id: ' + id : 'ERROR - Could NOT delete TaskDependency at id: ' + id);
                _this.sub2.unsubscribe();
              },
              error => {
                console.log('ERROR - Could NOT delete TaskDependency - : ' + error);
                _this.sub2.unsubscribe();
              }
            )
          }
        }
      });

      Promise.all([this.taskService.getPromise(), this.dependenciesService.getPromise()])
        .then(
          ([data, links]) => {
            gantt.parse({ data, links });
        });
    }

    ngOnDestroy(){
      this.sub1.unsubscribe();
      if(this.sub2){
        this.sub2.unsubscribe();
      }
    }

}