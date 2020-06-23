import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { UserDefaultComponent } from './user-details/user-default/user-default.component';
import { UserDetailComponent } from './user-details/user-detail/user-detail.component';
import { UserEditComponent } from './user-details/user-edit/user-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UsersListComponent } from './users-list/users-list.component';
import { UsersListItemComponent } from './users-list/users-list-item/users-list-item.component';
import { UserDetailsComponent } from './user-details/user-details.component';

const usersRoutes: Routes = [
  { path: '', component: UsersComponent, 
    children : [
    { path: '', component: UserDefaultComponent},
    { path: 'detail/:id', component: UserDetailComponent},
    { path: 'add', component: UserEditComponent},
    { path: 'edit/:id', component: UserEditComponent}
] }
]

@NgModule({
  declarations: [
    UsersComponent,
    UsersListComponent,
    UsersListItemComponent,
    UserDetailsComponent,
    UserDetailComponent,
    UserEditComponent,
    UserDefaultComponent

  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(usersRoutes)
  ],
  exports: [RouterModule]
})
export class UsersModule { }
