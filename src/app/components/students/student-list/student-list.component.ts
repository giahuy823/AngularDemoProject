import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Student } from 'src/app/models/students.model';
import { StudentService } from 'src/app/services/student.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent {
    studentList!: Student[];
    loadingCheck: boolean = false;
    constructor(private studentService: StudentService, private msgService: NzMessageService) {
        studentService.getStudents().subscribe(students => {
            this.studentList = students;
    })
  }
  deleteStudent(id: string) {
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentService.deleteStudent(id).subscribe(
      { next: (res)=>
      {
        this.msgService.success("Xóa thành công!.")
        this.studentService.getStudents().subscribe(students=>{
        this.studentList = students;})
      },
        error: (err)=>{
        this.msgService.error("Something went wrong!.");
        }
      }
      
    )
    }
    
  }
}

