import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormFromJson } from 'src/app/models/form.model';
import { Student } from 'src/app/models/students.model';
import { StudentService } from 'src/app/services/student.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormbuilderService } from 'src/app/services/formbuilder.service';

@Component({
  selector: 'app-student-edit',
  template:`<app-dynamic
  [configRoot]="configRoot"
  [data]="studentData"
  (formSubmit)="handleSubmit($event)"
  ></app-dynamic>`,
  styleUrls: ['./student-edit.component.css']
})
export class StudentEditComponent implements OnInit {

  // studentForm!: FormGroup;
  studentForm2!: FormGroup;
  configRoot!: FormFromJson;
  studentId!: string;
  studentData!: Student;

  constructor(
    private studentService: StudentService,
    private msgService: NzMessageService,
    private formBuilderService: FormbuilderService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {

    this.formBuilderService.loadConFigFromDb('student','management','edit').subscribe(config=>{
        this.configRoot = config;
        console.log(this.configRoot)
        // this.studentForm2 = this.formBuilderService.buildForm(this.configRoot);
        // console.log(this.studentForm2)
    })


    this.studentId = this.route.snapshot.paramMap.get('id')!;

    // this.studentForm = this.fb.group({
    //   name:['',[Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-ZÀ-Ỹà-ỹ\\s]+$')]],
    //   gender:[''],
    //   email:['',[Validators.required, Validators.email]],
    //   address:[''],
    //   phoneNumber: ['', [Validators.pattern('^[0-9]+$'), Validators.minLength(10), Validators.maxLength(11), Validators.required]],
    //   birthday: ['']
    // })

    //   this.studentService.getStudentById(this.studentId).subscribe(student =>{
    //   this.studentForm.patchValue({
    //     name:student.name,
    //     email: student.email,
    //     address:student.address,
    //     phoneNumber:student.phoneNumber,
    //     birthday:student.birthday
    //   })
    // });
    
    this.studentService.getStudentById(this.studentId).subscribe({
      next: (student) => {

        let formattedBirthday: string | null = null;
        
        if (student.birthday){
          formattedBirthday = new Date(student.birthday)
          .toISOString()
          .substring(0, 10);
        }

        this.studentData = {
          ...student,
          birthday : formattedBirthday as any
        }

        console.log(this.studentData)

        // this.studentForm.patchValue({
        //   name: student.name,
        //   gender: student.gender,
        //   email: student.email,
        //   address: student.address,
        //   phoneNumber: student.phoneNumber,
        //   birthday: formattedBirthday
        // });
        // console.log(this.studentForm)
      },
      error: (err) => console.log(err)
    });
  }
    handleSubmit(formValue: any){
      const UpdatedStudent ={
        id : this.studentId,
        ...formValue,
        birthday: formValue.birthday ? formValue.birthday : null
      }

      this.studentService.updateStudent(UpdatedStudent).subscribe({
        next: () => {
          this.msgService.success('Cập nhật học sinh thành công!');
          this.router.navigate(['/students']);
        },
        error: (err) =>{
          this.msgService.error("Something went wrong!" + err);       
        }
      })
  }

}
