import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TaskSchedulingComponent } from './task-scheduling.component';
import { GanttComponent } from './gantt/gantt.component';
import { SharedModule } from 'src/app/shared/shared.module';

const shedulingRoutes: Routes = [
  { path: '', component: TaskSchedulingComponent },
];

@NgModule({
  declarations: [
    TaskSchedulingComponent,
    GanttComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(shedulingRoutes),
    SharedModule
  ],
  exports: [RouterModule]
})
export class TaskSchedulingModule { }
