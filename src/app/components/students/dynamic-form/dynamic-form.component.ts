import { Component, OnInit } from '@angular/core';
import { FormbuilderService } from 'src/app/services/formbuilder.service';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent implements OnInit {
  formList: any[] = [];
  selectedFormId: number | null = null;
  configRoot: any = null;

  constructor(private fbService: FormbuilderService) {}

  ngOnInit(): void {
    this.loadForms();
  }

  loadForms() {
    this.fbService.getAllForms().subscribe(res => {
      this.formList = res;
    });
  }

  onFormSelect(id: number) {
    if (!id) {
      this.configRoot = null;
      return;
    }
    const selectedForm = this.formList.find(f => f.id === id);
    if (selectedForm) {
      this.fbService.loadConFigFromDb('student','management', selectedForm.name)
        .subscribe(config => {
          this.configRoot = config;
          console.log(this.configRoot);
        });
    }
  }

  onFormSubmit(value: any) {
    console.log('Dynamic Form Submitted:', value);
  }
}
