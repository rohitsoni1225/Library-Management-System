import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'page-header',
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.css'
})
export class PageHeaderComponent {
name : string='';
loggedIn: boolean=false;
  constructor(private service: ApiService) {
    service.userStatus.subscribe({
      next:(res)=>{
        if(res=='loggedIn'){
          this.loggedIn=true;
          let user = service.getUserInfo();
          this.name=`${user?.firstName} ${user?.lastName}`
        }
        else{
          this.loggedIn=false;
          this.name='';
        }
      }
    })
  }
    logOut(){
      this.service.logOut();
    }
  
}


