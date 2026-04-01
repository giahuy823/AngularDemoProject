import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDynamicComponent } from './app-dynamic.component';

describe('AppDynamicComponent', () => {
  let component: AppDynamicComponent;
  let fixture: ComponentFixture<AppDynamicComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppDynamicComponent]
    });
    fixture = TestBed.createComponent(AppDynamicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
