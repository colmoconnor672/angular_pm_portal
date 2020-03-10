import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PmPortalComponent } from './pm-portal/pm-portal.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'org/:orgId/projects', component: PmPortalComponent },

  { path: 'tasks', component: PmPortalComponent },
  { path: 'task-deps', component: PmPortalComponent },
  { path: 'users', component: PmPortalComponent },
  { path: 'chats', component: PmPortalComponent },
  { path: 'mentions', component: PmPortalComponent },
  { path: 'analysis', component: PmPortalComponent },

  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'not-found', component: PageNotFoundComponent },
  { path: '**', redirectTo: 'not-found', pathMatch: 'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
