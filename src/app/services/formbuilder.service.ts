import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { FormFromJson, Validator } from '../models/form.model';

@Injectable({
  providedIn: 'root'
})
export class FormbuilderService {

  privateUrl = 'https://localhost:44357/api/app';

  constructor(private http: HttpClient, private fb: FormBuilder) { }

  // load local json
  loadConfig(): Observable<FormFromJson> {
    return this.http.get<FormFromJson>('assets/test.json');
  }

  // load từ DB
  loadConFigFromDb(module: string, menu: string, form: string): Observable<any> {
    // console.log(`${this.privateUrl}/by-code?module=${module}&menu=${menu}&form=${form}`);
    return this.http.get<any>(`${this.privateUrl}/by-code?module=${module}&menu=${menu}&form=${form}`);
  }

  // save
  saveConfigToDb(payload: any): Observable<any> {
    return this.http.post(`${this.privateUrl}`, payload);
  }

  getAllForms() {
    return this.http.get<any[]>(`${this.privateUrl}`); 
  }

  getFormById(id: number) {
    return this.http.get<any>(`${this.privateUrl}/${id}`);
  }

  updateForm(id: number, payload: any) {
    return this.http.put(`${this.privateUrl}/${id}`, payload);
  }

  
  buildForm(config: any): FormGroup {
    const group: any = {};

    const fields = this.getAllFields(config);

    fields.forEach(field => {
      const defaultValue = field.type === 'date' ? null : '';

      group[field.key] = [
        defaultValue,
        this.mapValidate(field.validators)
      ];
    });

    return this.fb.group(group);
  }

  private getAllFields(config: any): any[] {
    if (!config.groups) return [];
    return config.groups.flatMap((g: any) => g.fields || []);
  }

  private mapValidate(validators?: Validator[]) {
    if (!validators || validators.length === 0) return [];

    const result: any = [];

    validators.forEach(v => {
      switch (v.type) {
        case 'required':
          result.push(Validators.required);
          break;

        case 'maxLength':
          if (v.value) result.push(Validators.maxLength(v.value));
          break;

        case 'minLength':
          if (v.value) result.push(Validators.minLength(v.value));
          break;

        case 'pattern':
          if (v.value) result.push(Validators.pattern(v.value));
          break;

        case 'email':
          result.push(Validators.email);
          break;
      }
    });

    return result;
  }

}