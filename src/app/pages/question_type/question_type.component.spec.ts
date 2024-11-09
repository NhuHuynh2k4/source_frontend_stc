import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionTypeComponent } from './question_type.component';

describe('QuestionTypeComponent', () => {
  let component: QuestionTypeComponent;
  let fixture: ComponentFixture<QuestionTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionTypeComponent]
    });
    fixture = TestBed.createComponent(QuestionTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
