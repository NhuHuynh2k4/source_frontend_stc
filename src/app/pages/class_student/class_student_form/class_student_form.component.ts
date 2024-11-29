import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClassStudentService } from 'src/app/services/classStudent.service';
import Swal from 'sweetalert2';
import { positiveNumberValidator } from './positive_Number.Validator ';
declare var bootstrap: any;

@Component({
  selector: 'app-class-student-form',
  templateUrl: './class_student_form.component.html',
  styleUrls: ['./class_student_form.component.css']
})
export class ClassStudentFormComponent implements OnInit {
  classStudentForm!: FormGroup;
  isUpdate: boolean = false;
  backendErrors: any = {};
  successMessage: string = '';
  selectedClassStudent: any = {};
  classList: any[] = [];
  studentList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private classStudentService: ClassStudentService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.classStudentService.selectedClassStudent$.subscribe(classStudent => {
      if (classStudent) {
        this.loadClassStudentData(classStudent);
      }
    });
    this.fetchClasses();
    this.fetchStudents();
    
  }

  fetchClasses(): void {
    this.classStudentService.getClasses().subscribe({
      next: (data: any[]) => {
        this.classList = data;
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
      },
      error: () => {
        this.showError('Không thể tải danh sách học sinh', 'Lỗi');
      }
    });
  }

  initializeForm(): void {
    this.classStudentForm = this.fb.group({
      class_StudentID: [''],
      classID: [null, [Validators.required, Validators.min(1)]],
      studentID: [null, [Validators.required, Validators.min(1)]]
    });
  }

  loadClassStudentData(data: any): void {
    this.isUpdate = true;
    this.classStudentForm.patchValue({
      class_StudentID: data.class_StudentID,
      classID: data.classID,
      studentID: data.studentID
    });
  }

  resetForm(): void {
    this.classStudentForm.reset({
      class_StudentID: [''],
      classID: 0,
      studentID: 0
    });
    this.isUpdate = false;
    this.successMessage = '';
    this.backendErrors = {};
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

  onSubmit(): void {
    this.backendErrors = {};
    this.successMessage = '';
    this.classStudentForm.markAllAsTouched();

    if (this.classStudentForm.invalid) {
      return;
    }

    const classStudentData = this.classStudentForm.getRawValue();

    const apiCall = this.isUpdate
      ? this.classStudentService.updateClassStudent(classStudentData)
      : this.classStudentService.addClassStudent(classStudentData);

    apiCall.subscribe({
      next: response => {
        if (response && response.message) {
          this.successMessage = response.message;

          this.closeModal();
          this.resetForm();
          this.showSuccess(response.message, 'Thành công');
        }
      },
      error: error => {
        this.handleBackendErrors(error);
      }
    });
  }

  closeModal(): void {
    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
      modal.hide();
      window.location.reload();
    }
  }

  handleBackendErrors(error: any): void {
    if (error.status === 409 && error.error) {
      if (error.error.includes('classID')) {
        this.backendErrors = { classID: error.error };
      } else if (error.error.includes('studentID')) {
        this.backendErrors = { studentID: error.error };
      } else {
        this.backendErrors = { general: error.error };
      }
    } else if (error.error && typeof error.error === 'object') {
      this.backendErrors = error.error;
    } else {
      this.backendErrors = { general: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
    }
  }

  get f() {
    return this.classStudentForm.controls;
  }
}
