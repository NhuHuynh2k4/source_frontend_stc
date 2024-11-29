import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClassStudentService } from '../../../services/classStudent.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
declare var bootstrap: any;

@Component({
  selector: 'app-class-student-table',
  templateUrl: './class_student_table.component.html',
  styleUrls: ['./class_student_table.component.css']
})
export class ClassStudentTableComponent implements OnInit {
  classStudentForm!: FormGroup;
  isUpdate: boolean = false;
  classStudents: any[] = [];
  selectedClassStudent: any = {};
  classList: any[] = [];
  studentList: any[] = [];

  paginatedClassStudents: any[] = [];
  rowsPerPageOptions: number[] = [5, 10, 15, 20];
  rowsPerPage: number = 5;
  currentPage: number = 1;
  totalPages: number = 0;
  pages: number[] = [];

  constructor(
    private classStudentService: ClassStudentService,
    private fb: FormBuilder
  ) {
    this.classStudentForm = this.fb.group({
      class_StudentID: [''],
      class_StudentName: [''],
    });
  }

  showSuccess(message: string, title: string): void {
    Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      confirmButtonText: 'OK',
      timer: 3000,
      timerProgressBar: true
    });
  }

  showError(message: string, title: string): void {
    Swal.fire({
      title: title,
      text: message,
      icon: 'error',
      confirmButtonText: 'OK',
      timer: 3000,
      timerProgressBar: true
    });
  }

  ngOnInit(): void {
    this.fetchClassStudents();
    this.fetchClasses();
    this.fetchStudents();
    this.calculatePagination();
  }

  fetchClasses(): void {
    this.classStudentService.getClasses().subscribe({
      next: (data: any[]) => {
        this.classList = data;
        this.showSuccess('Tải danh sách lớp thành công!', 'Thành công');
      },
      error: () => {
        this.showError('Không thể tải danh sách lớp', 'Lỗi');
      }
    });
  }

  fetchStudents(): void {
    this.classStudentService.getStudents().subscribe({
      next: (data: any[]) => {
        this.studentList = data;
        this.showSuccess('Tải danh sách học sinh thành công!', 'Thành công');
      },
      error: () => {
        this.showError('Không thể tải danh sách học sinh', 'Lỗi');
      }
    });
  }

  fetchClassStudents(): void {
    this.classStudentService.getClassStudents().subscribe(
      (data) => {
        this.classStudents = data;
        this.calculatePagination();
      },
      (error) => {
        this.showError('Lỗi khi lấy danh sách học sinh', 'Error');
      }
    );
  }

  getClassDetails(classID: number): string {
    const classInfo = this.classList.find(cls => cls.classID === classID);
    return classInfo ? `${classInfo.classID} - ${classInfo.classCode} - ${classInfo.className}` : 'Không có thông tin';
  }

  getStudentDetails(studentID: number): string {
    const studentInfo = this.studentList.find(stu => stu.studentID === studentID);
    return studentInfo ? `${studentInfo.studentID} - ${studentInfo.studentCode} - ${studentInfo.studentName}` : 'Không có thông tin';
  }

  onEdit(class_StudentID: number): void {
    this.classStudentService.getClassStudentById(class_StudentID).subscribe({
      next: (data) => {
        this.selectedClassStudent = data;
        this.classStudentService.setSelectedClassStudent(data);
        const modalElement = document.getElementById('exampleModal');
        if (modalElement) {
          const modal = new (window as any).bootstrap.Modal(modalElement);
          modal.show();
        }
      },
      error: (error) => {
        console.error('Lỗi khi lấy thông tin loại câu hỏi:', error);
      }
    });
  }

  onUpdate(): void {
    if (this.classStudentForm.valid) {
      this.classStudentService.updateClassStudent(this.classStudentForm.value).subscribe(
        (response) => {
          this.showSuccess('Cập nhật học sinh thành công!', 'Thành công');
          this.fetchClassStudents(); // Reload the class student list
          this.closeModal();
        },
        (error) => {
          this.showError('Cập nhật học sinh thất bại!', 'Lỗi');
          console.error('Lỗi khi cập nhật học sinh:', error);
        }
      );
    }
  }

  closeModal(): void {
    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
      modal.hide();
    }
  }

  deleteClassStudent(class_StudentID: number): void {
    Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: 'Thao tác này sẽ xóa học sinh!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        this.classStudentService.deleteClassStudent(class_StudentID).subscribe(
          (response) => {
            this.showSuccess('Xóa học sinh thành công!', 'Thành công');
            this.classStudents = this.classStudents.filter(item => item.class_StudentID !== class_StudentID);
            this.fetchClassStudents();
          },
          (error) => {
            this.showError('Xóa học sinh thất bại!', 'Lỗi');
            console.error('Lỗi khi xóa học sinh:', error);
          }
        );
      }
    });
  }

  exportExcel(): void {
    this.classStudentService.exportToExcel().subscribe({
      next: (response: Blob) => {
        // Tạo một đường dẫn tạm thời để tải file về
        const link = document.createElement('a');
        link.href = URL.createObjectURL(response);
        link.download = 'ClassStudents.xlsx';
        link.click();
        this.showSuccess('Xuất Excel thành công!', 'Thành công');
      },
      error: () => {
        this.showError('Có lỗi khi xuất Excel!', 'Lỗi');
      }
    });
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.classStudents.length / this.rowsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updatePagination();
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
    this.paginatedClassStudents = this.classStudents.slice(startIndex, endIndex);
  }

  onRowsPerPageChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.rowsPerPage = +selectedValue;
    this.currentPage = 1;
    this.calculatePagination();
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }
}
