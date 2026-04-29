import { Component, Input, inject, OnInit, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Student } from 'src/app/models/students.model';
import { FormbuilderService } from 'src/app/services/formbuilder.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpClient } from '@angular/common/http';
import { switchMap, tap } from 'rxjs/operators';

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

  allFieldsCached: any[] = [];
  controlPathMap: Record<string, string> = {};
  fieldMap: Record<string, any> = {};

  ngOnInit(): void { }

  buildCache() {
    this.allFieldsCached = [];
    this.controlPathMap = {};
    this.fieldMap = {};
    if (!this.configRoot?.groups) return;

    for (const g of this.configRoot.groups) {
      const gKey = this.toKey(g.title);
      if (g.fields) {
        for (const f of g.fields) {
          this.allFieldsCached.push(f);
    
          this.controlPathMap[f.key] = `${gKey}.${f.key}`;
          this.fieldMap[f.key] = f;
        }
      }
      for (const sg of g.subgroups || []) {
        const sgKey = this.toKey(sg.title);
        if (sg.fields) {
          for (const f of sg.fields) {
            this.allFieldsCached.push(f);
            this.controlPathMap[f.key] = `${gKey}.${sgKey}.${f.key}`;
            this.fieldMap[f.key] = f;
          }
        }
      }
    }
  }

  getAllFields(): any[] {
    return this.allFieldsCached;
  }

  setupFormSubscription() {
      if (!this.form) return;

      this.form.valueChanges.subscribe(() => {
        const fields = this.getAllFields();

        fields.forEach((field: any) => {
          if (!field.parentKey) return;

          const parentValue = this.findValueByKey(field.parentKey);
          const prevParentValue = this.prevValues[field.parentKey];

          if (parentValue !== prevParentValue) {
            this.setValueByKey(field.key, null);
            this.clearOptions(field.key);
          } else if (!parentValue && this.getControlByKey(field.key)?.value !== null) {
            this.setValueByKey(field.key, null);
            this.clearOptions(field.key);
          }

          this.prevValues[field.parentKey] = parentValue;
        });
      });
    }

  toKey(value: string) {
    return value.trim().toLowerCase().replace(/\s+/g, '_');
  }

  getControlByKey(key: string): any {
    const path = this.controlPathMap[key];
    return path ? this.form.get(path) : null;
  }

  findValueByKey(key: string): any {
    return this.getControlByKey(key)?.value || null;
  }

  setValueByKey(key: string, value: any) {
    const control = this.getControlByKey(key);
    if (control && control.value !== value) {
      control.setValue(value, { emitEvent: false });
    }
  }

  patchDataToForm(data: any) {
    if (!data || !this.form) return;
    
    this.form.patchValue(data, { emitEvent: false });

    Object.keys(data).forEach(key => {
      console.log('Patching key:', key, 'with value:', data[key]);
      const control = this.getControlByKey(key);
    
      if (control && control.value !== data[key]) {
        control.setValue(data[key], { emitEvent: false });
      }
    });

    const fields = this.getAllFields();
    fields.forEach((field: any) => {
      if (field.parentKey) {
        this.prevValues[field.parentKey] = this.findValueByKey(field.parentKey);
      }
    });
  }
  
  clearOptions(fieldKey: string) {
    const field = this.fieldMap[fieldKey];
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
      this.buildCache();
      this.form = this.fbService.buildFormLevel2(this.configRoot);
      this.setupFormSubscription();

      if (this.data && !changes['data']) {
        this.patchDataToForm(this.data);
      }
    }

    if (changes['data'] && this.form) {
      this.form.reset(undefined, { emitEvent: false });
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
        this.patchDataToForm(patchedData);
        return;
      }

      this.loadDataSource(cityField).pipe(
        tap(res => {
          cityField.options = res.map((i: any) => ({ label: i.name, value: i.code.toString() }));
          this.patchDataToForm({ ...patchedData, district: null });
        }),

        switchMap(() => this.loadDataSource({ ...districtField, parentKey: 'city' }))
      ).subscribe(res2 => {
        districtField.options = res2.districts.map((i: any) => ({ label: i.name, value: i.code.toString() }));
        this.patchDataToForm({ district: patchedData.district });
      });
    }
  }

  onSelectOpen(field: any) {
    const parentValue = field.parentKey ? this.findValueByKey(field.parentKey) : null;

    if (field.parentKey && !parentValue) {
      this.msgservice.warning('Vui lòng chọn trước');
      return;
    }

    if (field.lastParentValue !== parentValue) {
      field.options = [];
    }

    if (field.dataSource && (!field.options || field.options.length === 0)) {
      field.loading = true;

      this.loadDataSource(field).subscribe({
        next: (res: any) => {
          const options = res.districts || res.wards || res;

          field.options = options.map((i: any) => ({
            label: i.name,
            value: i.code.toString()
          }));

          field.lastParentValue = parentValue;
          field.loading = false;
        },
        error: () => {
          this.msgservice.error('Load fail');
          field.loading = false;
        }
      });
    }
  }

  getRequiredValidator(field: any): boolean {
    return field.validators?.some((v: any) => v.type === 'required');
  }

  loadDataSource(field: any) {
    const baseUrl = 'https://provinces.open-api.vn/api/v1';

    if (field.dataSource === 'provinces') {
      return this.http.get<any>(`${baseUrl}/p/`);
    }

    if (field.dataSource === 'districts') {
      const code = this.findValueByKey(field.parentKey);
      return this.http.get<any>(`${baseUrl}/p/${code}?depth=2`);
    }

    if (field.dataSource === 'wards') {
      const code = this.findValueByKey(field.parentKey);
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
      console.log(this.form.value);
      this.msgservice.error('Form invalid');
    }
  }
  
  onAction(action: any) {
    if (action.type === 'submit') {
      this.onSubmit();
    } else if (action.type === 'reset') {
      this.form.reset(undefined, { emitEvent: false });
      this.prevValues = {};
      const fields = this.getAllFields();
      fields.forEach((field: any) => {
        if (field.parentKey) {
          field.options = [];
          field.lastParentValue = undefined;
        }
      });
      console.log('Root form reset');
    } else {
      console.log('Unhandled root action:', action);
    }
  }

  onGroupAction(action: any, group: any) {
    //Form-Group level 2
    const groupKey = this.toKey(group.title);
    const groupForm = this.form.get(groupKey) as FormGroup;

    if (!groupForm) return;
      if (action.type === 'submit') {
        if (groupForm.invalid) {
          console.log(groupForm.value);
          this.markGroupTouched(groupForm);
          this.msgservice.error(`Group "${group.title}" invalid`);
          return;
        }

        const value = groupForm.value;
        this.formSubmit.emit(value);

        console.log('Group submit:', group.title, value);
      }
      if (action.type === 'reset') {
        groupForm.reset();
      }
    }

  markGroupTouched(group: FormGroup) {

    Object.values(group.controls).forEach((control: any) => {

      if (control instanceof FormGroup) {
        this.markGroupTouched(control); 
      } else {
        control.markAsTouched();
      }

    });
  }
  
  getControl(group: any, fieldKey: string, subGroup?: any) {
    const groupKey = this.toKey(group.title);

    if (subGroup) {
      const subKey = this.toKey(subGroup.title);
      return this.form.get(`${groupKey}.${subKey}.${fieldKey}`);
    }

    return this.form.get(`${groupKey}.${fieldKey}`);
  }

  getErrorMessage(ctrl: any): string {
    if (!ctrl) return '';
    if (ctrl.hasError('required')) return 'Required';
    if (ctrl.hasError('maxlength')) return 'Max length exceeded';
    if (ctrl.hasError('minlength')) return 'Min length not reached';
    if (ctrl.hasError('email')) return 'Invalid email';
    if (ctrl.hasError('pattern')) return 'Invalid format';

    return '';
  }
}
