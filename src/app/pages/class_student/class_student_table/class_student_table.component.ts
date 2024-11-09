import { Component, OnInit } from '@angular/core';
import { ClassStudentService } from '../../../services/classStudent.service';

@Component({
  selector: 'app-class-student-table',
  templateUrl: './class_student_table.component.html',
  styleUrls: ['./class_student_table.component.css']
})
export class ClassStudentTableComponent implements OnInit {
  classStudents: any[] = [];

  constructor(private classStudentService: ClassStudentService) { }

  ngOnInit(): void {
    this.getClassStudents();
  }

  getClassStudents(): void {
    this.classStudentService.getClassStudents().subscribe(
      data => this.classStudents = data,
      error => console.error('Xảy ra lỗi khi nạp dữ liệu class student', error)
    );
  }
}
