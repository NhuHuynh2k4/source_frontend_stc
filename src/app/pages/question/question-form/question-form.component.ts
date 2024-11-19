import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuestionService } from 'src/app/services/question.service'; // Đảm bảo đường dẫn chính xác
declare var bootstrap: any;

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.css']
})
export class QuestionFormComponent implements OnInit {
  questionForm!: FormGroup;
  isUpdate: boolean = false;
  backendErrors: any = {};
  successMessage: string = '';
  questionData: any;

  @Output() questionUpdated = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private questionService: QuestionService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.initializeForm();

    // Lắng nghe sự kiện khi chọn câu hỏi để tải dữ liệu cập nhật
    this.questionService.selectedQuestion$.subscribe(questionData => {
      if (questionData) {
        this.loadQuestionData(questionData);
      }
    });
  }

  // Khởi tạo form câu hỏi
  initializeForm() {
    this.questionForm = this.fb.group({
      questionID: [''],
      questionCode: ['', Validators.required],
      questionName: ['', Validators.required],
      questionTextContent: ['', Validators.required],  // Nội dung câu hỏi là bắt buộc
      questionImgContent: [''],  // Hình ảnh câu hỏi có thể không bắt buộc
      subjectsID: ['', Validators.required],  // Chủ đề câu hỏi là bắt buộc
      questionTypeID: ['', Validators.required]  // Loại câu hỏi là bắt buộc
    });
  }

  // Thiết lập validators cho form
  setFormValidators() {
    if (this.isUpdate) {
      this.questionForm.get('questionCode')?.clearValidators();
    } else {
      this.questionForm.get('questionCode')?.setValidators([Validators.required]);
    }
    this.questionForm.get('questionCode')?.updateValueAndValidity();
  }

  // Nạp dữ liệu câu hỏi vào form khi chỉnh sửa
  loadQuestionData(questionData: any): void {
    this.isUpdate = true;
    this.questionForm.patchValue({
      questionID: questionData.questionID,
      questionCode: questionData.questionCode,
      questionName: questionData.questionName,
      questionTextContent: questionData.questionTextContent,
      questionImgContent: questionData.questionImgContent,
      subjectsID: questionData.subjectsID,
      questionTypeID: questionData.questionTypeID
    });
  }
// Lấy danh sách môn học

  // Reset form
  resetForm() {
    this.questionForm.reset({
      questionID: '',
      questionCode: '',
      questionName: '',
      questionTextContent: '',
      questionImgContent: '',
      subjectsID: '',
      questionTypeID: ''
    });

    this.isUpdate = false;
    this.setFormValidators();
    this.successMessage = '';
    this.backendErrors = {};
    this.cdr.detectChanges(); // Cập nhật UI sau khi reset form
  }

  // Xử lý submit form
  onSubmit() {
    this.backendErrors = {};
    this.successMessage = '';

    if (this.questionForm.invalid) {
      this.questionForm.markAllAsTouched();
      return;
    }

    const questionData = this.questionForm.getRawValue();
    console.log('Question Data being sent:', questionData); // Log dữ liệu gửi đi

    const apiCall = this.isUpdate
      ? this.questionService.updateQuestion(questionData)
      : this.questionService.createQuestion(questionData);

    apiCall.subscribe({
      next: (response) => {
        if (response && response.message) {
          this.successMessage = response.message;
          console.log(this.successMessage);

          // Gọi hàm để tự động đóng modal
          this.closeModal();

          // Phát sự kiện để cập nhật danh sách câu hỏi ở `QuestionComponent`
          this.questionUpdated.emit();

          // Reset form sau khi thêm/cập nhật thành công
          this.resetForm();

          // Trigger change detection manually
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Lỗi:', error);
        this.handleBackendErrors(error);
      }
    });
  }

  // Đóng modal
  closeModal() {
    const modalElement = document.getElementById('questionModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
      modal.hide();
    }
  }

  // Xử lý lỗi từ backend
  handleBackendErrors(error: any) {
    if (error.status === 409 && error.error) {
      if (error.error.includes('Mã câu hỏi')) {
        this.backendErrors = { questionCode: error.error };
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
