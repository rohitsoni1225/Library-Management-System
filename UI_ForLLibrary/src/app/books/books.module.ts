import { NgModule } from '@angular/core';
import { BookStoreComponent } from './book-store/book-store.component';
import { SharedModule } from '../shared/shared.module';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { ReturnbookComponent } from './returnbook/returnbook.component';



@NgModule({
  declarations: [
    BookStoreComponent,
    MaintenanceComponent,
    ReturnbookComponent
  ],
  imports: [
     SharedModule
  ]
})
export class BooksModule { }
