import { Component, OnInit } from '@angular/core';
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
  selectedFormId: number | null = null;
  formList: any[] = [];

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
    { label: 'Pattern (Regex)', value: 'pattern', hasValue: true }
  ];

  dataSources = [
    { label: 'Không (Nhập tay)', value: '' },
    { label: 'Tỉnh/Thành (Provinces)', value: 'provinces' },
    { label: 'Quận/Huyện (Districts)', value: 'districts' },
    { label: 'Phường/Xã (Wards)', value: 'wards' }
  ];

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private formbuilderService: FormbuilderService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadForms();
  }

  // ================= INIT =================

  buildForm() {
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      layout: this.fb.group({
        colSpan: [24],
        columns: [2]
      }),
      groups: this.fb.array([]),
      actions: this.fb.array([])
    });
  }

  loadForms() {
    this.formbuilderService.getAllForms().subscribe(res => {
      this.formList = res;
    });
  }

  onSelectForm(id: number) {
    if (!id) return;

    this.selectedFormId = id;

    this.formbuilderService.getFormById(id).subscribe(res => {
      const config = JSON.parse(res.configJson);
      this.patchFullForm(config);
    });
  }

  // ================= PATCH =================

  patchFullForm(config: any) {
    this.form.reset();
    this.groups.clear();
    this.actions.clear();

    this.form.patchValue({
      title: config.title,
      layout: config.layout
    });

    config.groups?.forEach((g: any) => {
      this.groups.push(this.createGroup(g));
    });

    config.actions?.forEach((a: any) => {
      this.actions.push(this.createAction(a));
    });
  }

  private createGroup(g: any): FormGroup {
    const group = this.fb.group({
      title: [g.title],
      fields: this.fb.array([]),
      groupActions: this.fb.array([])
    });

    g.fields?.forEach((f: any) => {
      (group.get('fields') as FormArray).push(this.createField(f));
    });

    g.groupActions?.forEach((a: any) => {
      (group.get('groupActions') as FormArray).push(this.createAction(a));
    });

    return group;
  }

  private createField(f: any): FormGroup {
    const field = this.fb.group({
      key: [f.key],
      label: [f.label],
      type: [f.type],
      visible: [f.visible],
      placeholder: [f.placeholder],
      dataSource: [f.dataSource],
      parentKey: [f.parentKey],
      validators: this.fb.array([]),
      options: this.fb.array([])
    });

    f.validators?.forEach((v: any) => {
      (field.get('validators') as FormArray).push(
        this.fb.group({
          type: [v.type],
          value: [v.value]
        })
      );
    });

    f.options?.forEach((o: any) => {
      (field.get('options') as FormArray).push(
        this.fb.group({
          label: [o.label],
          value: [o.value]
        })
      );
    });

    return field;
  }

  private createAction(a: any): FormGroup {
    return this.fb.group({
      type: [a.type],
      label: [a.label],
      icon: [a.icon],
      style: [a.style],
      route: [a.route]
    });
  }

  // ================= FORM GETTERS =================

  get groups() {
    return this.form.get('groups') as FormArray;
  }

  get actions() {
    return this.form.get('actions') as FormArray;
  }

  fields(groupIndex: number): FormArray {
    return this.groups.at(groupIndex).get('fields') as FormArray;
  }

  groupActions(groupIndex: number): FormArray {
    return this.groups.at(groupIndex).get('groupActions') as FormArray;
  }

  getValidators(groupIndex: number, fieldIndex: number): FormArray {
    return this.fields(groupIndex).at(fieldIndex).get('validators') as FormArray;
  }

  getOptions(groupIndex: number, fieldIndex: number): FormArray {
    return this.fields(groupIndex).at(fieldIndex).get('options') as FormArray;
  }

  // ================= ADD / REMOVE =================

  addGroup() {
    this.groups.push(this.fb.group({
      title: [''],
      fields: this.fb.array([]),
      groupActions: this.fb.array([])
    }));
  }

  removeGroup(index: number) {
    this.groups.removeAt(index);
  }

  addField(groupIndex: number) {
    this.fields(groupIndex).push(this.fb.group({
      key: [''],
      label: [''],
      type: ['input'],
      visible: [true],
      placeholder: [''],
      dataSource: [''],
      parentKey: [''],
      validators: this.fb.array([]),
      options: this.fb.array([])
    }));
  }

  removeField(groupIndex: number, index: number) {
    this.fields(groupIndex).removeAt(index);
  }

  addValidator(groupIndex: number, fieldIndex: number, type: string) {
    const validators = this.getValidators(groupIndex, fieldIndex);

    const hasValue = ['minLength', 'maxLength', 'pattern'].includes(type);

    validators.push(this.fb.group({
      type: [type],
      value: [hasValue ? '' : null]
    }));
  }

  removeValidator(groupIndex: number, fieldIndex: number, index: number) {
    this.getValidators(groupIndex, fieldIndex).removeAt(index);
  }

  addOption(groupIndex: number, fieldIndex: number) {
    this.getOptions(groupIndex, fieldIndex).push(
      this.fb.group({
        label: [''],
        value: ['']
      })
    );
  }

  removeOption(groupIndex: number, fieldIndex: number, index: number) {
    this.getOptions(groupIndex, fieldIndex).removeAt(index);
  }

  addGroupAction(groupIndex: number) {
    this.groupActions(groupIndex).push(this.createAction({
      type: 'submit',
      label: 'Action',
      icon: '',
      style: 'default',
      route: ''
    }));
  }

  removeGroupAction(groupIndex: number, index: number) {
    this.groupActions(groupIndex).removeAt(index);
  }

  addAction() {
    this.actions.push(this.createAction({
      type: 'submit',
      label: 'Lưu lại',
      icon: 'save',
      style: 'primary',
      route: ''
    }));
  }

  removeAction(index: number) {
    this.actions.removeAt(index);
  }

  filterOption = (input: string, option: any): boolean => {
  return option.nzLabel?.toLowerCase().includes(input.toLowerCase());
  };

  hasValidatorValue(type: string): boolean {
  const found = this.validatorTypes.find(v => v.value === type);
  return !!found?.hasValue;
  }

  // ================= SUBMIT / UPDATE =================

  private buildPayload() {
    return {
      moduleCode: 'student',
      menuCode: 'management',
      formCode: this.form.value.title,
      configJson: JSON.stringify(this.form.value)
    };
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.message.error('Vui lòng nhập tên Form!');
      return;
    }

    const payload = this.buildPayload();

    this.formbuilderService.saveConfigToDb(payload).subscribe({
      next: () => this.message.success('Lưu thành công!'),
      error: () => this.message.error('Lỗi khi lưu!')
    });
  }

  updateForm() {
    if (!this.selectedFormId) {
      this.message.warning('Chưa chọn form!');
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.message.error('Form không hợp lệ!');
      return;
    }

    const payload = this.buildPayload();

    this.formbuilderService.updateForm(this.selectedFormId, payload)
      .subscribe({
        next: () => this.message.success('Cập nhật thành công!'),
        error: () => this.message.error('Update thất bại!')
      });
  }
}