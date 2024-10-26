import { Component } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { UserType } from '../../Models/models';

export interface TableElement{
  name: string;
  value: string;
}
@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
column: string[]=['name', 'value'];
dataSource: TableElement[]=[];
/**
 *
 */
constructor(private apiService : ApiService) {
  let user =apiService.getUserInfo()!;
  this.dataSource = [
    { name: "Name", value: user.firstName + " " + user.lastName },
    { name: "Email", value: `${user.email}` },
    { name: "Mobile", value: `${user.mobile}` },
    { name: "Account Status", value: `${user.accountStatus}` },
    { name: "Created On", value: `${user.createdOn}` },
    { name: "Type", value: `${UserType[user.userType]}` }
  ];
  
}
}
