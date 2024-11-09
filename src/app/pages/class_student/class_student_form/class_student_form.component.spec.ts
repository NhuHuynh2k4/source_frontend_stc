import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassStudentFormComponent } from './class_student_form.component';

describe('ClassStudentFormComponent', () => {
  let component: ClassStudentFormComponent;
  let fixture: ComponentFixture<ClassStudentFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClassStudentFormComponent]
    });
    fixture = TestBed.createComponent(ClassStudentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
