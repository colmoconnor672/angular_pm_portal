import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { PmPortalComponent } from './pm-portal/pm-portal.component';
import { HeaderComponent } from './pm-portal/header/header.component';
import { TasksComponent } from './pm-portal/tasks/tasks.component';
import { UsersComponent } from './pm-portal/users/users.component';
import { ChatsComponent } from './pm-portal/chats/chats.component';
import { MentionsComponent } from './pm-portal/mentions/mentions.component';
import { AnalysisComponent } from './pm-portal/analysis/analysis.component';
import { TasksListComponent } from './pm-portal/tasks/tasks-list/tasks-list.component';
import { TaskDetailsComponent } from './pm-portal/tasks/task-details/task-details.component';
import { TaskItemDetailComponent } from './pm-portal/tasks/task-details/task-item-detail/task-item-detail.component';
import { TaskItemEditComponent } from './pm-portal/tasks/task-details/task-item-edit/task-item-edit.component';
import { TaskItemAddComponent } from './pm-portal/tasks/task-details/task-item-add/task-item-add.component';
import { TaskEventsListComponent } from './pm-portal/tasks/task-details/task-events-list/task-events-list.component';
import { OrganisationService } from './services/organisation.service';
import { TasksService } from './services/tasks.service';
import { ProjectsService } from './services/projects.service';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TasksListItemComponent } from './pm-portal/tasks/tasks-list/tasks-list-item/tasks-list-item.component';
import { WebsocketService } from './services/websocket.service';
import { GanttComponent } from './pm-portal/task-scheduling/gantt/gantt.component';
import { TaskDependenciesService } from './services/task-dependencies.service';
import { AlertComponent } from './shared/alert/alert.component';
import { TaskEventItemComponent } from './pm-portal/tasks/task-details/task-events-list/task-event-item/task-event-item.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule, MatInputModule, MatNativeDateModule } from '@angular/material';
import { MatSliderModule } from '@angular/material/slider';
import { TaskSchedulingComponent } from './pm-portal/task-scheduling/task-scheduling.component';
import { NumberCardChartComponent } from './pm-portal/analysis/number-card-chart/number-card-chart.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { HorizontalBarChartComponent } from './pm-portal/analysis/horizontal-bar-chart/horizontal-bar-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PmPortalComponent,
    HeaderComponent,
    TasksComponent,
    TaskSchedulingComponent,
    UsersComponent,
    ChatsComponent,
    MentionsComponent,
    AnalysisComponent,
    TasksListComponent,
    TaskDetailsComponent,
    TaskItemDetailComponent,
    TaskItemEditComponent,
    TaskItemAddComponent,
    TaskEventsListComponent,
    PageNotFoundComponent,
    TasksListItemComponent,
    GanttComponent,
    AlertComponent,
    TaskEventItemComponent,
    NumberCardChartComponent,
    HorizontalBarChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSliderModule,
    NgxChartsModule
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
  bootstrap: [AppComponent]
})
export class AppModule { }
