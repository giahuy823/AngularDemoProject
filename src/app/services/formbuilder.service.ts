import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { FormFromJson, Validator } from '../models/form.model';
import { FormGroup } from '@angular/forms';
@Injectable({
  providedIn: 'root'
})
export class FormbuilderService {
  privateUrl = 'https://localhost:44357/api/app'
  constructor(private http: HttpClient, private fb: FormBuilder) { }

  loadConfig(): Observable<FormFromJson> {
    return this.http.get<FormFromJson>('assets/test.json');
  }

  loadConFigFromDb(module: string, menu: string, form: string): Observable<FormFromJson>{
    console.log(`${this.privateUrl}?module=${module}&menu=${menu}&form=${form}`);
    return this.http.get<FormFromJson>(`${this.privateUrl}?module=${module}&menu=${menu}&form=${form}`)
  }

  buildForm(config: FormFromJson): FormGroup {
    const group: any = {};

    config.fields.forEach(field => {
      
      const defaultValue = field.key == 'birthday' ? null : '';
      group[field.key] = [ defaultValue,
          this.mapValidate(field.validators)]
      })

      return this.fb.group(group);
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
