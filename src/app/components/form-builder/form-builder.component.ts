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
  selectedIndex = 0;

  fieldTypes = [
    { label: 'Input Text', value: 'input' },
    { label: 'Select', value: 'select' },
    { label: 'Date Picker', value: 'date' },
    { label: 'Number', value: 'number' },
    { label: 'Range Picker (Time)', value: 'timeRange' }, 
    { label: 'Upload', value: 'upload' },
    { label: 'Divider / Header', value: 'divider' }
  ];

 
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

  resetForm() {
    this.selectedFormId = null;
    this.form.reset();
  }
  buildForm() {
    this.selectedFormId = null;
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      layout: this.fb.group({
        spacing: [16],
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
      groupActions: this.fb.array([]),
      subgroups: this.fb.array([])
    });

    g.fields?.forEach((f: any) => {
      (group.get('fields') as FormArray).push(this.createField(f));
    });

    g.groupActions?.forEach((a: any) => {
      (group.get('groupActions') as FormArray).push(this.createAction(a));
    });

    g.subgroups?.forEach((sg: any) => {
      (group.get('subgroups') as FormArray).push(this.createSubGroup(sg));
    });

    return group;
  }

  private createSubGroup(sg: any): FormGroup {
    const group = this.fb.group({
      title: [sg.title],
      fields: this.fb.array([]),
      groupActions: this.fb.array([])
    });

    sg.fields?.forEach((f: any) => {
      (group.get('fields') as FormArray).push(this.createField(f));
    });

    sg.groupActions?.forEach((a: any) => {
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
      colSpan: [f.colSpan || 12],
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

  subgroups(groupIndex: number): FormArray {
    return this.groups.at(groupIndex).get('subgroups') as FormArray;
  }

  subFields(groupIndex: number, subGroupIndex: number): FormArray {
    return this.subgroups(groupIndex).at(subGroupIndex).get('fields') as FormArray;
  }

  subGroupActions(groupIndex: number, subGroupIndex: number): FormArray {
    return this.subgroups(groupIndex).at(subGroupIndex).get('groupActions') as FormArray;
  }

  getSubValidators(groupIndex: number, subGroupIndex: number, fieldIndex: number): FormArray {
    return this.subFields(groupIndex, subGroupIndex).at(fieldIndex).get('validators') as FormArray;
  }

  getSubOptions(groupIndex: number, subGroupIndex: number, fieldIndex: number): FormArray {
    return this.subFields(groupIndex, subGroupIndex).at(fieldIndex).get('options') as FormArray;
  }

  // ================= ADD / REMOVE =================

  addGroup() {
    this.groups.push(this.fb.group({
      title: [''],
      fields: this.fb.array([]),
      groupActions: this.fb.array([]),
      subgroups: this.fb.array([])
    }));
    this.scrollToItem(`group-${this.groups.length - 1}`);
  }

  removeGroup(index: number) {
    this.groups.removeAt(index);
  }

  addField(groupIndex: number) {
    const fields = this.fields(groupIndex);
    fields.push(this.fb.group({
      key: [''],
      label: [''],
      type: ['input'],
      visible: [true],
      placeholder: [''],
      dataSource: [''],
      parentKey: [''],
      colSpan: [12],
      validators: this.fb.array([]),
      options: this.fb.array([])
    }));
    this.scrollToItem(`field-${groupIndex}-${fields.length - 1}`);
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

  addSubGroup(groupIndex: number) {
    this.subgroups(groupIndex).push(this.fb.group({
      title: [''],
      fields: this.fb.array([]),
      groupActions: this.fb.array([])
    }));
    this.scrollToItem(`subgroup-${groupIndex}-${this.subgroups(groupIndex).length - 1}`);
  }

  removeSubGroup(groupIndex: number, subGroupIndex: number) {
    this.subgroups(groupIndex).removeAt(subGroupIndex);
  }

  addSubField(groupIndex: number, subGroupIndex: number) {
    const fields = this.subFields(groupIndex, subGroupIndex);
    fields.push(this.fb.group({
      key: [''],
      label: [''],
      type: ['input'],
      visible: [true],
      placeholder: [''],
      dataSource: [''],
      parentKey: [''],
      colSpan: [12],
      validators: this.fb.array([]),
      options: this.fb.array([])
    }));
    this.scrollToItem(`subfield-${groupIndex}-${subGroupIndex}-${fields.length - 1}`);
  }

  removeSubField(groupIndex: number, subGroupIndex: number, index: number) {
    this.subFields(groupIndex, subGroupIndex).removeAt(index);
  }

  addSubValidator(groupIndex: number, subGroupIndex: number, fieldIndex: number, type: string) {
    const validators = this.getSubValidators(groupIndex, subGroupIndex, fieldIndex);
    const hasValue = ['minLength', 'maxLength', 'pattern'].includes(type);
    validators.push(this.fb.group({
      type: [type],
      value: [hasValue ? '' : null]
    }));
  }

  removeSubValidator(groupIndex: number, subGroupIndex: number, fieldIndex: number, index: number) {
    this.getSubValidators(groupIndex, subGroupIndex, fieldIndex).removeAt(index);
  }

  addSubOption(groupIndex: number, subGroupIndex: number, fieldIndex: number) {
    this.getSubOptions(groupIndex, subGroupIndex, fieldIndex).push(
      this.fb.group({ label: [''], value: [''] })
    );
  }

  removeSubOption(groupIndex: number, subGroupIndex: number, fieldIndex: number, index: number) {
    this.getSubOptions(groupIndex, subGroupIndex, fieldIndex).removeAt(index);
  }

  addSubGroupAction(groupIndex: number, subGroupIndex: number) {
    const actions = this.subGroupActions(groupIndex, subGroupIndex);
    actions.push(this.createAction({
      type: 'submit',
      label: 'Action',
      icon: '',
      style: 'default',
      route: ''
    }));
    this.scrollToItem(`subgroup-actions-${groupIndex}-${subGroupIndex}`);
  }

  removeSubGroupAction(groupIndex: number, subGroupIndex: number, index: number) {
    this.subGroupActions(groupIndex, subGroupIndex).removeAt(index);
  }

  addGroupAction(groupIndex: number) {
    const actions = this.groupActions(groupIndex);
    actions.push(this.createAction({
      type: 'submit',
      label: 'Action',
      icon: '',
      style: 'default',
      route: ''
    }));
    this.scrollToItem(`group-actions-${groupIndex}`);
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
    this.scrollToItem('global-actions-table');
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

  scrollToItem(id: string) {
    if (id.startsWith('group-')) {
      this.selectedIndex = 0;
    } else if (id.includes('global-actions')) {
      this.selectedIndex = 1;
    }

    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        element.style.transition = 'all 0.5s';
        const originalShadow = element.style.boxShadow;
        const originalBorder = element.style.borderColor;
        
        element.style.boxShadow = '0 0 15px rgba(22, 119, 255, 0.5)';
        element.style.borderColor = '#1677ff';
        
        setTimeout(() => {
          element.style.boxShadow = originalShadow;
          element.style.borderColor = originalBorder;
        }, 2000);
      }
    }, 150); 
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

  copyJson() {
    const json = JSON.stringify(this.form.value, null, 2);
    navigator.clipboard.writeText(json).then(() => {
      this.message.success('Đã sao chép cấu hình JSON vào bộ nhớ tạm!');
    }).catch(err => {
      this.message.error('Lỗi khi sao chép: ' + err);
    });
  }
}