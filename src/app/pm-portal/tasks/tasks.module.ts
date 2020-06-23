import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TasksComponent } from './tasks.component';
import { TaskItemDefaultComponent } from './task-details/task-item-default/task-item-default.component';
import { TaskItemDetailComponent } from './task-details/task-item-detail/task-item-detail.component';
import { TaskItemEditComponent } from './task-details/task-item-edit/task-item-edit.component';
import { TaskItemAssignComponent } from './task-details/task-item-assign/task-item-assign.component';
import { TaskItemCommentComponent } from './task-details/task-item-comment/task-item-comment.component';
import { TaskItemFileUploadComponent } from './task-details/task-item-file-upload/task-item-file-upload.component';
import { TasksListComponent } from './tasks-list/tasks-list.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { TaskEventsListComponent } from './task-details/task-events-list/task-events-list.component';
import { TasksListItemComponent } from './tasks-list/tasks-list-item/tasks-list-item.component';
import { TaskEventItemComponent } from './task-details/task-events-list/task-event-item/task-event-item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatDatepickerModule, MatNativeDateModule, MatSliderModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const taskRoutes: Routes = [
  { path: '', component: TasksComponent, 
    children : [
      { path: 'default', component: TaskItemDefaultComponent},
      { path: 'detail/:id', component: TaskItemDetailComponent },
      { path: 'add', component: TaskItemEditComponent },
      { path: 'edit/:id', component: TaskItemEditComponent },
      { path: 'assign/:id', component: TaskItemAssignComponent },
      { path: 'comment/add', component: TaskItemCommentComponent },
      { path: 'comment/edit/:id', component: TaskItemCommentComponent },
      { path: 'fileupload', component: TaskItemFileUploadComponent }
    ]
}];

@NgModule({
  declarations: [
    TasksComponent,
    TasksListComponent,
    TaskDetailsComponent,
    TaskItemDetailComponent,
    TaskItemEditComponent,
    TaskItemDefaultComponent,
    TaskEventsListComponent,
    TasksListItemComponent,
    TaskEventItemComponent,
    TaskItemCommentComponent,
    TaskItemFileUploadComponent,
    TaskItemAssignComponent
  ],
  imports: [
    RouterModule.forChild(taskRoutes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSliderModule
  ],
  exports: [RouterModule]
})
export class TasksModule { }
