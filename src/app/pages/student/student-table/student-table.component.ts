import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StudentService } from 'src/app/services/student.service';
import { AlertService } from "../../../services/alert.service";

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

  constructor(private studentService: StudentService ,private fb: FormBuilder,public alertService: AlertService) 
  {
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

  onEdit(studentId: number) {
     
    this.studentService.getStudentById(studentId).subscribe({
      next: (studentData) => {
        this.studentService.setSelectedStudent(studentData); // Sử dụng service để đặt dữ liệu
        const modalElement = document.getElementById('exampleModal1');
        if (modalElement) {
          const modal = new (window as any).bootstrap.Modal(modalElement);
          modal.show();
        }
        // if (studentData) {
        //   console.log('Dữ liệu sinh viên nhận được:', studentData);
        //   this.loadStudentData(studentData);
        // } else {
        //   console.error('Không tìm thấy sinh viên với ID:', studentId);
        //   this.alertService.displayAlert('Không tìm thấy sinh viên.', 'danger');
        // }
      },
      error: (error) => {
        console.error('Lỗi khi lấy thông tin sinh viên:', error);
        this.alertService.displayAlert('Lỗi khi lấy thông tin sinh viên.', 'danger');
      }
    });
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
        this.alertService.displayAlert('Lỗi khi lấy danh sách sinh viên.', 'danger');
      }
    );
  }
  
  // loadStudentData(studentData: any): void {
  //   console.log('Dữ liệu nạp vào form:', studentData);
  //   this.isUpdate = true; // Chuyển sang chế độ cập nhật
  
  //   // Kiểm tra xem dữ liệu có đầy đủ không và gọi patchValue
  //   if (this.studentForm) {
  //     this.studentForm.patchValue({
  //       studentCode: studentData.studentCode,
  //       studentName: studentData.studentName,
  //       gender: studentData.gender,
  //       numberPhone: studentData.numberPhone,
  //       address: studentData.address,
  //       birthdayDate: studentData.birthdayDate,
  //       email: studentData.email
  //     });
  //   } else {
  //     console.error('Form chưa được khởi tạo!');
  //     this.alertService.displayAlert('Form chưa được khởi tạo.', 'danger');
  //   }
  // }
  
  deleteStudent(StudentID: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa sinh viên này không?')) {
      this.studentService.deleteStudent(StudentID).subscribe(
        (response) => {
          this.alertService.displayAlert('Xóa sinh viên thành công!', 'success');
          this.fetchStudents();
        },
        (error) => {
          this.alertService.displayAlert('Lỗi khi xóa sinh viên.', 'danger');
          console.error('Lỗi khi xóa sinh viên:', error);
        }
      );
    }
  }
}