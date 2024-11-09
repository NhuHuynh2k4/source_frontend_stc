import { ComponentFixture, TestBed } from '@angular/core/testing';
import {ClassStudentTableComponent} from "./class_student_table.component";

describe('ClassStudentTableComponent', () => {
  let component: ClassStudentTableComponent;
  let fixture: ComponentFixture<ClassStudentTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClassStudentTableComponent]
    });
    fixture = TestBed.createComponent(ClassStudentTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
