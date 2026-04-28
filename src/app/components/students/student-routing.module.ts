import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentListComponent } from './student-list/student-list.component';
import { StudentAddComponent } from './student-add/student-add.component';
import { StudentEditComponent } from './student-edit/student-edit.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';

const routes: Routes = [
{path: '', component: StudentListComponent },
{path: 'student-list',component: StudentListComponent}, 
{path: 'student-add', component: StudentAddComponent},
{path: 'student-edit/:id',component: StudentEditComponent},
{path: 'dynamic-form', component: DynamicFormComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule {
  
 }
