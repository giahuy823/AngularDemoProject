import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { HttpClientModule } from '@angular/common/http';
import { AppDynamicComponent } from '../dynamic-config/app-dynamic/app-dynamic.component';
import { DynamicformModule } from '../dynamic-config/dynamicform.module';
import { NzCardComponent, NzCardModule } from 'ng-zorro-antd/card';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { NzDividerModule } from 'ng-zorro-antd/divider';
@NgModule({
  declarations: [
    StudentAddComponent,
    StudentListComponent,
    StudentEditComponent,
    DynamicFormComponent,
    
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
    NzIconModule,
    NzSpinModule,
    NzCardModule,
    NzDividerModule,
    FormsModule
  ]
  //  exports: [   
  //   StudentListComponent,
  //   StudentAddComponent
  // ]
})
export class StudentModule { }
