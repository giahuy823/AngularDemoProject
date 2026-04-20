import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { Student } from 'src/app/models/students.model';
import { StudentService } from 'src/app/services/student.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormbuilderService } from 'src/app/services/formbuilder.service';
@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
    studentList!: Student[];
    loading: boolean = true;
    selectedStudent?: Student;
    configRoot: any;
  constructor(private studentService: StudentService, private msgService: NzMessageService, private fbService: FormbuilderService) {
        this.loadStudents();
    }
  ngOnInit(): void {
       this.fbService.loadConFigFromDb('student','management','StudentFormGroups').subscribe((config) => {
            console.log(config);
            this.configRoot = config;
        });
  }

  loadStudents(){
     this.studentService.getStudents().subscribe(students => {
            this.studentList = students;
            this.loading = false;
        });
  }
  onStudentSelect(student: Student) {
    console.log('Selected student:', student);
    this.selectedStudent = student;
  }

  onSubmit(formValue: any) {
    console.log('Form submitted with value:', formValue, 'Selected student:', this.selectedStudent?.id);
     if (this.selectedStudent) {
      this.studentService
        .updatePatchStudent(this.selectedStudent.id, formValue)
        .subscribe({
          next: (res) => {
            this.msgService.success('Update thành công');
            this.loadStudents();
          },
          error: (err) => {
            this.msgService.error('Lỗi update hoặc không thấy học sinh');
          }
        });
      }
      else {
          const student ={
            ...formValue,
            birthday: formValue.birthday 
          ? new Date(formValue.birthday).toISOString()
          : null
          } as Student;
        this.studentService.addStudent(student).subscribe({
          next: (res) => {
            this.msgService.success('Thêm thành công');
            this.loadStudents();
          },
          error: (err) => {
            this.msgService.error('Lỗi thêm học sinh');
          }
        });

      }
  }

  deleteStudent(id: string) {
    if (confirm('Xóa học sinh này?')) {
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

