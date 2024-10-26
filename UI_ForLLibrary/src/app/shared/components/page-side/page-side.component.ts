import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserType } from '../../../Models/models';

export interface NavigationItem{
  value:string;
  link:string;
}
@Component({
  selector: 'page-side',
  templateUrl: './page-side.component.html',
  styleUrl: './page-side.component.css'
})
export class PageSideComponent {
panelName: string="";
navItems : NavigationItem[] =[];

constructor(private service : ApiService, private router: Router, private jwt:JwtHelperService) {
  
  service.userStatus.subscribe({
    next: status =>{
      if(status == 'loggedIn'){
        router.navigateByUrl('/profile');
        let user = service.getUserInfo();
        if (user != null) {
          if (user.userType == UserType.ADMIN) {
            this.panelName = 'Admin Panel';
            this.navItems = [
              { value: 'View Books', link: '/home' },
              { value: 'Maintenance', link: '/maintenance' },
              { value: 'Return Book', link: '/return-book' },
              { value: 'View Users', link: '/view-users' },
              { value: 'Approval Requests', link: '/approval-requests' },
              { value: 'All Orders', link: '/all-orders' },
              { value: 'My Orders', link: '/my-orders' },
            ];
          }
      else if(user.userType == UserType.STUDENT) {
        this.panelName = 'Student Panel';
        this.navItems = [
          { value: 'View Books', link: '/home' },
          { value: 'My Orders', link: '/my-orders' },
        ];}}
      }else if (status == 'loggedOff') {
        this.panelName = 'Auth Panel';
        router.navigateByUrl('/login');
        this.navItems = [];
      }
    },
  });
}
}
