import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from 'src/app/services/student.service';
import { Student } from 'src/app/models/students.model';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-student-edit',
  templateUrl: './student-edit.component.html',
  styleUrls: ['./student-edit.component.css']
})
export class StudentEditComponent implements OnInit {

  studentForm!: FormGroup
  studentId!: string;

  constructor(
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute,
    private msgService: NzMessageService
  ) {}

  ngOnInit(): void {
    this.studentId = this.route.snapshot.paramMap.get('id')!;

    this.studentForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]+$')]),
      email: new FormControl('', [Validators.required, Validators.email]),
      address: new FormControl(''),
      phoneNumber: new FormControl('', [Validators.pattern('^[0-9]+$'), Validators.minLength(10), Validators.maxLength(11), Validators.required]),
      birthday: new FormControl('')
    });

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

        console.log(student)
        if (student.birthday){
          formattedBirthday = new Date(student.birthday)
          .toISOString()
          .substring(0, 10);
        }
        this.studentForm.patchValue({
          name: student.name,
          email: student.email,
          address: student.address,
          phoneNumber: student.phoneNumber,
          birthday: formattedBirthday
        });
        console.log(this.studentForm)
      },
      error: (err) => console.log(err)
    });
  }

  onSubmit() {
    if (this.studentForm.valid) {
      const updatedStudent: Student = {
        id: this.studentId,
        ...this.studentForm.value,
        birthday: this.studentForm.value.birthday ? this.studentForm.value.birthday : null
      };
      console.log(updatedStudent)
      this.studentService.updateStudent(updatedStudent).subscribe({
        next: (res) => {
          this.msgService.success('Cập nhật học sinh thành công!');
          this.router.navigate(['/students']);
        },
        error: (err) => this.msgService.error('Cập nhật thất bại: ' + err.error)
      });
    }
  }

  name(controlName: string) {
    return this.studentForm.get(controlName);
  }

  getErrorMessage(controlName: string): string {
    const ctrl = this.name(controlName);
    if (!ctrl) return '';
    if (ctrl.hasError('required')) return 'You must enter a value';
    if (ctrl.hasError('maxlength')) return `${controlName} cannot exceed ${ctrl.errors!['maxlength'].requiredLength} characters`;
    if (ctrl.hasError('minlength')) return `${controlName} must be at least ${ctrl.errors!['minlength'].requiredLength} characters`;
    if (ctrl.hasError('pattern')) return `${controlName} has invalid characters.`;
    if (ctrl.hasError('email')) return 'Not a valid email';
    return '';
  }
}