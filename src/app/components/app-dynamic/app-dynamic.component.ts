import { Component, Input, inject, OnInit, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Student } from 'src/app/models/students.model';
import { FormbuilderService } from 'src/app/services/formbuilder.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dynamic',
  templateUrl: './app-dynamic.component.html',
  styleUrls: ['./app-dynamic.component.css']
})
export class AppDynamicComponent implements OnInit, OnChanges {

  @Input() configRoot!: any;
  @Input() data?: Student;

  @Output() formSubmit = new EventEmitter<any>();

  fbservice = inject(FormbuilderService);
  msgservice = inject(NzMessageService);
  http = inject(HttpClient);

  form!: FormGroup;
  prevValues: any = {};

  ngOnInit(): void {}


  setupFormSubscription() {
    if (!this.form) return;

    this.form.valueChanges.subscribe(value => {
      console.log('Form value changed:', value);

      this.configRoot.fields.forEach((field: any) => {
        if (!field.parentKey) return;

        const parentValue = value[field.parentKey];
        const prevParentValue = this.prevValues[field.parentKey];

     
        if (parentValue !== prevParentValue) {
          console.log(`Parent value for ${field.key} changed from ${prevParentValue} to ${parentValue}`);
          this.form.patchValue({ [field.key]: null }, { emitEvent: false });
          console.log(`Clearing options for ${field.key} due to parent change`);
          this.clearOptions(field.key);
        }
   
        if (!parentValue) {
          this.form.patchValue({ [field.key]: null }, { emitEvent: false });
          this.clearOptions(field.key);
        }
      });

      this.prevValues = { ...value };
    });
  }

  clearOptions(fieldKey: string) {
    const field = this.configRoot.fields.find((f: any) => f.key === fieldKey);
    if (field) {
      field.options = [];
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['configRoot'] && this.configRoot) {
      this.form = this.fbservice.buildForm(this.configRoot);
      this.setupFormSubscription();

      if (this.data) {
        this.form.patchValue(this.data);
      }
    }

    if (changes['data'] && this.data && this.form) {
      this.form.patchValue(this.data);
    }
  }


  onSelectOpen(field: any) {

    if (field.parentKey && !this.form.get(field.parentKey)?.value) {
      this.msgservice.warning('Vui lòng chọn trước');
      return;
    }
    
    console.log('Opening select for field:', field.key);

    const parentValue = this.form.get(field.parentKey)?.value;

   
    if (field.lastParentValue !== parentValue) {
      field.options = [];
    }

    if (field.dataSource && (!field.options || field.options.length === 0)) {
      field.loading = true;

      this.loadDataSource(field).subscribe({
        next: (res: any) => {

          let options: any[] = res.districts || res.wards || res;

          field.options = options.map((item: any) => ({
            label: item.name,
            value: item.code
          }));

          field.lastParentValue = parentValue;
          field.loading = false;
        },
        error: () => {
          this.msgservice.error('Không thể tải dữ liệu');
          field.loading = false;
        }
      });
    }
  }

  // API
  loadDataSource(field: any) {
    const baseUrl = 'https://provinces.open-api.vn/api/v1';

    if (field.dataSource === 'provinces') {
      return this.http.get<any>(`${baseUrl}/p/`);
    }

    if (field.dataSource === 'districts') {
      const code = this.form.get(field.parentKey)?.value;
      return this.http.get<any>(`${baseUrl}/p/${code}?depth=2`);
    }

    if (field.dataSource === 'wards') {
      const code = this.form.get(field.parentKey)?.value;
      return this.http.get<any>(`${baseUrl}/d/${code}?depth=2`);
    }

    return this.http.get<any>('');
  }

  onSubmit() {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
      console.log(this.form.value);
    } else {
      this.form.markAllAsTouched();
      this.msgservice.error('Something went wrong!');
    }
  }

  getRequiredValidator(field: any): boolean {
    return field.validators?.some((v: any) => v.type === 'required');
  }

  name(controlName: string) {
    return this.form.get(controlName);
  }

  getErrorMessage(controlName: string): string {
    const ctrl = this.name(controlName);
    if (!ctrl) return '';

    if (ctrl.hasError('required')) return 'You must enter a value';
    if (ctrl.hasError('maxlength')) return `Max length exceeded`;
    if (ctrl.hasError('minlength')) return `Min length not reached`;
    if (ctrl.hasError('pattern')) return `Invalid format`;
    if (ctrl.hasError('email')) return 'Invalid email';

    return '';
  }
}