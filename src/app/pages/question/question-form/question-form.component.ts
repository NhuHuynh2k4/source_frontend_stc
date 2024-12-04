import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuestionService } from 'src/app/services/question.service';
import { QuestionTypeService } from 'src/app/services/questionType.service'; // Add service for question types
import { SubjectService } from 'src/app/services/subject.service';
import Swal from 'sweetalert2'; // Import SweetAlert2
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
  subjects: any[] = [];
  questionTypes: any[] = [];  // New array for question types
  @Output() questionUpdated = new EventEmitter<void>();

  constructor(private fb: FormBuilder,
              private questionService: QuestionService,
              private cdr: ChangeDetectorRef,
              private subjectService: SubjectService,
              private questionTypeService: QuestionTypeService) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadSubjects();
    this.loadQuestionTypes(); // Load question types

    this.questionService.selectedQuestion$.subscribe(questionData => {
      if (questionData) {
        this.loadQuestionData(questionData);
      }
    });
  }

  // Load subjects from API
  loadSubjects() {
    this.subjectService.getAllSubjects().subscribe(
      (data) => {
        this.subjects = data;
      },
      (error) => {
        console.error('Error loading subjects', error);
      }
    );
  }

  // Load question types from API
  loadQuestionTypes() {
    this.questionTypeService.getQuestionType().subscribe(
      (data) => {
        this.questionTypes = data;  // Store the question types
      },
      (error) => {
        console.error('Error loading question types', error);
      }
    );
  }

  // Initialize the form
  initializeForm() {
    this.questionForm = this.fb.group({
      questionID: [''],
      questionCode: ['', Validators.required],
      questionName: ['', Validators.required],
      questionTextContent: ['', Validators.required],
      questionImgContent: [''],
      subjectsID: ['', Validators.required],
      questionTypeID: ['', Validators.required]  // Add validation for question type
    });
  }

  // Set form validators based on whether it's an update or a new question
  setFormValidators() {
    if (this.isUpdate) {
      this.questionForm.get('questionCode')?.clearValidators();
    } else {
      this.questionForm.get('questionCode')?.setValidators([Validators.required]);
    }
    this.questionForm.get('questionCode')?.updateValueAndValidity();
  }

  // Load data into the form for editing
  loadQuestionData(questionData: any): void {
    this.isUpdate = true;
    this.questionForm.patchValue({
      questionID: questionData.questionID,
      questionCode: questionData.questionCode,
      questionName: questionData.questionName,
      questionTextContent: questionData.questionTextContent,
      questionImgContent: questionData.questionImgContent,
      subjectsID: questionData.subjectsID,
      questionTypeID: questionData.questionTypeID  // Preselect the question type
    });
  }

  // Reset the form
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
    this.cdr.detectChanges();
  }

  // Handle form submission
  onSubmit() {
    this.backendErrors = {};
    this.successMessage = '';

    if (this.questionForm.invalid) {
      this.questionForm.markAllAsTouched();
      return;
    }

    const questionData = this.questionForm.getRawValue();
    console.log('Question Data being sent:', questionData);

    const apiCall = this.isUpdate
      ? this.questionService.updateQuestion(questionData)
      : this.questionService.createQuestion(questionData);

    apiCall.subscribe({
      next: (response) => {
        if (response && response.message) {
          this.successMessage = response.message;
          console.log(this.successMessage);

          // Đặt tiêu đề và nội dung thông báo thành công động
          const successTitle = this.isUpdate ? 'Cập nhật thành công!' : 'Thêm câu hỏi thành công!';
          const successText = response.message;

          // SweetAlert2 thông báo thành công
          Swal.fire({
            title: successTitle,
            text: successText,
            icon: 'success',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              // Reload trang sau khi xác nhận
              window.location.reload();
            }
          });

          // Đóng modal
          this.closeModal();

          // Phát sự kiện cập nhật danh sách câu hỏi
          this.questionUpdated.emit();

          // Reset form sau khi thành công
          this.resetForm();

          // Trigger change detection
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Lỗi:', error);

        // Xử lý lỗi backend và hiển thị
        Swal.fire({
          title: 'Lỗi!',
          text: error.error?.message || 'Đã xảy ra lỗi khi xử lý câu hỏi.',
          icon: 'error',
          confirmButtonText: 'OK'
        });

        this.handleBackendErrors(error);
      }
    });
  }


  // Close the modal
  closeModal() {
    const modalElement = document.getElementById('questionModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
      modal.hide();
    }
  }

  // Handle backend errors
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
