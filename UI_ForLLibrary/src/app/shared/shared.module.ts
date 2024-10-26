import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { PageFooterComponent } from './components/page-footer/page-footer.component';
import { PageSideComponent } from './components/page-side/page-side.component';
import { RouterModule } from '@angular/router';
import { PageNotfoundComponent } from './components/page-notfound/page-notfound.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PageTableComponent } from './components/page-table/page-table.component';



@NgModule({
  declarations: [
    PageHeaderComponent,PageFooterComponent, PageSideComponent,PageSideComponent, PageNotfoundComponent, PageTableComponent
  ],
  imports: [
    CommonModule,MaterialModule, RouterModule,ReactiveFormsModule, 
  ],
  exports: [
    CommonModule,MaterialModule,PageHeaderComponent,PageFooterComponent,PageSideComponent,RouterModule,
    PageNotfoundComponent, ReactiveFormsModule,PageTableComponent
  ]
})
export class SharedModule { }
