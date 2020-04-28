import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PmPortalComponent } from './pm-portal/pm-portal.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ChatsComponent } from './pm-portal/chats/chats.component';
import { TasksComponent } from './pm-portal/tasks/tasks.component';
import { UsersComponent } from './pm-portal/users/users.component';
import { MentionsComponent } from './pm-portal/mentions/mentions.component';
import { AnalysisComponent } from './pm-portal/analysis/analysis.component';
import { TaskDetailsComponent } from './pm-portal/tasks/task-details/task-details.component';
import { TaskItemDetailComponent } from './pm-portal/tasks/task-details/task-item-detail/task-item-detail.component';
import { TaskItemEditComponent } from './pm-portal/tasks/task-details/task-item-edit/task-item-edit.component';
import { TaskSchedulingComponent } from './pm-portal/task-scheduling/task-scheduling.component';
import { NumberCardChartComponent } from './pm-portal/analysis/number-card-chart/number-card-chart.component';
import { HorizontalBarChartComponent } from './pm-portal/analysis/horizontal-bar-chart/horizontal-bar-chart.component';
import { StackedVerticalBarChartComponent } from './pm-portal/analysis/stacked-vertical-bar-chart/stacked-vertical-bar-chart.component';
import { TaskItemCommentComponent } from './pm-portal/tasks/task-details/task-item-comment/task-item-comment.component';
import { ProjectsComponent } from './pm-portal/projects/projects.component';
import { TaskItemFileUploadComponent } from './pm-portal/tasks/task-details/task-item-file-upload/task-item-file-upload.component';
import { TaskItemAssignComponent } from './pm-portal/tasks/task-details/task-item-assign/task-item-assign.component';
import { ProjectDetailComponent } from './pm-portal/projects/project-details/project-detail/project-detail.component';
import { ProjectEditComponent } from './pm-portal/projects/project-details/project-edit/project-edit.component';
import { ProjectDefaultComponent } from './pm-portal/projects/project-details/project-default/project-default.component';
import { TaskItemDefaultComponent } from './pm-portal/tasks/task-details/task-item-default/task-item-default.component';
import { UserDefaultComponent } from './pm-portal/users/user-details/user-default/user-default.component';
import { UserDetailComponent } from './pm-portal/users/user-details/user-detail/user-detail.component';
import { UserEditComponent } from './pm-portal/users/user-details/user-edit/user-edit.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'org', component: PmPortalComponent, 
    children: [
      { path: 'projects', component: ProjectsComponent, 
        children : [
          { path: '', component: ProjectDefaultComponent},
          { path: 'detail/:id', component: ProjectDetailComponent },
          { path: 'add', component: ProjectEditComponent },
          { path: 'edit/:id', component: ProjectEditComponent }
        ]
      },
      { path: 'tasks', component: TasksComponent, 
        children : [
          { path: '', component: TaskItemDefaultComponent},
          { path: 'detail/:id', component: TaskItemDetailComponent },
          { path: 'add', component: TaskItemEditComponent },
          { path: 'edit/:id', component: TaskItemEditComponent },
          { path: 'assign/:id', component: TaskItemAssignComponent },
          { path: 'comment/add', component: TaskItemCommentComponent },
          { path: 'comment/edit/:id', component: TaskItemCommentComponent },
          { path: 'fileupload', component: TaskItemFileUploadComponent }
        ]
      },
      { path: 'task-schedule', component: TaskSchedulingComponent },
      { path: 'users', component: UsersComponent, 
        children : [
        { path: '', component: UserDefaultComponent},
        { path: 'detail/:id', component: UserDetailComponent},
        { path: 'add', component: UserEditComponent},
        { path: 'edit/:id', component: UserEditComponent}
      ] },
      { path: 'chats', component: ChatsComponent },
      { path: 'analysis', component: AnalysisComponent,
        children : [
          { path: 'number-card-chart', component: NumberCardChartComponent },
          { path: 'horizontal-bar-chart', component: HorizontalBarChartComponent },
          { path: 'stacked-vertical-bar-chart', component: StackedVerticalBarChartComponent },
        ] 
      }
    ] 
  },
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'not-found', component: PageNotFoundComponent },
  { path: '**', redirectTo: 'not-found', pathMatch: 'full'}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
