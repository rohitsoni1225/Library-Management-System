import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../shared/services/api.service';
import { Order } from '../../Models/models';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'returnbook',
  templateUrl: './returnbook.component.html',
  styleUrl: './returnbook.component.css'
})
export class ReturnbookComponent {
fineToPay: number|null=null;
returnForm : FormGroup;

constructor(fb: FormBuilder, private apiService:ApiService , private snackBar:MatSnackBar) {
  this.returnForm=fb.group({
    userId: fb.control(null,[Validators.required]),
    bookId: fb.control(null,[Validators.required])
  })
  }
  getFine() {
    let userId = this.returnForm.get('userId')?.value;
    let bookId = this.returnForm.get('bookId')?.value;

    this.apiService.getOrdersOfUser(userId).subscribe({
      next: (res: Order[]) => {
        if (res.some((o) => !o.returned && o.bookId == bookId)) {
          let order: Order = res.filter((o) => o.bookId == bookId)[0];
          this.fineToPay = this.apiService.getFine(order);
        } else {
          this.snackBar.open(`User doesn't have Book with ID: ${bookId}`, 'OK');
        }
      },
    });}

    returnBook() {
      let userId = this.returnForm.get('userId')?.value;
      let bookId = this.returnForm.get('bookId')?.value;
  
      this.apiService.returnBook(userId, bookId, this.fineToPay!).subscribe({
        next: (res) => {
          if (res === 'returned')
            this.snackBar.open('Book has been Returned!', 'OK');
          else this.snackBar.open('Book has not Returned!', 'OK');
        },
      });
    }
  
}
