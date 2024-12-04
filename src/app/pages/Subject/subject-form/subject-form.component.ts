import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubjectService } from 'src/app/services/subject.service';
import Swal from 'sweetalert2'; // Import SweetAlert2
declare var bootstrap: any;
@Component({
  selector: 'app-subject-form',
  templateUrl: './subject-form.component.html'
})
export class SubjectFormComponent implements OnInit {
  subjectForm!: FormGroup;
  isUpdate: boolean = false;
  backendErrors: any = {};
  successMessage: string = '';
  subjectData: any;

  @Output() subjectUpdated = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private subjectService: SubjectService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.initializeForm();

    // Lắng nghe sự kiện khi chọn môn học để tải dữ liệu cập nhật
    this.subjectService.selectedSubject$.subscribe(subjectData => {
      if (subjectData) {
        this.loadSubjectData(subjectData);
      }
    });
  }


  initializeForm() {
    this.subjectForm = this.fb.group({
      subjectsID: [''],
      subjectsCode: ['', Validators.required],  // Giả sử đây là trường bắt buộc
      subjectsName: ['', Validators.required]
    });
  }


  setFormValidators() {
    if (this.isUpdate) {
      this.subjectForm.get('subjectsCode')?.clearValidators();
    } else {
      this.subjectForm.get('subjectsCode')?.setValidators([Validators.required]);
    }
    this.subjectForm.get('subjectsCode')?.updateValueAndValidity();
  }

  loadSubjectData(subjectData: any): void {
    this.isUpdate = true;

    this.subjectForm.patchValue({
      subjectsID: subjectData.subjectsID,
      subjectsCode: subjectData.subjectsCode,
      subjectsName: subjectData.subjectsName
    });
  }


  resetForm() {
    // Reset the form values and clear any errors
    this.subjectForm.reset({
      subjectsID: '',
      subjectsCode: '',
      subjectsName: ''
    });

    // Reset the isUpdate flag and set the appropriate validators
    this.isUpdate = false;
    this.setFormValidators();

    // Clear success message and backend errors
    this.successMessage = '';
    this.backendErrors = {};

    // Ensure the form is fully reset and the UI is updated
    this.cdr.detectChanges(); // Trigger change detection
  }
  onSubmit() {
  this.backendErrors = {};
  this.successMessage = '';

  if (this.subjectForm.invalid) {
    this.subjectForm.markAllAsTouched();
    return;
  }

  const subjectData = this.subjectForm.getRawValue();
  console.log('Subject Data being sent:', subjectData); // Log dữ liệu gửi đi

  const apiCall = this.isUpdate
    ? this.subjectService.updateSubject(subjectData)
    : this.subjectService.createSubject(subjectData);

  apiCall.subscribe({
    next: (response) => {
      if (response && response.message) {
        this.successMessage = response.message;
        console.log(this.successMessage);

        // Dynamically set the success message based on the response
        const successTitle = this.isUpdate ? 'Cập nhật thành công!' : 'Thêm môn học thành công!';
        const successText = response.message; // Use the response message dynamically

        // SweetAlert2 thông báo thành công
        Swal.fire({
          title: successTitle,
          text: successText,
          icon: 'success',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();

            // Gọi hàm để tự động đóng modal
            this.closeModal();

            // Phát sự kiện để cập nhật danh sách môn học ở `SubjectComponent`
            this.subjectUpdated.emit();

            // Reset form sau khi thêm/cập nhật thành công
            this.resetForm();

            // Trigger change detection manually (if required)
            this.cdr.detectChanges();
          }
        });
      }
    },
    error: (error) => {
      console.error('Lỗi:', error);
      this.handleBackendErrors(error);
    }
  });
}





  closeModal() {
    const modalElement = document.getElementById('subjectModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
      modal.hide();
    }
  }

  handleBackendErrors(error: any) {
    if (error.status === 409 && error.error) {
      if (error.error.includes('Mã môn học')) {
        this.backendErrors = { subjectsCode: error.error };
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
