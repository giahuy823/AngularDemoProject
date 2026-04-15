import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppDynamicComponent } from './app-dynamic.component';

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


@NgModule({
  declarations: [AppDynamicComponent],
  exports: [AppDynamicComponent],
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
    StudentRoutingModule
]
})
export class DynamicformModule { }
