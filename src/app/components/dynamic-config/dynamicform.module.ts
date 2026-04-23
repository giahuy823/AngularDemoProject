import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppDynamicComponent } from './app-dynamic/app-dynamic.component';

import { ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzMessageModule } from 'ng-zorro-antd/message';
import  { NzCardModule } from 'ng-zorro-antd/card';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { StudentRoutingModule } from '../students/student-routing.module';
import { RouterModule } from '@angular/router';
import { AppTableComponent } from './app-table/app-table.component';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { AppDynamicGroupComponent } from './app-dynamic-group/app-dynamic-group.component';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';


@NgModule({
  declarations: [AppDynamicComponent,AppTableComponent, AppDynamicGroupComponent],
  exports: [AppDynamicComponent,AppTableComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NzButtonModule,
    NzInputModule,
    NzTableModule,
    NzFormModule,
    NzMessageModule,
    NzModalModule,
    NzSelectModule,
    NzCardModule,
    NzIconModule,
    NzUploadModule,
    NzDatePickerModule,
    NzTimePickerModule,
    StudentRoutingModule
]
})
export class DynamicformModule { }
