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

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'projects', component: PmPortalComponent, 
    children: [
      { path: 'tasks', component: TasksComponent, 
        children : [
          { path: 'detail/:id', component: TaskItemDetailComponent },
          { path: 'add', component: TaskItemEditComponent },
          { path: 'edit/:id', component: TaskItemEditComponent }
        ]
      },
      { path: 'task-schedule', component: TaskSchedulingComponent },
      { path: 'users', component: UsersComponent },
      { path: 'chats', component: ChatsComponent },
      { path: 'mentions', component: MentionsComponent },
      { path: 'analysis', component: AnalysisComponent,
        children : [
          { path: 'number-card-chart', component: NumberCardChartComponent },
          { path: 'horizontal-bar-chart', component: HorizontalBarChartComponent },
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
