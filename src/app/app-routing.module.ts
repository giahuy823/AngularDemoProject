import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
// {
//    path: '',
//    component: StudentListComponent 
// },
// {
//   path:'students/student-list',
//   component: StudentListComponent
// },
// {
//   path: 'students/add-student',
//   component: StudentAddComponent
// }
  {
    path: '',
    redirectTo: 'students', 
    pathMatch: 'full'
  },
 {
    path: 'students',
    loadChildren: () => import('./components/students/student.module')
      .then(m => m.StudentModule)
  },

 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
