import { Component, OnInit } from '@angular/core';
import { Student } from 'src/app/models/students.model';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { StudentService } from 'src/app/services/student.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
@Component({
  selector: 'app-student-add',
  templateUrl: './student-add.component.html',
  styleUrls: ['./student-add.component.css']
})
export class StudentAddComponent implements OnInit{
  constructor(private studentService: StudentService,private Router:Router, private msgService:NzMessageService) {}
  studentForm! : FormGroup;
  ngOnInit(): void {
     this.studentForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-ZÀ-Ỹà-ỹ\\s]+$')]),
      email: new FormControl('', [Validators.required, Validators.email]),
      address: new FormControl(''),
      phoneNumber: new FormControl('',[Validators.pattern('^[0-9]+$'), Validators.minLength(10), Validators.maxLength(11),Validators.required]),
      birthday: new FormControl(null)
    });
  }
 

    name(controlName: string) {
      return this.studentForm.get(controlName);
    }

    getErrorMessage(controlName: string): string {
      if (this.name(controlName)?.hasError('required')) {
        return 'You must enter a value';
      }
      if (this.name(controlName)?.hasError('maxlength')) {
        return  controlName + ` cannot exceed ${this.name(controlName)?.errors?.['maxlength'].requiredLength} characters`;
      }
      if (this.name(controlName)?.hasError('minlength')) {
        return  controlName + ` must be at least ${this.name(controlName)?.errors?.['minlength'].requiredLength} characters`;
      }
      if (this.name(controlName)?.hasError('pattern')) {
        return controlName +' has invalid characters.';
      }
      if (this.name(controlName)?.hasError('email')) {
        return 'Not a valid email';
      }
      return '';
    }

    //Event
   onSubmit(){
    if(this.studentForm.valid){
      const student= this.studentForm.value as Student;

      console.log(student);

      this.studentService.addStudent(student).subscribe({
        next: (response) => {
          console.log('Student added successfully', response);
          this.msgService.success("Thêm sinh viên thành công!.");  
        },
        error: (err) => {
          this.msgService.error('Something wrong', err);
        },
    })
      };
    }
  }

