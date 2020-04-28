import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/user';
import { Role } from 'src/app/models/role';

@Component({
  selector: 'app-users-list-item',
  templateUrl: './users-list-item.component.html',
  styleUrls: ['./users-list-item.component.css']
})
export class UsersListItemComponent implements OnInit {

  @Input() userItem: User;

  constructor() { }

  ngOnInit() {
  }

  getRolesString(){
    let rolesString = '';
    if(this.userItem && this.userItem.roles){
        this.userItem.roles.forEach( (role:Role, index:number, array:Role[]) => {
            rolesString = rolesString + role.roleDescription;
        })
    }
    return rolesString;
  }

}
