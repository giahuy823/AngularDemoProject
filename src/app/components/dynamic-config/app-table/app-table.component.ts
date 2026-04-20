import { Component, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { OnInit } from '@angular/core';
import { Student } from 'src/app/models/students.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { StudentService } from 'src/app/services/student.service';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './app-table.component.html',
  styleUrls: ['./app-table.component.css']
})
export class AppTableComponent {
  @Input() studentList: Student[] = [];
  @Output() studentSelected = new EventEmitter<Student>();

  constructor(
    private msgService: NzMessageService,
    private studentService: StudentService
  ) {}
  

  // click row
  onRowClick(student: Student) {
    console.log('Row clicked:', student);
    this.studentSelected.emit(student);
  }

  // delete
  onDelete(student: Student) {
    this.msgService.warning(`Xóa: ${student.name}`);
    // sau này gọi API ở đây
  }
  
  

}





