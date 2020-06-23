import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsComponent } from './projects.component';
import { ProjectDefaultComponent } from './project-details/project-default/project-default.component';
import { ProjectDetailComponent } from './project-details/project-detail/project-detail.component';
import { ProjectEditComponent } from './project-details/project-edit/project-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { ProjectsListItemComponent } from './projects-list/projects-list-item/projects-list-item.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';

const projectRoutes: Routes = [
  { path: '', component: ProjectsComponent, 
    children : [
      { path: 'default', component: ProjectDefaultComponent},
      { path: 'detail/:id', component: ProjectDetailComponent },
      { path: 'add', component: ProjectEditComponent },
      { path: 'edit/:id', component: ProjectEditComponent }
    ]
  }
];

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectsListComponent,
    ProjectsListItemComponent,
    ProjectDetailsComponent,
    ProjectDetailComponent,
    ProjectEditComponent,
    ProjectDefaultComponent
  ],
  imports: [
    CommonModule,
    //FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(projectRoutes)
  ],
  exports: [RouterModule]
})
export class ProjectsModule { }
