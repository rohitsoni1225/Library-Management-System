import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AccountStatus, Order, User, UserType } from '../../../Models/models';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'page-table',
  templateUrl: './page-table.component.html',
  styleUrl: './page-table.component.css'
})
export class PageTableComponent {
 
  constructor(private apiService:ApiService) {
    
  }
@Input()
column: string[]=[];

@Input()
dataSource:any[]=[];

@Output()
approve= new EventEmitter<User>();

@Output()
unblock= new EventEmitter<User>();

getFineToPay(order: Order) {
  return this.apiService.getFine(order);
}
getAccountStatus(input:AccountStatus){
  return AccountStatus[input];
}
}
