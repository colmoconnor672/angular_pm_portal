import { Component, OnInit, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';
//import { multi } from './stacked-vertical-bar-chart-data';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/format-datepicker';
import { DatePipe } from '@angular/common';
import { TasksService } from 'src/app/services/tasks.service';
import { OrganisationService } from 'src/app/services/organisation.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { Observable } from 'rxjs';
import { Project } from 'src/app/models/project';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-stacked-vertical-bar-chart',
  templateUrl: './stacked-vertical-bar-chart.component.html',
  styleUrls: ['./stacked-vertical-bar-chart.component.css'],
  providers: [
    // These 2 provisions relate solely to formatting the Material DatePicker control on the UI
    // See shared/format-datepicker.ts for more details - format: dd/MM/yyyy
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS},
    // This is for formatting back to expected DB date format: yyyy-MM-dd HH:mm:ss
    DatePipe
  ]
})
export class StackedVerticalBarChartComponent implements OnInit {
  orgId: number;
  projectId: number = null;
  startDate: string = null;
  endDate: string = null;
  projects: Observable<Project[]>;
  taskForm: FormGroup;
  doExtendedSearch: boolean = false;
  multi: any[];
  view: any[] = [700, 400];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Projects';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Tasks';
  animations: boolean = true;

  //#ff0000

  colorScheme = {
    domain: ['#5AA454', '#ff6347', '#ffd700', '#b8860b', '#AAAAAA', '#008b8b']
  };

  constructor(
    private orgService: OrganisationService, 
    private projectsService: ProjectsService,
    private tasksService: TasksService,
    public datepipe: DatePipe
  ) {}

  ngOnInit() {

    this.orgService.organisationSelected.subscribe(orgId => {
      this.orgId = orgId;
      this.projects = this.projectsService.getProjectListForOrganisation(this.orgId);
    });

    // initialise the reactive form elements here
    this.taskForm = new FormGroup({
      'extendedSearch': new FormControl(null),
      'project': new FormControl(null),
      'filterDates': new FormControl(null),
      'startDate': new FormControl(null),
      'endDate': new FormControl(null)
    });

    this.taskForm.setValue(
      {
        extendedSearch: false,
        project: null,
        filterDates: false,
        startDate: null,
        endDate: null
      }
    );

    this.tasksService.getSVB_ChartData(this.orgId, this.projectId, this.startDate, this.endDate, this.doExtendedSearch).subscribe(list => {
      this.multi = list;
      Object.assign(this, { list });
    });

  } // end ngOnInit() method

  onSelect(event) {
    console.log(event);
  }

  onSubmit(){
    this.projectId = this.taskForm.value.project;

    if(this.taskForm.value.startDate && this.taskForm.value.endDate){
      this.startDate = this.datepipe.transform(this.taskForm.value.startDate, 'yyyy-MM-dd');
      this.endDate = this.datepipe.transform(this.taskForm.value.endDate, 'yyyy-MM-dd');
    } else {
      this.startDate = null;
      this.endDate = null;
    }
    this.doExtendedSearch = this.taskForm.value.extendedSearch;
    this.tasksService.getSVB_ChartData(this.orgId, this.projectId, this.startDate, this.endDate, this.doExtendedSearch).subscribe(list => {
      this.multi = list;
      Object.assign(this, { list });
    });
  }

  onToggleExtendedSearch(){
    if(this.taskForm.value.extendedSearch){
      this.taskForm.patchValue({ extendedSearch: false });
    } else {
      this.taskForm.patchValue({ extendedSearch: true });
    }
  }

  onToggleDateFilter() {
    if(this.taskForm.value.filterDates){
      this.taskForm.patchValue({ filterDates: false, startDate: null, endDate: null });
      // calling submit here to get rid of any date filters applied while available
      this.onSubmit();
    } else {
      this.taskForm.patchValue({ filterDates: true });
    }
  }


}
