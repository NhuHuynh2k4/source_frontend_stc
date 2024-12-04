import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StudentService } from 'src/app/services/student.service';
import { AlertStudentService } from "../../../services/alertStudent.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-table',
  templateUrl: './student-table.component.html',
  styleUrls: ['./student-table.component.css']
})
export class StudentTableComponent implements OnInit {
  studentForm!: FormGroup;
  isUpdate: boolean = false;
  students: any[] = [];
  filteredStudents: any[] = []; // Danh sách sinh viên đã lọc
  searchKeyword: string = ''; // Biến từ khóa tìm kiếm

  constructor(
    private studentService: StudentService,
    private fb: FormBuilder,
    public alertService: AlertStudentService
  ) {
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

  showSuccess(message: string, title: string): void {
    Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      confirmButtonText: 'OK',
      didOpen: () => {
        const swalPopup = document.querySelector('.swal2-container') as HTMLElement;
        if (swalPopup) {
          swalPopup.style.zIndex = '9999';
        }
      }
    });
  }

  showError(message: string, title: string): void {
    Swal.fire({
      title: title,
      text: message,
      icon: 'error',
      confirmButtonText: 'OK',
      didOpen: () => {
        const swalPopup = document.querySelector('.swal2-container') as HTMLElement;
        if (swalPopup) {
          swalPopup.style.zIndex = '9999';
        }
      }
    });
  }

  ngOnInit(): void {
    this.fetchStudents();
  }

  fetchStudents(): void {
    this.studentService.getStudents().subscribe(
      (data) => {
        this.students = data;
        this.filteredStudents = data; // Gán danh sách lọc ban đầu
      },
      (error) => {
        console.error('Error fetching students:', error);
        this.alertService.displayStudentAlert('Lỗi khi lấy danh sách sinh viên.', 'error');
      }
    );
  }

  filterStudents(): void {
    if (!this.searchKeyword) {
      this.filteredStudents = this.students; // Nếu không có từ khóa tìm kiếm, hiển thị tất cả sinh viên
    } else {
      this.filteredStudents = this.students.filter(student =>
        student.studentName.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        student.studentCode.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        student.email.toLowerCase().includes(this.searchKeyword.toLowerCase()) // Có thể thêm các trường khác
      );
    }
  }

  onEdit(studentId: number) {
    this.studentService.getStudentById(studentId).subscribe({
      next: (studentData) => {
        this.studentService.setSelectedStudent(studentData);
        const modalElement = document.getElementById('exampleModal1');
        if (modalElement) {
          const modal = new (window as any).bootstrap.Modal(modalElement);
          modal.show();
        }
      },
      error: (error) => {
        console.error('Lỗi khi lấy thông tin sinh viên:', error);
        this.alertService.displayStudentAlert('Lỗi khi lấy thông tin sinh viên.', 'error');
      }
    });
  }

  deleteStudent(StudentID: number): void {
    Swal.fire({
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc chắn muốn xóa sinh viên này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        // Thực hiện xóa sinh viên
        this.studentService.deleteStudent(StudentID).subscribe(
          (response) => {
            this.showSuccess('Xóa sinh viên thành công!', 'Thành công');
            this.fetchStudents(); // Cập nhật lại danh sách sau khi xóa
          },
          (error) => {
            this.showError('Lỗi khi xóa sinh viên.', 'Thất bại');
            console.error('Lỗi khi xóa sinh viên:', error);
          }
        );
      }
    });
  }
  

  exportToExcel(): void {
    this.studentService.exportToExcel().subscribe((blob: Blob) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob); // Tạo URL cho file

      a.href = objectUrl;
      a.download = 'Student.xlsx'; // Tên file tải xuống
      a.click(); // Kích hoạt tải file

      URL.revokeObjectURL(objectUrl); // Giải phóng URL sau khi tải
    }, error => {
      console.error('Xuất Excel thất bại', error);
    });
  }
}
