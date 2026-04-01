import { Component, Input, inject, OnInit, Output, EventEmitter,SimpleChanges, OnChanges } from '@angular/core';
import { FormFromJson } from 'src/app/models/form.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Student } from 'src/app/models/students.model';
import { FormbuilderService } from 'src/app/services/formbuilder.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-dynamic',
  templateUrl: './app-dynamic.component.html',
  styleUrls: ['./app-dynamic.component.css']
})
export class AppDynamicComponent implements OnInit,OnChanges{

    @Input() configRoot!: FormFromJson;
    @Input() data?: Student;
    
    @Output() formSubmit = new EventEmitter<any>();
    
    fbservice = inject(FormbuilderService);
    msgservice = inject(NzMessageService);

    form!: FormGroup;

    // ngOnInit(): void {
    //   this.form = this.fbservice.buildForm(this.configRoot);
    //   console.log(this.configRoot);
    //   console.log(this.form.value)
    //   if (this.data!= null) {
    //     this.form.patchValue(this.data);
    //   }
    // }

    ngOnInit(): void {}

    ngOnChanges(changes: SimpleChanges): void {
      console.log('on changes bat dau')
      if (changes['configRoot'] && this.configRoot) {
        console.log('co thay doi')
        this.form = this.fbservice.buildForm(this.configRoot);
      }
       if (changes['data'] && this.data) {
          console.log('co thay doi 2')
          this.form.patchValue(this.data);
      }
    }

    onSubmit() {
      if(this.form.valid){
        this.formSubmit.emit(this.form.value);
      } 
      else {
        this.msgservice.error('Something went wrong!');
      }
    }

    name(controlName: string) {
    return this.form.get(controlName);
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
