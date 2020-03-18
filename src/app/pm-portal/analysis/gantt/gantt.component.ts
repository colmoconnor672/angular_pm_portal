import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { TasksService } from 'src/app/services/tasks.service';
import { TaskDependenciesService } from 'src/app/services/task-dependencies.service';
import { Task } from 'src/app/models/task';
import { TaskDependency } from 'src/app/models/taskDependency';
import { ProjectsService } from 'src/app/services/projects.service';
import 'dhtmlx-gantt';

@Component({
	encapsulation: ViewEncapsulation.None,
	selector: 'gantt',
  styleUrls: ['./gantt.component.css'],
  templateUrl: './gantt.component.html',
	providers: [TasksService, TaskDependenciesService]
	//, template: `<div #gantt_here class='gantt-chart'></div>`,
})
export class GanttComponent implements OnInit, AfterViewInit {

  @ViewChild('gantt_here', {static: false}) ganttContainer: ElementRef;

	constructor(
    private projectsService: ProjectsService,
    private taskService: TasksService, 
    private dependenciesService: TaskDependenciesService) {}

    ngOnInit() {
    }
    
    ngAfterViewInit() {

      gantt.config.xml_date = '%Y-%m-%d %H:%i:%s';
      gantt.config.date_format = "%Y-%m-%d %H:%i:%s";

      gantt.init(this.ganttContainer.nativeElement);

      const dp = gantt.createDataProcessor({
        task: {
          update: (data: Task) => {
            console.log('Attempting to update Task id = ' + data.id);
            if (!data.description) {
              data.description = 'GANTT_NO_DATA';
            }
            this.taskService.updateTask(data.id, data).subscribe((task:Task) => {
              data = task;
            });
          },
          create: (data: Task) => {
            console.log('Attempting to create Task id = ' + data.id);
            const ganntId: number = data.id;
            data.id = null;
            // TODO - may have to improve this if we can open Gantt for ALL projects!
            data.projectId = this.projectsService.getCurrentProjectId();
            
            data.description = data.text;
            data.status = {id: 1, description: "Preparing"};
            this.taskService.createTask(data).subscribe((task:Task) => {
              data = task;
              console.log('Attempting to update Task id in Gannt from ' + ganntId + ' to ' + data.id);
              gantt.changeTaskId(ganntId, data.id);
            });
          },
          delete: (id) => {
            console.log('Attempting to delete Task id = ' + id);
            this.taskService.deleteTask(id).subscribe();
          }
        },
        link: {
          update: (data: TaskDependency) => {
            console.log('Attempting to update TaskDependency id = ' + data.id);
          	this.dependenciesService.update(data.id, data).subscribe((taskDep: TaskDependency) => {
              data = taskDep;
            })
          },
          create: (data: TaskDependency) => {
            console.log('Attempting to create TaskDependency id = ' + data.id);
            const ganntId: number = data.id;
            data.id = null;
          	this.dependenciesService.insert(data).subscribe((taskDep: TaskDependency) => {
              data = taskDep;
              console.log('Attempting to update TaskDependency id in Gannt from ' + ganntId + ' to ' + data.id);
              gantt.changeLinkId(ganntId, data.id);
            })
          },
          delete: (id) => {
            console.log('Attempting to delete TaskDependency id = ' + id);
            this.dependenciesService.remove(id).subscribe( 
              truth => {
                console.log( truth ? 'TaskDependency deleted at id: ' + id : 'ERROR - Could NOT delete TaskDependency at id: ' + id);
              },
              error => {
                console.log('ERROR - Could NOT delete TaskDependency - : ' + error);
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
}