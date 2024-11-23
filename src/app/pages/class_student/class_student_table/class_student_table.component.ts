import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClassStudentService } from '../../../services/classStudent.service';
import { ToastrService } from 'ngx-toastr';

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
  classList: any[] = []; // Danh sách các lớp học
  studentList: any[] = []; // Danh sách học sinh

  constructor(
    private classStudentService: ClassStudentService,
    private toastrService: ToastrService,
    private fb: FormBuilder
  ) {
    // Initialize the form
    this.classStudentForm = this.fb.group({
      class_StudentID: [''],
      class_StudentName: [''],
      // Add more fields as needed
    });
  }

  ngOnInit(): void {
    this.fetchClassStudents();
    this.fetchClasses();
    this.fetchStudents();
  }

  fetchClasses(): void {
    this.classStudentService.getClasses().subscribe({
      next: (data: any[]) => {
        this.classList = data;
      },
      error: () => {
        this.toastrService.error('Không thể tải danh sách lớp', 'Lỗi');
      }
    });
  }

  fetchStudents(): void {
    this.classStudentService.getStudents().subscribe({
      next: (data: any[]) => {
        this.studentList = data;
      },
      error: () => {
        this.toastrService.error('Không thể tải danh sách học sinh', 'Lỗi');
      }
    });
  }

  // Fetch the list of class students
  fetchClassStudents(): void {
    this.classStudentService.getClassStudents().subscribe(
      (data) => {
        this.classStudents = data;
      },
      (error) => {
        this.toastrService.error('Lỗi khi lấy danh sách học sinh', 'Error');
      }
    );
  }

  // Get class details by classID
  getClassDetails(classID: number): string {
    const classInfo = this.classList.find(cls => cls.classID === classID);
    return classInfo ? `${classInfo.classID} - ${classInfo.classCode} - ${classInfo.className}` : 'Không có thông tin';
  }

  // Get student details by studentID
  getStudentDetails(studentID: number): string {
    const studentInfo = this.studentList.find(stu => stu.studentID === studentID);
    return studentInfo ? `${studentInfo.studentID} - ${studentInfo.studentCode} - ${studentInfo.studentName}` : 'Không có thông tin';
  }

  // Edit a class student
  onEdit(class_StudentID: number): void {
    this.classStudentService.getClassStudentById(class_StudentID).subscribe({
      next: (data) => {
        this.selectedClassStudent = data;
        this.classStudentService.setSelectedClassStudent(data); // Sử dụng service để đặt dữ liệu
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

  // Update class student
  onUpdate(): void {
    if (this.classStudentForm.valid) {
      this.classStudentService.updateClassStudent(this.classStudentForm.value).subscribe(
        (response) => {
          this.showSuccess('Cập nhật học sinh thành công!', 'Success');
          this.fetchClassStudents(); // Reload the class student list
          this.closeModal();
        },
        (error) => {
          this.showError('Cập nhật học sinh thất bại!', 'Error');
          console.error('Lỗi khi cập nhật học sinh:', error);
        }
      );
    }
  }

  // Close the modal
  closeModal(): void {
    const modalElement = document.getElementById('classStudentModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.hide();
    }
  }

  // Show success notification
  showSuccess(message: string, title: string): void {
    this.toastrService.success(message, title);
  }

  // Show error notification
  showError(message: string, title: string): void {
    this.toastrService.error(message, title);
  }

  // Delete class student
  deleteClassStudent(class_StudentID: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa học sinh này không?')) {
      this.classStudentService.deleteClassStudent(class_StudentID).subscribe(
        (response) => {
          this.showSuccess('Xóa học sinh thành công!', 'Success');
          this.classStudents = this.classStudents.filter(item => item.class_StudentID !== class_StudentID);
        },
        (error) => {
          this.showError('Xóa học sinh thất bại!', 'Error');
          console.error('Lỗi khi xóa học sinh:', error);
        }
      );
    }
  }
}
