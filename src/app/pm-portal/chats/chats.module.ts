import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatsComponent } from './chats.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

const chatsRoute = [
  { path: '', component: ChatsComponent }
];

@NgModule({
  declarations: [
    ChatsComponent

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(chatsRoute)
  ],
  exports: [RouterModule]
})
export class ChatsModule { }
