import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing.module';
import { StudentAddComponent } from './student-add/student-add.component';
import { StudentListComponent } from './student-list/student-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { StudentEditComponent } from './student-edit/student-edit.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { HttpClientModule } from '@angular/common/http';
import { AppDynamicComponent } from '../app-dynamic/app-dynamic.component';
import { DynamicformModule } from '../app-dynamic/dynamicform.module';
@NgModule({
  declarations: [
    StudentAddComponent,
    StudentListComponent,
    StudentEditComponent,
    
  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    DynamicformModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzInputModule,
    NzTableModule,
    NzFormModule,
    NzMessageModule,
    NzModalModule,
    NzSelectModule,
    NzIconModule
  ]
  //  exports: [   
  //   StudentListComponent,
  //   StudentAddComponent
  // ]
})
export class StudentModule { }
