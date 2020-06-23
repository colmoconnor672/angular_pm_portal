import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { PmPortalComponent } from './pm-portal/pm-portal.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'org', component: PmPortalComponent, 
    children: [
      { path: 'projects', loadChildren: () => import('./pm-portal/projects/projects.module').then(m => m.ProjectsModule) },
      { path: 'tasks', loadChildren: () => import('./pm-portal/tasks/tasks.module').then(m => m.TasksModule) },
      { path: 'task-schedule', loadChildren: () => import('./pm-portal/task-scheduling/task-scheduling.module').then(m => m.TaskSchedulingModule) },
      { path: 'users', loadChildren: () => import('./pm-portal/users/users.module').then(m => m.UsersModule) },
      { path: 'chats', loadChildren: () => import('./pm-portal/chats/chats.module').then(m => m.ChatsModule) },
      { path: 'analysis', loadChildren: () => import('./pm-portal/analysis/analysis.module').then(m => m.AnalysisModule) }
    ] 
  },
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'not-found', component: PageNotFoundComponent },
  { path: '**', redirectTo: 'not-found', pathMatch: 'full'}
];


@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
