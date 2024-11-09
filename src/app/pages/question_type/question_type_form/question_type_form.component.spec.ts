import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionTypeFormComponent } from './question_type_form.component';

describe('ClassStudentFormComponent', () => {
  let component: QuestionTypeFormComponent;
  let fixture: ComponentFixture<QuestionTypeFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionTypeFormComponent]
    });
    fixture = TestBed.createComponent(QuestionTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
