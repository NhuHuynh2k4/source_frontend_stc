import { Component, OnInit } from '@angular/core';
import { StudentService } from 'src/app/services/student.service';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-student-table',
  templateUrl: './student-table.component.html',
  styleUrls: ['./student-table.component.css']
})
export class StudentTableComponent implements OnInit {
  studentForm!: FormGroup;
  isUpdate: boolean = false;
  students: any[] = [];
  selectedStudent: any; 

  constructor(private studentService: StudentService ,private fb: FormBuilder) {
    this.studentForm = this.fb.group({
      StudentID: [''],
      StudentCode: [''],
      StudentName: [''],
      Gender: [false],
      NumberPhone: [''],
      Address: [''],
      Email: [''],
      BirthdayDate: ['']
    });
  }

  onEdit(studentId: number): void {
    if (studentId) {
      this.studentService.getStudentById(studentId).subscribe({
        next: (studentData) => {
          console.log('Dữ liệu sinh viên nhận được:', studentData);
          if (studentData) {
            this.loadStudentData(studentData);  // Nạp dữ liệu vào form
          } else {
            console.error('Không tìm thấy sinh viên với ID:', studentId);
          }
        },
        error: (error) => {
          console.error('Lỗi khi lấy thông tin sinh viên:', error);
        }
      });
    } else {
      console.error('ID sinh viên không hợp lệ');
    }
  }
  
  
  
  
  
  ngOnInit(): void {
    this.fetchStudents();
    console.log(this.students); // Kiểm tra mảng sinh viên
  }

  fetchStudents(): void {
    this.studentService.getStudents().subscribe(
      (data) => {
        this.students = data;
        console.log('Students data:', data);
      },
      (error) => {
        console.error('Error fetching students:', error);
      }
    );
  }
  loadStudentData(studentData: any): void {
    console.log('Dữ liệu nạp vào form:', studentData);
    this.isUpdate = true; // Chuyển sang chế độ cập nhật
  
    // Kiểm tra xem dữ liệu có đầy đủ không và gọi patchValue
    if (this.studentForm) {
      this.studentForm.patchValue({
        studentCode: studentData.studentCode,
        studentName: studentData.studentName,
        gender: studentData.gender,
        numberPhone: studentData.numberPhone,
        address: studentData.address,
        birthdayDate: studentData.birthdayDate,
        email: studentData.email
      });
    } else {
      console.error('Form chưa được khởi tạo!');
    }
  }
  
  
}