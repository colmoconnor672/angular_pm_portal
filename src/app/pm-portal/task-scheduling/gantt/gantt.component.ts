import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, 
          OnDestroy} from '@angular/core';
import { TasksService } from 'src/app/services/tasks.service';
import { TaskDependenciesService } from 'src/app/services/task-dependencies.service';
import { Task } from 'src/app/models/task';
import { TaskDependency } from 'src/app/models/taskDependency';
import { ProjectsService } from 'src/app/services/projects.service';
import 'dhtmlx-gantt';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { TaskPriority } from 'src/app/models/TaskPriority';

@Component({
	encapsulation: ViewEncapsulation.None,
	selector: 'gantt',
  styleUrls: ['./gantt.component.css'],
  templateUrl: './gantt.component.html',
  providers: [DatePipe]
})
export class GanttComponent implements OnInit, OnDestroy {
  private sub1 = new Subscription();
  private sub2 = new Subscription();
  projectId: number = null;
  errorMessage;

  @ViewChild('gantt_here', {static: true}) ganttContainer: ElementRef;

	constructor(
    private projectsService: ProjectsService,
    private taskService: TasksService, 
    private dependenciesService: TaskDependenciesService,
    public datepipe: DatePipe
    ) {}

  // Added this method to enable the alert-box to be closed. 
  // See AlertComponent for details
  onHandleError(){
      this.errorMessage = null;
  }

  ngOnInit() {
    console.log('In ngOnInit() method');

    this.sub1 = this.projectsService.projectSelected.subscribe(
      selectedProject => {
        console.log('Gantt - Loading data for new Project Selected id ' + selectedProject);
        this.projectId = selectedProject;
        this.loadGanntData();
      }
    );
  }

  loadGanntData() {
    if(this.projectId === null){
      console.log('Unable to render Gannt component - NO PROJECT SELECTED! ' +
                  'Please select a Project to continue.');
      // SHOW A POP-UP TO INFORM USER BEFORE EXITING HERE !!!
      //this.errorMessage = 'Please select a Project to continue.';
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

    console.log('ENTERED THE loadGanntData() METHOD **********************************');

    //gantt.config.xml_date = '%Y-%m-%d %H:%i:%s';
    gantt.config.date_format = "%Y-%m-%d %H:%i:%s";
    gantt.config.date_grid = "%d-%m-%Y";

    gantt.init(this.ganttContainer.nativeElement);

    // remove any existing gantt content and remove all attached events!
    this.clearGanttChart();

    let _this = this;

    // Create a gantt DataProcessor to interact with our local Data Storage Services
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
          let _dateTime = this.datepipe.transform(new Date(), 'dd/MM/yyyy H:m:s Z')

          // TODO - may have to improve this if we can open Gantt for ALL projects!
          if(this.projectId === null){
            console.log('Unable to add Task - NO PROJECT SELECTED! ' +
                        'Please select a Project to continue.');
            // SHOW A POP-UP TO INFORM USER BEFORE EXITING HERE !!!
            this.errorMessage = 'Please select a Project to continue.';
            return;
          }

          // set the Task project to current project selected
          data.projectId = this.projectId;

          // set some other default values for some of our other fields 
          // that are not part of gantt dataset
          data.description = data.text;
          data.status = {id: 1, description: "Preparing"};
          data.priority = {id: 1, level: "Low"};

          // correct the parent.id value which is usually wrong (e.g. 148290467301) !!
          if(data.parent){
            console.log('data.parent = ' + data.parent);
            let parentTask: Task = gantt.getTask(data.parent);
            if(parentTask){
              console.log('FOUND: parentTask ID = ' + parentTask.id);
              data.parent = parentTask.id;
            } else {
              console.log('WARNING: No task Node found for parentTask ID = ' + data.parent);
            }
          }
          
          this.sub2 = this.taskService.createTask(data).subscribe(
            (task:Task) => {
            console.log(_dateTime + ' : Attempting to mixin Task id in Gannt from ' + ganntId + ' to ' + task.id);
            gantt.changeTaskId(ganntId, task.id);
            gantt.mixin(data, task, true);
            console.log('NOTE: task Node id changed from ' + ganntId + ' to Task ID = ' + data.id);
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
            console.log('Attempting to update TaskDependency id in Gannt from ' + ganntId + ' to ' + data.id);
            gantt.changeLinkId(ganntId, taskDep.id);
            gantt.mixin(data, taskDep, true);
            _this.sub2.unsubscribe();
          });
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

    Promise.all([
      this.taskService.getProjectTasksAsPromise(this.projectId), 
      this.dependenciesService.getTaskDependenciesAsPromise(this.projectId)])
      .then(
        ([data, links]) => {
          gantt.parse({ data, links });
      });

  }

  clearGanttChart(){
    gantt.clearAll()
    gantt.detachAllEvents();
  }

  ngOnDestroy(){
    this.sub1.unsubscribe();
    if(this.sub2){
      this.sub2.unsubscribe();
    }
    this.clearGanttChart();
  }

}