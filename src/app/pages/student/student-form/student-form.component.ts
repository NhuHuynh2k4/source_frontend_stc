import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { StudentService } from 'src/app/services/student.service';
import { AlertStudentService } from "../../../services/alertStudent.service";
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
declare var bootstrap: any;

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html'
})
export class StudentFormComponent implements OnInit {

  studentForm!: FormGroup;
  isUpdate: boolean = false;
  backendErrors: any = {};
  successMessage: string = '';  // Biến lưu thông báo thành công
  studentData: any;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    public alertStudentService: AlertStudentService,
    private toastr: ToastrService // Thêm ToastrService
  ) { }


  ngOnInit(): void {
    this.initializeForm();

    this.studentService.selectedStudent$.subscribe(
      studentData => {
        if (studentData) {
          this.loadStudentData(studentData);
        }
      }
    );

    console.log('Form đã được khởi tạo:', this.studentForm);
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

  get f() {
    return this.studentForm.controls;
  }

  initializeForm() {
    this.studentForm = this.fb.group({
      studentID: [''],
      studentCode: [{
        value: '',
        disabled: this.isUpdate
      },
      Validators.required],
      studentName: ['', Validators.required],
      numberPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      birthdayDate: ['', [Validators.required, dateLessThanTodayValidator()]], // Thêm Validator tùy chỉnh
      gender: [true, Validators.required],
      password: [''],
      confirmPassword: ['']
    });
    this.setFormValidators();
  }
  setFormValidators() {
    if (this.isUpdate) {
      this.studentForm.get('password')?.clearValidators();
      this.studentForm.get('confirmPassword')?.clearValidators();
    } else {
      this.studentForm.get('password')?.setValidators([Validators.required]);
      this.studentForm.get('confirmPassword')?.setValidators([Validators.required]);
    }
    this.studentForm.get('password')?.updateValueAndValidity(); this.studentForm.get('confirmPassword')?.updateValueAndValidity();
  }

  loadStudentData(studentData: any): void {
    this.isUpdate = true; // Đặt trạng thái cập nhật trước khi nạp dữ liệu

    this.studentForm.patchValue({
      studentID: studentData.studentID,
      studentCode: studentData.studentCode,
      studentName: studentData.studentName,
      gender: studentData.gender,
      numberPhone: studentData.numberPhone,
      address: studentData.address,
      email: studentData.email,
      birthdayDate: studentData.birthdayDate.split('T')[0]
    });

    this.setFormValidators(); // Cập nhật validators dựa trên trạng thái cập nhật
  }

  resetForm() {
    this.studentForm.reset({
      studentID: '',
      studentCode: '',
      studentName: '',
      gender: true,
      numberPhone: '',
      address: '',
      email: '',
      birthdayDate: '',
      password: '',
      confirmPassword: ''
    });

    this.isUpdate = false;
    this.setFormValidators(); // Đặt lại validators khi thêm mới

    this.successMessage = '';
    this.backendErrors = {};
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    this.backendErrors = {};
    this.successMessage = '';
    this.studentForm.markAllAsTouched();

    if (this.studentForm.invalid) {
      return;
    }

    const studentData = this.studentForm.getRawValue();

    if (this.isUpdate) {
      ['password', 'confirmPassword'].forEach(field => delete studentData[field]);
    } else {
      delete studentData.confirmPassword;
    }

    const apiCall = this.isUpdate
      ? this.studentService.updateStudent(studentData)
      : this.studentService.createStudent(studentData);

    console.log('Dữ liệu gửi lên API:', studentData);

    apiCall.subscribe({
      next: response => {
        console.log('API trả về:', response);
        this.handleSuccess(response);
      },
      error: error => {
        console.error('Lỗi từ API:', error);
        console.log('Chi tiết lỗi:', JSON.stringify(error));
        this.handleBackendErrors(error);
      }
    });
  }

  handleSuccess(response: any) {
    if (response && response.message) {
      this.successMessage = response.message;

      // Hiển thị thông báo Swal
      this.showSuccess(
        this.isUpdate ? "Cập nhật thành công!" : "Thêm thành công!",
        "Thành công"
      );

      // Đóng modal và reset form
      this.closeModal();
      this.resetForm();
    } else {
      this.alertStudentService.displayStudentAlert('Lỗi không xác định', 'error');
    }
  }

  closeModal(): void {
    const modalElement = document.getElementById('exampleModal1');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
      modal.hide();
      window.location.reload();
    }
  }


  handleBackendErrors(error: any) {
    if (error.status === 409 && error.error && error.error.message) {
      const errorMapping: { [key: string]: string } = {
        'Mã sinh viên': 'studentCode',
        'Email': 'email',
        'Địa chỉ': 'address',
        'Tên': 'studentName',
        'Giới tính': 'gender',
        'Số điện thoại': 'numberPhone',
        'Ngày sinh': 'birthdayDate',
      };

      for (const [key, formField] of Object.entries(errorMapping)) {
        if (error.error.message.includes(key)) {
          this.backendErrors = { [formField]: error.error.message };
          // Hiển thị thông báo lỗi với Swal
          this.showError(`Lỗi: ${error.error.message}`, "Thất bại");
          return;
        }
      }

      this.backendErrors = { general: error.error.message };
      this.showError("Có lỗi xảy ra, vui lòng thử lại sau.", "Thất bại");
    } else if (error.error && typeof error.error === 'object') {
      this.backendErrors = error.error;
      this.showError("Dữ liệu không hợp lệ, vui lòng kiểm tra lại.", "Thất bại");
    } else {
      this.backendErrors = { general: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
      this.showError("Có lỗi xảy ra, vui lòng thử lại sau.", "Thất bại");
    }
  }

}
export function dateLessThanTodayValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const today = new Date().setHours(0, 0, 0, 0); // Lấy ngày hiện tại mà không tính giờ phút
    const inputDate = new Date(control.value).setHours(0, 0, 0, 0); // Lấy ngày nhập mà không tính giờ phút
    if (inputDate >= today) { return { dateInvalid: true }; } return null;
  };
}