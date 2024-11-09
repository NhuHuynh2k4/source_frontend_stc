import { ComponentFixture, TestBed } from '@angular/core/testing';
import {QuestionTypeTableComponent} from "./question_type_table.component";

describe('QuestionTypeTableComponent', () => {
  let component: QuestionTypeTableComponent;
  let fixture: ComponentFixture<QuestionTypeTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionTypeTableComponent]
    });
    fixture = TestBed.createComponent(QuestionTypeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
