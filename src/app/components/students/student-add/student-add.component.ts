import { Component, OnInit } from '@angular/core';
import { Student } from 'src/app/models/students.model';
import { FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import { StudentService } from 'src/app/services/student.service';
import { FormbuilderService } from 'src/app/services/formbuilder.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { FormFromJson } from 'src/app/models/form.model';
@Component({
  selector: 'app-student-add',
  templateUrl: './student-add.component.html',
  styleUrls: ['./student-add.component.css']
})
export class StudentAddComponent implements OnInit{
  constructor(private studentService: StudentService,
    private Router:Router, 
    private msgService:NzMessageService,
    private fbService:  FormbuilderService) {}

  configRoot!: FormFromJson;
  ngOnInit(): void {
        this.fbService.loadConfig().subscribe((config) => {
            console.log(config);
            this.configRoot = config;
        });
        
    }

    handleSubmit(formvalue: any){
      const student = formvalue as Student;
      this.studentService.addStudent(student).subscribe({
          next:() => {
            this.msgService.success("Added successfully!")
            this.Router.navigate(['/students'])
          },
          error: (err) => {
             this.msgService.error(err);
          }
      })
    }

  }
 


