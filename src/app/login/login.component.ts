import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrganisationService } from '../services/organisation.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { AuthResponseData } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  loginForm: FormGroup;
  errorMessage: string = null;

  constructor(
    private router: Router, 
    private organisationService: OrganisationService,
    private authService: AuthService) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'email': new FormControl(null, [Validators.email ,Validators.required]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)]),
      'orgName': new FormControl(null, [Validators.required]),
      'orgEmail': new FormControl(null, [Validators.email ,Validators.required]),
      'orgPhone': new FormControl(null, [Validators.required]),
    }); 
  }

  onSubmit(){
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    const orgName = this.loginForm.value.orgName;
    const orgEmail = this.loginForm.value.orgEmail;
    const orgPhone = this.loginForm.value.orgPhone;

    if(!this.isLoginMode && !this.loginForm.valid) {
      return;
    }
    if(this.isLoginMode && (!this.loginForm.controls.email.valid || !this.loginForm.controls.password.valid) ) {
      return;
    } 

    this.isLoading = true;
    let authObs: Observable<AuthResponseData>;

    if(this.isLoginMode){
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.registerUser(email, password, orgName, orgEmail, orgPhone);
    }

    authObs.subscribe(
      resData => {
        console.log(resData);
        this.isLoading = false;
        if(this.isLoginMode){
          this.router.navigate(['/org/tasks/']);
          this.organisationService.organisationSelected.next( +resData.orgId );
        } else {
          this.onSwitchMode();
        }
      },
      errorMessage => {
        console.log(errorMessage);
        this.errorMessage = errorMessage;
        this.isLoading = false;
      }
    )
    
    this.loginForm.reset();
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onLogout(){
    this.authService.logout();
  }

  // Added this method to enable the alert-box to be closed. 
  // See AlertComponent for details
  onHandleError(){
    this.errorMessage = null;
  }
  
}
