import { Component } from '@angular/core';
import { StudentListComponent } from './components/students/student-list/student-list.component';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AngularProject';
    isCollapsed = false;
}
