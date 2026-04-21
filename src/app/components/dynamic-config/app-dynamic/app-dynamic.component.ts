import { Component, Input, inject, OnInit, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Student } from 'src/app/models/students.model';
import { FormbuilderService } from 'src/app/services/formbuilder.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpClient } from '@angular/common/http';
import { switchMap, tap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
@Component({
  selector: 'app-dynamic',
  templateUrl: './app-dynamic.component.html',
  styleUrls: ['./app-dynamic.component.css']
})
export class AppDynamicComponent implements OnInit, OnChanges {

  @Input() configRoot!: any;
  @Input() data?: Student;
  @Input() studentList?: Student[];
  @Output() formSubmit = new EventEmitter<any>();

  fb = inject(FormBuilder);
  fbService = inject(FormbuilderService);
  msgservice = inject(NzMessageService);
  http = inject(HttpClient);

  form!: FormGroup;
  prevValues: any = {};

  ngOnInit(): void {}


  getAllFields(): any[] {
    return this.configRoot?.groups?.flatMap((g: any) => g.fields) || [];
  }
  
  setupFormSubscription() {
    if (!this.form) return;

    this.form.valueChanges.subscribe(value => {

      console.log('Form value changed:', value);
      const fields = this.getAllFields();
      fields.forEach((field: any) => {

        console.log(`Checking field: ${field.key}, parentKey: ${field.parentKey}`);
        if (!field.parentKey) return;

        const parentValue = value[field.parentKey];
        const prevParentValue = this.prevValues[field.parentKey];

        if (parentValue !== prevParentValue) {
          this.form.patchValue({ [field.key]: null }, { emitEvent: false });
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
    const field = this.getAllFields().find((f: any) => f.key === fieldKey);
    if (field) field.options = [];
  }

  formatDate(date: string | Date | null | undefined): string | null {
    if (!date) return null;
    if (typeof date === 'string') {
      return date.split('T')[0];
    }
    return new Date(date).toISOString().split('T')[0];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['configRoot'] && this.configRoot) {
      this.form = this.fbService.buildForm(this.configRoot);
      this.setupFormSubscription();

      if (this.data) {
        this.form.patchValue(this.data);
      }
    }

    if (changes['data'] && this.form) {
      this.form.reset();
      this.prevValues = {};

      const fields = this.getAllFields();
      fields.forEach((field: any) => {
        if (field.parentKey) {
          field.options = [];
          field.lastParentValue = undefined;
        }
      });

      if (!this.data) {
        return;
      }

      const cityField = fields.find(f => f.key === 'city');
      const districtField = fields.find(f => f.key === 'district');

      const patchedData = {
        ...this.data,
        birthday: this.formatDate(this.data.birthday),
      };

      if (!cityField || !districtField) {
        this.form.patchValue(patchedData);
        return;
      }

      this.loadDataSource(cityField).pipe(
        tap(res => {
          cityField.options = res.map((i: any) => ({ label: i.name, value: i.code.toString() }));
          this.form.patchValue({ ...patchedData, district: null });
        }),
     
        switchMap(() => this.loadDataSource({ ...districtField, parentKey: 'city' }))
      ).subscribe(res2 => {
        districtField.options = res2.districts.map((i: any) => ({ label: i.name, value: i.code.toString() }));
        this.form.patchValue({ district: patchedData.district });
      });
    }
  }

  onSelectOpen(field: any) {
    if (field.parentKey && !this.form.get(field.parentKey)?.value) {
      this.msgservice.warning('Vui lòng chọn trước');
      return;
    }

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
            value: item.code.toString(),
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

  getRequiredValidator(field: any): boolean 
  { 
    return field.validators?.some((v: any) => v.type === 'required'); 
  }

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
      this.msgservice.error('Form invalid');
    }
  }

  onGroupAction(action: any, group: any) {

    
    
    const keys = group.fields.map((f: any) => f.key);
    
    if (action.type === 'submit') {

      if (!this.isGroupValid(group)) {
        this.markGroupTouched(group);
        this.msgservice.error(`Group "${group.title}" invalid`);
        return;
      }
      
      const groupValue = Object.keys(this.form.value)
        .filter(k => keys.includes(k))
        .reduce((obj: any, k) => {
          obj[k] = this.form.value[k];
          return obj;
        }, {});
      this.formSubmit.emit(groupValue);
      console.log('Group submit:', group.title, groupValue);
      
    }
    if (action.type === 'reset') {
      keys.forEach((k:string )=> {
        const control = this.form.get(k);
        if (control) {
          control.reset(); 
        }
      });
    }
  }

  isGroupValid(group: any): boolean {
    const keys = group.fields.map((f: any) => f.key);

    return keys.every((key: string) => {
      const control = this.form.get(key);
      return control && control.valid;
    });
  }

  markGroupTouched(group: any) {
    group.fields.forEach((f: any) => {
      const control = this.form.get(f.key);
      control?.markAsTouched();
    });
  }

  // helper for template
  name(controlName: string) {
    return this.form.get(controlName);
  }

  getErrorMessage(controlName: string): string {
    const ctrl = this.name(controlName);
    if (!ctrl) return '';

    if (ctrl.hasError('required')) return 'Required';
    if (ctrl.hasError('maxlength')) return 'Max length exceeded';
    if (ctrl.hasError('minlength')) return 'Min length not reached';
    if (ctrl.hasError('email')) return 'Invalid email';
    if (ctrl.hasError('pattern')) return 'Invalid format';

    return '';
  }
}
