import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../shared/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm : FormGroup;
  hideContent : boolean= false;
hidePwdContent: boolean=false;
  
  constructor(fb: FormBuilder, private service: ApiService, private snakBar: MatSnackBar) {
    this.loginForm= fb.group({
      email:fb.control('', [Validators.required]),
    password:fb.control('', [Validators.required]),
    })

  }
  login(){
let loginInfo={
  email: this.loginForm.get('email')?.value,
  password: this.loginForm.get('password')?.value,
}
this.service.login(loginInfo).subscribe({
  next: (res) =>{
    if(res == 'not found'){
      this.snakBar.open('Credentials are invalid','OK');}
      else if(res=='unapproved'){
        this.snakBar.open('Your account is not approved by admin','OK');
      }
      else if(res=='blocked'){
        this.snakBar.open('Your account is blocked,please go to admin to unblock','OK');
      }
      else{
        localStorage.setItem('access_token',res);
        this.service.userStatus.next('loggedIn');
      }
    
  }
});
  }

}
