import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../shared/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent { 
registerForm: FormGroup;
hideContent : boolean= false;
hidePwdContent: boolean=false;
constructor(private fb : FormBuilder, private service:ApiService, private snakBar: MatSnackBar) {
  this.registerForm = fb.group({
    firstName:fb.control('', [Validators.required]),
    lastName:fb.control('', [Validators.required]),
    email:fb.control('', [Validators.required]),
    mobile:fb.control('', [Validators.required]),
    password:fb.control('', [Validators.required]),
    rpassword:fb.control('', [Validators.required]),

  })

}
register(){
  let user={
    firstName: this.registerForm.get('firstName')?.value,
    lastName: this.registerForm.get('lastName')?.value,
    email: this.registerForm.get('email')?.value,
    mobile: this.registerForm.get('mobile')?.value,
    password: this.registerForm.get('password')?.value,
    rpassword: this.registerForm.get('rpassword')?.value,
  }
  this.service.register(user).subscribe({
    next : res=>{
      this.snakBar.open(res, "Ok");
    }
  })
}
}
