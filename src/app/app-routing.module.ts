import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PmPortalComponent } from './pm-portal/pm-portal.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ChatsComponent } from './pm-portal/chats/chats.component';
import { TasksComponent } from './pm-portal/tasks/tasks.component';
import { TaskDependenciesComponent } from './pm-portal/task-dependencies/task-dependencies.component';
import { UsersComponent } from './pm-portal/users/users.component';
import { MentionsComponent } from './pm-portal/mentions/mentions.component';
import { AnalysisComponent } from './pm-portal/analysis/analysis.component';
import { TaskDetailsComponent } from './pm-portal/tasks/task-details/task-details.component';
import { TaskItemDetailComponent } from './pm-portal/tasks/task-details/task-item-detail/task-item-detail.component';
import { TaskItemAddComponent } from './pm-portal/tasks/task-details/task-item-add/task-item-add.component';
import { TaskItemEditComponent } from './pm-portal/tasks/task-details/task-item-edit/task-item-edit.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'projects', component: PmPortalComponent, 
    children: [
      { path: 'tasks', component: TasksComponent, 
        children : [
          { path: 'details', component: TaskItemDetailComponent },
          { path: 'add', component: TaskItemAddComponent },
          { path: 'edit/:taskId', component: TaskItemEditComponent }
        ]
      },
      { path: 'task-deps', component: TaskDependenciesComponent },
      { path: 'users', component: UsersComponent },
      { path: 'chats', component: ChatsComponent },
      { path: 'mentions', component: MentionsComponent },
      { path: 'analysis', component: AnalysisComponent }
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
