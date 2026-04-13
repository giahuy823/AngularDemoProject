// form-builder.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormbuilderService } from 'src/app/services/formbuilder.service';
@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.css']
})
export class FormBuilderComponent implements OnInit {
  form!: FormGroup;

  actionTypes = [
    { label: 'Submit', value: 'submit' },
    { label: 'Reset', value: 'reset' },
    { label: 'Link (Navigate)', value: 'link' },
    { label: 'Button (Custom)', value: 'button' }
  ];

  buttonStyles = [
    { label: 'Primary', value: 'primary' },
    { label: 'Default', value: 'default' },
    { label: 'Dashed', value: 'dashed' },
    { label: 'Link', value: 'link' },
    { label: 'Danger', value: 'primary', danger: true }
  ];

  validatorTypes = [
    { label: 'Required', value: 'required' },
    { label: 'Email', value: 'email' },
    { label: 'Min Length', value: 'minLength', hasValue: true },
    { label: 'Max Length', value: 'maxLength', hasValue: true },
    { label: 'Min', value: 'min', hasValue: true },
    { label: 'Max', value: 'max', hasValue: true },
    { label: 'Pattern (Regex)', value: 'pattern', hasValue: true }
  ];

  dataSources = [
  { label: 'Không (Nhập tay)', value: '' },
  { label: 'Tỉnh/Thành (Provinces)', value: 'provinces' },
  { label: 'Quận/Huyện (Districts)', value: 'districts' },
  { label: 'Phường/Xã (Wards)', value: 'wards' }
  ];

  constructor(
    private http: HttpClient, 
    private fb: FormBuilder,
    private message: NzMessageService,
    private formbuilderService: FormbuilderService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group(
      {
      title: ['', [Validators.required]],
      layout: this.fb.group({
        colSpan: [24],
        columns: [2]
      }),
      fields: this.fb.array([]),
      actions: this.fb.array([])
    });
  }

  get fields() { return this.form.get('fields') as FormArray; }

  getValidators(fieldIndex: number): FormArray {
    return this.fields.at(fieldIndex).get('validators') as FormArray;
  }
  get actions() { return this.form.get('actions') as FormArray; }


  addField() {
    this.fields.push(this.fb.group({
      key: [''], label: [''], type: ['input'], visible: [true],
      placeholder: [''],
      dataSource: [''],
      parentKey: [''],
      validators: this.fb.array([]),
      options: this.fb.array([])
    }));
  }

  removeField(index: number) {
    this.fields.removeAt(index);
  }

  addValidator(fieldIndex: number, validatorType: string) {
    const validators = this.getValidators(fieldIndex);

    const hasValue = ['minLength', 'maxLength', 'min', 'max', 'pattern']
      .includes(validatorType);

    validators.push(
      this.fb.group({
        type: [validatorType],
        value: [hasValue ? '' : null] 
      })
    );

  }

  removeValidator(fieldIndex: number, validatorIndex: number) {
    const validators = this.getValidators(fieldIndex);
    validators.removeAt(validatorIndex);
  
  }

  hasValidatorValue(type: string): boolean {
    const found = this.validatorTypes.find(v => v.value === type);
    return !!found?.hasValue;
  }
  
  addOption(fieldIndex: number) {
    const options = this.fields.at(fieldIndex).get('options') as FormArray;
    options.push(this.fb.group({
      label: [''], value: ['']
    }));
  }

  getOptions(fieldIndex: number): FormArray {
    return this.fields.at(fieldIndex).get('options') as FormArray;
  }

  removeOption(fieldIndex: number, optionIndex: number) {
    const options = this.fields.at(fieldIndex).get('options') as FormArray;
    options.removeAt(optionIndex);
  }

  addAction() {
    this.actions.push(this.fb.group({
      type: ['submit'], 
      label: ['Lưu lại'],
      icon: ['save'],
      style: ['primary'],
      route: ['']
    }));
  }

  removeAction(index: number) {
    this.actions.removeAt(index);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.message.error('Vui lòng nhập tên Form!');
      return;
    }

    const payload = {
      moduleCode: 'student',
      menuCode: 'management',
      formCode: this.form.value.title,
      configJson: JSON.stringify(this.form.value)
    };
    console.log(payload);

    this.formbuilderService.saveConfigToDb(payload).subscribe({
      next: () => {
        this.message.success('Cấu hình đã được lưu thành công!');
      },
      error: () => {
        this.message.error('Có lỗi xảy ra khi lưu cấu hình!');
      }
    }
    );
  }
}