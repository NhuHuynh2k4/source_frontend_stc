import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from 'src/app/services/student.service';

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
  constructor(private fb: FormBuilder, private studentService: StudentService) {}

  
  ngOnInit(): void {
    this.initializeForm();
    console.log('Form đã được khởi tạo:', this.studentForm);
  }

  get f() {
    return this.studentForm.controls;
  }

  initializeForm() {
    this.studentForm = this.fb.group({
      studentCode: [{ value: '', disabled: this.isUpdate }, Validators.required],
      studentName: ['', Validators.required],
      numberPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      birthdayDate: ['', Validators.required],
      gender: [true, Validators.required],
      password: ['', this.isUpdate ? [] : Validators.required],
      confirmPassword: ['', this.isUpdate ? [] : Validators.required]
    }, {
      validators: this.isUpdate ? null : this.passwordMatchValidator
    });
  }
  openModal(data: any) {  
    this.studentData = data;  
    this.studentForm.patchValue({  
      studentCode: this.studentData.studentCode,  
      studentName: this.studentData.studentName,  
      gender: this.studentData.gender,  
      numberPhone: this.studentData.numberPhone,  
      birthdayDate: this.studentData.birthdayDate,  
      address: this.studentData.address,  
      email: this.studentData.email  
    });  
  }  
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
        this.successMessage = this.isUpdate ? 'Cập nhật thành công' : 'Thêm mới thành công';  // Hiển thị thông báo thành công
        console.log(this.successMessage);  // In ra console (nếu cần)
      },
      error: error => {
        this.handleBackendErrors(error);
      }
    });
  }

  handleBackendErrors(error: any) {
    if (error.error && typeof error.error === 'object') {
      this.backendErrors = error.error;
    } else {
      this.backendErrors = { general: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
    }
  }

  loadStudentData(studentData: any) : void{
    console.log('Dữ liệu nạp vào form:', studentData);
    this.isUpdate = true;
    // Chuyển đổi birthdayDate sang định dạng phù hợp với <input type="date">
  const formattedData = {
    ...studentData,
    birthdayDate: studentData.birthdayDate.split('T')[0] // Lấy phần ngày (YYYY-MM-DD)
  };

  if (this.studentForm) {
    this.studentForm.patchValue(formattedData);
    console.log('Dữ liệu sau khi patchValue:', this.studentForm.value);  // Kiểm tra lại dữ liệu sau khi cập nhật form
  }
    const { password, confirmPassword, ...studentDataWithoutPassword } = studentData;
    this.studentForm.patchValue(studentDataWithoutPassword); // Đảm bảo không thay đổi password khi cập nhật
  }
  
}

