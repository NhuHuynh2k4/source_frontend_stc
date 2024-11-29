import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuestionTypeService } from 'src/app/services/questionType.service';
import Swal from 'sweetalert2';
import { AbstractControl, ValidatorFn } from '@angular/forms';
declare var bootstrap: any;

@Component({
  selector: 'app-question-type-form',
  templateUrl: './question_type_form.component.html',
  styleUrls: ['./question_type_form.component.css']
})
export class QuestionTypeFormComponent implements OnInit {
  questionTypeForm!: FormGroup;
  isUpdate: boolean = false;
  backendErrors: any = {};
  successMessage: string = '';
  selectedQuestionType: any = {};
  questionTypeList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private questionTypeService: QuestionTypeService,
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadQuestionTypeList();
    this.questionTypeService.selectedQuestionType$.subscribe(questionType => {
      if (questionType) {
        this.loadQuestionTypeData(questionType);
      }
    });
  }

  loadQuestionTypeList(): void {
    this.questionTypeService.getQuestionType().subscribe({
      next: (data) => {
        this.questionTypeList = data;
      },
      error: (err) => {
        this.showError('Không thể tải danh sách loại câu hỏi', 'Lỗi');
      },
    });
  }

  initializeForm(): void {
    this.questionTypeForm = this.fb.group({
      questionTypeID: [''],
      questionTypeCode: ['', Validators.required],
      questionTypeName: ['', Validators.required]
    });
  }

  loadQuestionTypeData(data: any): void {
    this.isUpdate = true;
    this.questionTypeForm.patchValue({
      questionTypeID: data.questionTypeID,
      questionTypeCode: data.questionTypeCode,
      questionTypeName: data.questionTypeName
    });
  }

  resetForm(): void {
    this.questionTypeForm.reset({
      questionTypeID: [''],
      questionTypeCode: '',
      questionTypeName: '',
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
    this.questionTypeForm.markAllAsTouched();

    if (this.questionTypeForm.invalid) {
      return;
    }

    const questionTypeData = this.questionTypeForm.getRawValue();

    const apiCall = this.isUpdate
      ? this.questionTypeService.updateQuestionType(questionTypeData)
      : this.questionTypeService.addQuestionType(questionTypeData);

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
      if (error.error.includes('Mã loại câu hỏi')) {
        this.backendErrors = { questionTypeCode: error.error };
      } else if (error.error.includes('Tên loại câu hỏi')) {
        this.backendErrors = { questionTypeName: error.error };
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
    return this.questionTypeForm.controls;
  }
}
