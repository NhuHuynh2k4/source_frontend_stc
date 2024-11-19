import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuestionTypeService } from 'src/app/services/questionType.service';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, ValidatorFn } from '@angular/forms';

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
  
  constructor(
    private fb: FormBuilder,
    private questionTypeService: QuestionTypeService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.questionTypeService.selectedQuestionType$.subscribe(questionType => {
      if (questionType) {
        this.loadQuestionTypeData(questionType);
      }
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
    this.toastrService.success(message, title);
  }

  showError(message: string, title: string): void {
    this.toastrService.error(message, title);
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

          const modalElement = document.getElementById('exampleModal');
          if (modalElement) {
            const modal = new (window as any).bootstrap.Modal(modalElement);
            modal.hide();
          }

          this.resetForm();
        }
      },
      error: error => {
        this.handleBackendErrors(error);
      }
    });
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

  // export function dateLessThanTodayValidator(): ValidatorFn {
  //   return (control: AbstractControl): { [key: string]: any } | null => {
  //     const today = new Date().setHours(0, 0, 0, 0); // Lấy ngày hiện tại mà không tính giờ phút
  //     const inputDate = new Date(control.value).setHours(0, 0, 0, 0); // Lấy ngày nhập mà không tính giờ phút
  //     if (inputDate >= today) { return { dateInvalid: true }; } return null;
  //   };
  // }
}
