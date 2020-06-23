import { NgModule } from '@angular/core';
import { OrganisationService } from './services/organisation.service';
import { TasksService } from './services/tasks.service';
import { TaskDependenciesService } from './services/task-dependencies.service';
import { ProjectsService } from './services/projects.service';
import { WebsocketService } from './services/websocket.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptorService } from './services/auth-interceptor.service';

@NgModule({
  imports: [    
    HttpClientModule
  ],
  providers: [
    OrganisationService, 
    TasksService, 
    TaskDependenciesService,
    ProjectsService,
    WebsocketService,
    {provide: 
      HTTP_INTERCEPTORS, 
      useClass: AuthInterceptorService, 
      multi: true 
    }
  ],
})
export class CoreModule { }
