import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { StudentService } from 'src/app/services/student.service';
import { AlertService } from "../../../services/alert.service";

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
    public alertService: AlertService
  ) {}

  
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

  get f() {
    return this.studentForm.controls;
  }

  initializeForm() {
    this.studentForm = this.fb.group({ 
      studentID: [''], 
      studentCode: [{ value: '', 
      disabled: this.isUpdate },
      Validators.required], 
      studentName: ['', Validators.required], 
      numberPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], 
      email: ['', [Validators.required, Validators.email]], 
      address: ['', Validators.required], 
      birthdayDate: ['', [Validators.required, dateLessThanTodayValidator()]], // Thêm Validator tùy chỉnh
      gender: [true, Validators.required], 
      password: [''], 
      confirmPassword: [''] }); 
      this.setFormValidators(); }
   setFormValidators() { if (this.isUpdate) { 
    this.studentForm.get('password')?.clearValidators(); 
    this.studentForm.get('confirmPassword')?.clearValidators(); } else
    { this.studentForm.get('password')?.setValidators([Validators.required]); 
    this.studentForm.get('confirmPassword')?.setValidators([Validators.required]); } 
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

  // openModal(data: any) {
  //   this.studentData = data;
  //   this.studentForm.patchValue({
  //     studentCode: this.studentData.studentCode,
  //     studentName: this.studentData.studentName,
  //     gender: this.studentData.gender,
  //     numberPhone: this.studentData.numberPhone,
  //     birthdayDate: this.studentData.birthdayDate,
  //     address: this.studentData.address,
  //     email: this.studentData.email
  //   });
  // }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    this.backendErrors = {};  
    this.successMessage = '';  // Reset thông báo thành công mỗi khi submit
    this.studentForm.markAllAsTouched();
  
    if (this.studentForm.invalid) {
      return;
    }
  
    const studentData = this.studentForm.getRawValue();  
  
    if (this.isUpdate) {
      delete studentData.password;
      delete studentData.confirmPassword;
    } else {
      delete studentData.confirmPassword;
    }
  
    const apiCall = this.isUpdate ? this.studentService.updateStudent(studentData) : this.studentService.createStudent(studentData);
    apiCall.subscribe({
      next: response => {
        if (response) {
          this.successMessage = response.message;
          console.log(this.successMessage);
          console.log("Isupdate"+this.isUpdate);

          this.alertService.displayAlert(this.isUpdate ? "Cập nhật thành công" : "Thêm thành công", 'success');

          // Đóng modal sau khi thành công
          const modalElement = document.getElementById('exampleModal1');
          if (modalElement) {
            const modal = new (window as any).bootstrap.Modal(modalElement);
            modal.hide();
          }
          
          // Reset form sau khi modal đóng
          this.resetForm();
        } else {
          console.error('No message found in response:', response);
          this.alertService.displayAlert('Lỗi', 'danger');
        }  // In ra console (nếu cần)
      },
      error: error => {
        console.error('Error:', error);
        this.handleBackendErrors(error);
      }
    });
  }

  handleBackendErrors(error: any) {
    if (error.status === 409 && error.error) {
      if (error.error.includes('Mã sinh viên')) {
        this.backendErrors = { studentCode: error.error };
      } else if (error.error.includes('Email')) {
        this.backendErrors = { email: error.error };
      } else {
        this.backendErrors = { general: error.error };
      }
    } else if (error.error && typeof error.error === 'object') {
      this.backendErrors = error.error;
    } else {
      this.backendErrors = { general: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
    }
  }

}

export function dateLessThanTodayValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null =>
    { const today = new Date().setHours(0, 0, 0, 0); // Lấy ngày hiện tại mà không tính giờ phút
      const inputDate = new Date(control.value).setHours(0, 0, 0, 0); // Lấy ngày nhập mà không tính giờ phút
       if (inputDate >= today) { return { dateInvalid: true }; } return null; }; }