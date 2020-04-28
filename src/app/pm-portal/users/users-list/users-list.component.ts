import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from 'src/app/models/user';
import { Observable, Subscription } from 'rxjs';
import { OrganisationService } from 'src/app/services/organisation.service';
import { UsersService } from 'src/app/services/users.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  users: Observable<User[]>;
  orgId: number;
  isAuthenticated = false;
  sub1: Subscription;
  sub2: Subscription;
  sub3: Subscription;

  constructor(
    private authService: AuthService, 
    private orgService: OrganisationService, 
    private usersService: UsersService) {}

    ngOnInit() {
      console.log('PLC - In ngOnInit() method - b4 usersService.userSelected.subscribe ..');
      
      this.sub1 = this.authService.user.subscribe(user => {
        console.log('Header: In authService.user.subscribe(..) method');
        //this.isAuthenticated = (!user) ? false : true;
        this.isAuthenticated = !!user;
        if(this.isAuthenticated && this.orgId == null){
          this.orgId = user.orgId;
        }
        console.log('Header: Exiting authService.user.subscribe(..) method. isAuthenticated = ' + this.isAuthenticated);
      });

      this.sub2 = this.orgService.organisationSelected.subscribe(
        (newOrgId: number) => {
          console.log('PLC - orgId value = ' + newOrgId);
          if(newOrgId){
            this.orgId = newOrgId;
          }
          this.reloadData();
        }
      );
  
      this.sub3 = this.usersService.userItemUpdated.subscribe(
        selectedUser => {
          console.log('PLC - In usersService.userSelected.subscribe');
          this.reloadData();
        }
      );
  
  
    }
  
    reloadData() {
      console.log('PLC - In reloadData() method');
      if(this.orgId != null){
        this.users = this.usersService.getUsersForOrg(this.orgId);
      }
    }
    
    
    ngOnDestroy(){
      console.log('PLC - In ngOnDestroy() method');
      this.sub1.unsubscribe();
      this.sub2.unsubscribe();
      this.sub3.unsubscribe();
    }
  
  }
